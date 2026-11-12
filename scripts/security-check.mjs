// Execute: node scripts/security-check.mjs (checagens estáticas básicas; não substituem auditoria).
import { execFileSync } from 'node:child_process';
const files = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n').filter(Boolean);
const sensitive = files.filter(p => /^\.env($|\.)/.test(p) && p !== '.env.example' || /(?:secret|credential|password)\.json$/i.test(p));
if (sensitive.length) { console.error('Arquivos sensíveis rastreados:', sensitive.join(', ')); process.exit(1); }
console.log(`OK: nenhum arquivo de ambiente/segredo conhecido entre ${files.length} arquivos rastreados.`);
