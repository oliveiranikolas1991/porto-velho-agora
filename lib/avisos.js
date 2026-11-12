import { db } from './db';
import { CATEGORIAS, parsePositiveId } from './validation';

export async function listAvisos({ categoria = '', bairro = '' } = {}) {
  const cat = CATEGORIAS.includes(categoria) ? categoria : '';
  const neighborhood = typeof bairro === 'string' ? bairro.trim().slice(0, 80) : '';
  const sql = db();
  return await sql`
    SELECT a.id, a.titulo, a.descricao, a.categoria, a.bairro, a.imagem_url, a.criado_em,
           u.nome AS autor
    FROM avisos a JOIN usuarios u ON u.id = a.usuario_id
    WHERE a.status = 'ativo'
      AND (${cat} = '' OR a.categoria = ${cat})
      AND (${neighborhood} = '' OR a.bairro ILIKE ${'%' + escapeLike(neighborhood) + '%'} ESCAPE '!')
    ORDER BY a.criado_em DESC, a.id DESC LIMIT 100
  `;
}
function escapeLike(value) { return value.replace(/[!%_]/g, (ch) => `!${ch}`); }

export async function getAviso(id) {
  const num = parsePositiveId(String(id));
  if (!num) return null;
  const sql = db();
  const rows = await sql`
    SELECT a.id, a.titulo, a.descricao, a.categoria, a.bairro, a.imagem_url, a.criado_em,
           u.nome AS autor
    FROM avisos a JOIN usuarios u ON u.id = a.usuario_id
    WHERE a.id = ${num} AND a.status = 'ativo' LIMIT 1`;
  return rows[0] || null;
}

export async function listMyAvisos(userId) {
  const sql = db();
  return await sql`
    SELECT id, titulo, descricao, categoria, bairro, imagem_url, criado_em
    FROM avisos WHERE usuario_id = ${userId}
    ORDER BY criado_em DESC, id DESC LIMIT 100`;
}
