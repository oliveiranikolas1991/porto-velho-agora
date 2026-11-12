import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { db } from './db';

export const COOKIE_NAME = 'pva_session';
const DURATION_SEC = 7 * 24 * 60 * 60;
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

export async function currentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const sql = db();
  const rows = await sql`
    SELECT u.id, u.nome, u.email
    FROM sessoes s JOIN usuarios u ON u.id = s.usuario_id
    WHERE s.token_hash = ${sha256(token)} AND s.expira_em > NOW()
    LIMIT 1
  `;
  return rows[0] || null;
}

export async function startSession(userId) {
  const token = randomBytes(32).toString('hex');
  const sql = db();
  await sql`INSERT INTO sessoes (token_hash, usuario_id, expira_em)
    VALUES (${sha256(token)}, ${userId}, NOW() + INTERVAL '7 days')`;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
    path: '/', maxAge: DURATION_SEC,
  });
}

export async function endSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token && /^[a-f0-9]{64}$/.test(token)) {
    const sql = db();
    await sql`DELETE FROM sessoes WHERE token_hash = ${sha256(token)}`;
  }
  cookieStore.delete(COOKIE_NAME);
}
