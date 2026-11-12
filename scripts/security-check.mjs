// Verificação estática do estado atual e de todos os blobs do histórico.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
const files = git('ls-files').split('\n').filter(Boolean);
const sensitive = files.filter(p => /(^|\/)\.env($|\.)/.test(p) && p !== '.env.example' || /(?:secret|credential|password)\.json$/i.test(p));
const secrets = text => /gh[pousr]_[A-Za-z0-9]{25,}|AKIA[A-Z0-9]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text)
  || [...text.matchAll(/postgres(?:ql)?:\/\/[^\s"'`]+/g)].some(([url]) => !/^postgres(?:ql)?:\/\/usuario:senha@host\.neon\.tech\//i.test(url));
const findings = [];
for (const path of files) if (secrets(readFileSync(path, 'utf8'))) findings.push(`atual:${path}`);
const objects = git('rev-list', '--objects', '--all').trim().split('\n');
let scanned = 0;
for (const entry of objects) {
  const [sha, ...pathParts] = entry.split(' ');
  if (git('cat-file', '-t', sha).trim() !== 'blob') continue;
  scanned++;
  if (secrets(git('cat-file', '-p', sha))) findings.push(`histórico:${pathParts.join(' ')}`);
}
if (sensitive.length || findings.length) {
  console.error('REPROVADO: arquivos suspeitos (valores omitidos):', [...sensitive, ...findings]); process.exit(1);
}
console.log(`OK: ${files.length} arquivos e ${scanned} blobs do histórico; nenhum segredo reconhecido. Análise heurística, não garantia absoluta.`);
