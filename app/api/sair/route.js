import { endSession } from '../../../lib/session';
import { checkOrigin } from '../../../lib/validation';

export const runtime = 'nodejs';
export async function POST(request) {
  if (!checkOrigin(request)) return Response.json({ error: 'Origem não autorizada.' }, { status: 403 });
  try {
    await endSession();
    return Response.json({ success: true });
  } catch (err) {
    console.error('Falha no logout:', err?.code || 'internal');
    return Response.json({ error: 'Não foi possível encerrar a sessão.' }, { status: 500 });
  }
}
