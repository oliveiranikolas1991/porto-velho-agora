import { db } from '../../../../../lib/db';
import { parsePositiveId } from '../../../../../lib/validation';

export const runtime = 'nodejs';
export async function GET(_request, { params }) {
  const { id } = await params;
  const num = parsePositiveId(id);
  if (!num) return new Response('Não encontrado', { status: 404 });
  try {
    const sql = db();
    const rows = await sql`
      SELECT i.tipo_mime, encode(i.conteudo, 'base64') AS base64
      FROM avisos_imagens i JOIN avisos a ON a.id = i.aviso_id
      WHERE i.aviso_id = ${num} AND a.status = 'ativo' LIMIT 1`;
    if (!rows.length) return new Response('Não encontrado', { status: 404 });
    const bytes = Buffer.from(rows[0].base64, 'base64');
    return new Response(bytes, {
      headers: { 'Content-Type': rows[0].tipo_mime, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'public, max-age=300' }
    });
  } catch (err) {
    console.error('Erro ao obter imagem:', err?.code || 'internal');
    return new Response('Não foi possível carregar a imagem', { status: 500 });
  }
}
