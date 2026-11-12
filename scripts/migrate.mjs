import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL não configurada. Leia .env.example e docs/ENTREGA.md.');
  process.exit(1);
}
const sql = neon(process.env.DATABASE_URL);
const schema = await readFile(new URL('../schema.sql', import.meta.url), 'utf8');
// O schema deste projeto usa SQL simples sem corpos de funções/delimitadores ; internos.
const statements = schema.split(';').map(s => s.trim()).filter(Boolean);
await sql.transaction(statements.map(statement => sql.query(statement)));
console.log(`Banco atualizado: ${statements.length} comandos SQL executados.`);
