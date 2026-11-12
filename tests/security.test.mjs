import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { prepareImage } from '../lib/image.js';
import { checkOrigin } from '../lib/validation.js';
import { readBody, readJson } from '../lib/request.js';

test('CSRF rejeita origem ausente, nula, protocolo diferente e cross-site', () => {
  for (const headers of [{}, { origin: 'null' }, { origin: 'http://app.test' }, { origin: 'https://app.test', 'sec-fetch-site': 'cross-site' }])
    assert.equal(checkOrigin(new Request('https://app.test/api/sair', { headers })), false);
});

test('corpo transmitido sem Content-Length também respeita limite', async () => {
  const request = new Request('https://app.test', { method: 'POST', body: 'x'.repeat(100) });
  await assert.rejects(() => readBody(request, 50), err => err.status === 413);
  await assert.rejects(() => readJson(new Request('https://app.test', { method: 'POST', body: '{' })), err => err.status === 400);
});

test('assinatura falsificada não é suficiente para upload', async () => {
  const fake = Buffer.from([137,80,78,71,13,10,26,10,0,0,0,0]);
  assert.ok((await prepareImage(fake, 'image/png', 'foto.png')).error);
});

test('decodifica JPEG/PNG/WEBP reais, exige extensão correta e remove conteúdo anexado', async () => {
  for (const [format, extension, mime] of [['jpeg', 'jpg', 'image/jpeg'], ['png', 'png', 'image/png'], ['webp', 'webp', 'image/webp']]) {
    const image = await sharp({ create: { width: 16, height: 16, channels: 3, background: '#173e79' } }).toFormat(format).toBuffer();
    assert.ok((await prepareImage(image, mime, 'arquivo.exe')).error);
    const result = await prepareImage(Buffer.concat([image, Buffer.from('DADO_ANEXADO')]), mime, `foto.${extension}`);
    assert.ok(result.value);
    assert.equal(Buffer.from(result.value.hex, 'hex').includes(Buffer.from('DADO_ANEXADO')), false);
  }
});
