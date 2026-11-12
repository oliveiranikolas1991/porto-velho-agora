import { db } from '../../../lib/db';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const sql = db();
    await sql`SELECT 1 AS ok`;
    return Response.json({ status: 'ok', database: 'connected' }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ status: 'unavailable', database: 'disconnected' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
