import { readJson } from '../../../lib/request';
import { clientIp, takeAttempt } from '../../../lib/rate-limit';
import bcrypt from 'bcryptjs';
import { db } from '../../../lib/db';
import { startSession } from '../../../lib/session';
import { checkOrigin, validateLogin } from '../../../lib/validation';

export const runtime = 'nodejs';
export async function POST(request) {
  if (!checkOrigin(request)) return Response.json({ error: 'Origem não autorizada.' }, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'Formato inválido.' }, { status: 415 });
  let data;
  try {
    data = await readJson(request);
  } catch (err) { return Response.json({ error: err.message || 'Dados inválidos.' }, { status: err.status || 400 }); }
  const validated = validateLogin(data);
  if (validated.error) return Response.json({ error: validated.error }, { status: 400 });
  const { email, senha } = validated.value;
  try {
    const sql = db();
    const allowedIp = await takeAttempt(sql, 'login-ip', clientIp(request), 50);
    const allowedEmail = await takeAttempt(sql, 'login-email', email, 8);
    if (!allowedIp || !allowedEmail)
      return Response.json({ error: 'Muitas tentativas. Tente novamente em 15 minutos.' }, { status: 429, headers: { 'Retry-After': '900' } });
    const [user] = await sql`SELECT id, senha_hash FROM usuarios WHERE email = ${email} LIMIT 1`;
    const validPassword = await bcrypt.compare(senha, user?.senha_hash || '$2b$12$C6UzMDM.H6dfI/f/IKcEe.6Yv7HGaK6h.Pj3fyAVHmB1kBAy4TNYq');
    if (!user || !validPassword) {
      return Response.json({ error: 'E-mail ou senha incorretos.' }, { status: 401 });
    }
    await startSession(user.id);
    return Response.json({ success: true });
  } catch (err) {
    console.error('Erro no login:', err?.code || 'internal');
    return Response.json({ error: 'Não foi possível entrar agora.' }, { status: 500 });
  }
}
