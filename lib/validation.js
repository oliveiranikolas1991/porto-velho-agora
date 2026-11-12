export const CATEGORIAS = ['Feiras', 'Buracos', 'Chuvas', 'Eventos', 'Outros'];
export const MAX_IMAGEM = 2 * 1024 * 1024;
export const MIMES = ['image/jpeg', 'image/png', 'image/webp'];
const clean = (value) => typeof value === 'string' ? value.trim() : '';

export function validateSignup(data) {
  const nome = clean(data?.nome).replace(/\s+/g, ' ');
  const email = clean(data?.email).toLowerCase();
  const senha = typeof data?.senha === 'string' ? data.senha : '';
  if (nome.length < 2 || nome.length > 100) return { error: 'Informe um nome com 2 a 100 caracteres.' };
  if (email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Informe um e-mail válido.' };
  if (senha.length < 8 || Buffer.byteLength(senha, 'utf8') > 72) return { error: 'A senha precisa ter 8 a 72 bytes.' };
  return { value: { nome, email, senha } };
}

export function validateLogin(data) {
  const email = clean(data?.email).toLowerCase();
  const senha = typeof data?.senha === 'string' ? data.senha : '';
  if (!email || !senha || email.length > 150 || senha.length > 200) return { error: 'Preencha e-mail e senha válidos.' };
  return { value: { email, senha } };
}

export function validateAviso(data) {
  const titulo = clean(data?.titulo);
  const descricao = clean(data?.descricao);
  const categoria = clean(data?.categoria);
  const bairro = clean(data?.bairro).replace(/\s+/g, ' ');
  if (titulo.length < 5 || titulo.length > 120) return { error: 'O título deve ter de 5 a 120 caracteres.' };
  if (descricao.length < 10 || descricao.length > 5000) return { error: 'A descrição deve ter de 10 a 5.000 caracteres.' };
  if (!CATEGORIAS.includes(categoria)) return { error: 'Escolha uma categoria válida.' };
  if (bairro.length < 2 || bairro.length > 80) return { error: 'Informe um bairro com 2 a 80 caracteres.' };
  return { value: { titulo, descricao, categoria, bairro } };
}

export function detectImageType(bytes) {
  if (!(bytes instanceof Uint8Array) || bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if ([137,80,78,71,13,10,26,10].every((n, i) => bytes[i] === n)) return 'image/png';
  if (String.fromCharCode(...bytes.slice(0,4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8,12)) === 'WEBP') return 'image/webp';
  return null;
}

export function validateImage(bytes, mime, filename) {
  if (!bytes || !bytes.length) return { error: 'A imagem está vazia.' };
  if (bytes.byteLength > MAX_IMAGEM) return { error: 'A imagem deve ter no máximo 2 MB.' };
  const extensions = { 'image/jpeg': /\.jpe?g$/i, 'image/png': /\.png$/i, 'image/webp': /\.webp$/i };
  if (filename !== undefined && (typeof filename !== 'string' || !extensions[mime]?.test(filename)))
    return { error: 'A extensão do arquivo deve corresponder ao formato JPEG, PNG ou WEBP.' };
  const detected = detectImageType(bytes);
  if (!MIMES.includes(mime) || detected !== mime) return { error: 'Envie somente uma imagem JPEG, PNG ou WEBP válida.' };
  return { value: { mime, size: bytes.byteLength } };
}

export function parsePositiveId(value) {
  if (typeof value !== 'string' || !/^[1-9]\d{0,14}$/.test(value)) return null;
  const num = Number(value);
  return Number.isSafeInteger(num) ? num : null;
}

export function checkOrigin(request) {
  if (request.headers.get('sec-fetch-site') === 'cross-site') return false;
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try { return new URL(origin).origin === new URL(request.url).origin; }
  catch { return false; }
}
