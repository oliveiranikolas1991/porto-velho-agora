import { readJson } from '../../../lib/request';
import { clientIp, takeAttempt } from '../../../lib/rate-limit';
import bcrypt from 'bcryptjs';
import { db } from '../../../lib/db';
import { validateSignup, checkOrigin } from '../../../lib/validation';

export const runtime = 'nodejs';
export async function POST(request) {
  if (!checkOrigin(request)) return Response.json({ error: 'Origem não autorizada.' }, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'Formato inválido.' }, { status: 415 });
  let data;
  try {
    data = await readJson(request);
  } catch (err) { return Response.json({ error: err.message || 'Dados inválidos.' }, { status: err.status || 400 }); }
  const result = validateSignup(data);
  if (result.error) return Response.json({ error: result.error }, { status: 400 });
  const { nome, email, senha } = result.value;
  try {
    const sql = db();
    if (!(await takeAttempt(sql, 'cadastro-ip', clientIp(request), 20)))
      return Response.json({ error: 'Muitos cadastros. Tente novamente em 15 minutos.' }, { status: 429 });
    const hash = await bcrypt.hash(senha, 12);
    await sql`INSERT INTO usuarios (nome, email, senha_hash) VALUES (${nome}, ${email}, ${hash})`;
    return Response.json({ success: true }, { status: 201 });
  } catch (err) {
    if (err?.code === '23505') return Response.json({ error: 'Este e-mail já está em uso.' }, { status: 409 });
    console.error('Erro no cadastro:', err?.code || 'internal');
    return Response.json({ error: 'Não foi possível concluir o cadastro.' }, { status: 500 });
  }
}
