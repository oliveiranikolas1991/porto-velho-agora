export class RequestError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

// Limita o conteúdo efetivamente recebido, mesmo sem Content-Length.
export async function readBody(request, limit) {
  const declared = Number(request.headers.get('content-length') || 0);
  if (declared > limit) throw new RequestError('Envio excede o limite permitido.', 413);
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks = []; let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > limit) { await reader.cancel(); throw new RequestError('Envio excede o limite permitido.', 413); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(chunks, total);
}

export async function readJson(request) {
  const body = await readBody(request, 10_000);
  try { return JSON.parse(new TextDecoder().decode(body)); }
  catch { throw new RequestError('Dados inválidos.'); }
}
