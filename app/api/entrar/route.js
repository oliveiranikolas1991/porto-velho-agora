import bcrypt from 'bcryptjs';
import { createHash } from 'node:crypto';
import { db } from '../../../lib/db';
import { startSession } from '../../../lib/session';
import { checkOrigin, validateLogin } from '../../../lib/validation';

export const runtime = 'nodejs';
export async function POST(request) {
  if (!checkOrigin(request)) return Response.json({ error: 'Origem não autorizada.' }, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'Formato inválido.' }, { status: 415 });
  let data;
  try {
    const body = await request.text();
    if (body.length > 10_000) return Response.json({ error: 'Dados excessivos.' }, { status: 413 });
    data = JSON.parse(body);
  } catch { return Response.json({ error: 'Dados inválidos.' }, { status: 400 }); }
  const validated = validateLogin(data);
  if (validated.error) return Response.json({ error: validated.error }, { status: 400 });
  const { email, senha } = validated.value;
  const ip = request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') || 'unknown';
  const key = createHash('sha256').update(`${String(ip).slice(0,80)}:${email}`).digest('hex');
  try {
    const sql = db();
    const [attempt] = await sql`SELECT quantidade, ultima_tentativa FROM tentativas_login WHERE chave_hash = ${key}`;
    if (attempt && attempt.quantidade >= 8 && Date.now() - new Date(attempt.ultima_tentativa).getTime() < 15 * 60_000)
      return Response.json({ error: 'Muitas tentativas. Tente novamente em 15 minutos.' }, { status: 429 });
    const [user] = await sql`SELECT id, senha_hash FROM usuarios WHERE email = ${email} LIMIT 1`;
    if (!user || !(await bcrypt.compare(senha, user.senha_hash))) {
      await sql`INSERT INTO tentativas_login (chave_hash, quantidade, ultima_tentativa)
        VALUES (${key}, 1, NOW())
        ON CONFLICT (chave_hash) DO UPDATE SET
          quantidade = CASE WHEN tentativas_login.ultima_tentativa < NOW() - INTERVAL '15 minutes'
            THEN 1 ELSE tentativas_login.quantidade + 1 END,
          ultima_tentativa = NOW()`;
      return Response.json({ error: 'E-mail ou senha incorretos.' }, { status: 401 });
    }
    await sql`DELETE FROM tentativas_login WHERE chave_hash = ${key}`;
    await startSession(user.id);
    return Response.json({ success: true });
  } catch (err) {
    console.error('Erro no login:', err?.code || 'internal');
    return Response.json({ error: 'Não foi possível entrar agora.' }, { status: 500 });
  }
}
