import sharp from 'sharp';
import { validateImage, MAX_IMAGEM } from './validation.js';

export async function prepareImage(bytes, mime, filename) {
  const checked = validateImage(bytes, mime, filename);
  if (checked.error) return checked;
  try {
    // Decodifica e recodifica, removendo metadados e conteúdo anexado.
    const image = sharp(bytes, { limitInputPixels: 20_000_000, failOn: 'warning' });
    const metadata = await image.metadata();
    if ((metadata.pages || 1) > 1) return { error: 'Envie uma imagem estática.' };
    const format = { 'image/jpeg': 'jpeg', 'image/png': 'png', 'image/webp': 'webp' }[mime];
    const output = await image.rotate().toFormat(format).toBuffer();
    if (output.length > MAX_IMAGEM) return { error: 'A imagem processada deve ter no máximo 2 MB.' };
    return { value: { mime, size: output.length, hex: output.toString('hex') } };
  } catch { return { error: 'Não foi possível decodificar a imagem. Envie um JPEG, PNG ou WEBP válido.' }; }
}
