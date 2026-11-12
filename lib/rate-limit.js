import { createHash } from 'node:crypto';

export function clientIp(request) {
  return (request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim().slice(0, 80);
}

export async function takeAttempt(sql, scope, identifier, limit) {
  const key = createHash('sha256').update(`${scope}:${identifier}`).digest('hex');
  // Reserva atômica antes do bcrypt: concorrência não contorna o limite.
  const [row] = await sql`INSERT INTO tentativas_login (chave_hash, quantidade, ultima_tentativa)
    VALUES (${key}, 1, NOW())
    ON CONFLICT (chave_hash) DO UPDATE SET
      quantidade = CASE WHEN tentativas_login.ultima_tentativa < NOW() - INTERVAL '15 minutes'
        THEN 1 ELSE tentativas_login.quantidade + 1 END,
      ultima_tentativa = CASE WHEN tentativas_login.ultima_tentativa < NOW() - INTERVAL '15 minutes'
        THEN NOW() ELSE tentativas_login.ultima_tentativa END
    RETURNING quantidade`;
  return Number(row.quantidade) <= limit;
}
