// Teste somente-leitura para URL publicada; execute: npm run smoke -- https://dominio.vercel.app
const base = process.argv[2];
if (!base || !/^https:\/\/[a-z0-9.-]+(?::\d+)?\/?$/i.test(base)) {
  console.error('Uso: npm run smoke -- https://meu-projeto.vercel.app');
  process.exit(1);
}
const baseUrl = base.replace(/\/$/, '');
const checks = [
  { path: '/', expect: 200, text: 'Porto Velho' },
  { path: '/entrar', expect: 200, text: 'Entrar na conta' },
  { path: '/cadastrar', expect: 200, text: 'Criar minha conta' },
  { path: '/api/saude', expect: 200, json: true },
];
let fails = 0;
for (const { path, expect, text, json } of checks) {
  try {
    const response = await fetch(baseUrl + path, { redirect: 'follow', signal: AbortSignal.timeout(12000) });
    const body = await response.text();
    const valid = response.status === expect && (json ? JSON.parse(body).database === 'connected' : body.includes(text));
    console.log(`${valid ? 'PASS' : 'FAIL'} ${path} — HTTP ${response.status}`);
    if (!valid) fails++;
  } catch (err) { fails++; console.error(`FAIL ${path} — ${err.message}`); }
}
process.exit(fails ? 1 : 0);
