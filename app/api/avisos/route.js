import { db } from '../../../lib/db';
import { currentUser } from '../../../lib/session';
import { checkOrigin, validateAviso, validateImage } from '../../../lib/validation';

export const runtime = 'nodejs';
export async function POST(request) {
  if (!checkOrigin(request)) return Response.json({ error: 'Origem não autorizada.' }, { status: 403 });
  const declaredSize = Number(request.headers.get('content-length') || 0);
  if (declaredSize > 2 * 1024 * 1024 + 100_000)
    return Response.json({ error: 'Envio excede o limite permitido.' }, { status: 413 });
  const user = await currentUser();
  if (!user) return Response.json({ error: 'Entre na sua conta para publicar.' }, { status: 401 });
  if (!request.headers.get('content-type')?.startsWith('multipart/form-data'))
    return Response.json({ error: 'Formato inválido.' }, { status: 415 });
  try {
    const form = await request.formData();
    const validated = validateAviso({
      titulo: form.get('titulo'), descricao: form.get('descricao'),
      categoria: form.get('categoria'), bairro: form.get('bairro')
    });
    if (validated.error) return Response.json({ error: validated.error }, { status: 400 });
    const { titulo, descricao, categoria, bairro } = validated.value;
    const file = form.get('imagem');
    let picture = null;
    if (file && typeof file === 'object' && typeof file.arrayBuffer === 'function' && file.size > 0) {
      if (file.size > 2 * 1024 * 1024) return Response.json({ error: 'A imagem deve ter no máximo 2 MB.' }, { status: 400 });
      const bytes = new Uint8Array(await file.arrayBuffer());
      const imageValidation = validateImage(bytes, file.type);
      if (imageValidation.error) return Response.json({ error: imageValidation.error }, { status: 400 });
      picture = { hex: Buffer.from(bytes).toString('hex'), ...imageValidation.value };
    }
    const sql = db();
    if (!picture) {
      const [saved] = await sql`INSERT INTO avisos (usuario_id, titulo, descricao, categoria, bairro)
        VALUES (${user.id}, ${titulo}, ${descricao}, ${categoria}, ${bairro}) RETURNING id`;
      return Response.json({ success: true, id: String(saved.id) }, { status: 201 });
    }
    // Aloca ID antes para definir URL correta e inserir aviso + imagem de forma atômica.
    const [sequence] = await sql`SELECT nextval(pg_get_serial_sequence('avisos', 'id')) AS id`;
    const id = sequence.id;
    const url = `/api/avisos/${id}/imagem`;
    await sql.transaction([
      sql`INSERT INTO avisos (id, usuario_id, titulo, descricao, categoria, bairro, imagem_url)
          VALUES (${id}, ${user.id}, ${titulo}, ${descricao}, ${categoria}, ${bairro}, ${url})`,
      sql`INSERT INTO avisos_imagens (aviso_id, tipo_mime, conteudo, tamanho_bytes)
          VALUES (${id}, ${picture.mime}, decode(${picture.hex}, 'hex'), ${picture.size})`
    ]);
    return Response.json({ success: true, id: String(id) }, { status: 201 });
  } catch (err) {
    console.error('Erro ao publicar:', err?.code || 'internal');
    return Response.json({ error: 'Não foi possível publicar o aviso.' }, { status: 500 });
  }
}
