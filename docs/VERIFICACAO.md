# Evidências de verificação — 12/11/2026

## Fluxo verificado

Visitante acessa feed → cria conta no formulário → API grava hash bcrypt no Neon → login cria sessão → usuário publica texto e imagem → visitante consulta detalhes e imagem → logout revoga a sessão.

## Ambiente e publicação

- URL pública: https://porto-velho-agora.vercel.app
- Projeto Vercel: `prj_Jz3kdqSPIwMu8d2vR0BrQB4mLoUB`, equipe `team_PWkAlWV9cdtQYTvMBJuWtiMF`.
- Primeiro deployment verificado: `dpl_EPHkfthBDyVfnWAEyt3ggaU4V2aG`, estado READY. O conteúdo funcional é dos commits `7e7d2d2` e `0c5bbba`; a documentação foi finalizada após essa verificação.
- Node local 24.22.1; Next.js 16.4.6; PostgreSQL 17, projeto Neon `sparkling-pond-43274194`, banco `neondb`.
- Branch isolada `verificacao-publicacao` usada antes da migração principal; não foi criado outro projeto Neon.
- DATABASE_URL em variável sensível da Vercel e arquivos locais ignorados pelo Git; nenhum valor reproduzido neste relatório.

## Comandos executados e resultados

| Verificação | Resultado real |
| --- | --- |
| `npm install --cache /workspace/work/npm-cache --no-fund` | Dependências instaladas; cache padrão indisponível foi substituído por pasta do workspace. |
| `npm test` | 9 testes aprovados. |
| `npm run security` | Estado atual e blobs de todo o histórico inspecionados; nenhum segredo reconhecido pela heurística. Não é garantia absoluta. |
| `npm audit` | 0 vulnerabilidades reportadas. |
| `npm run build` | Produção compilada com sucesso localmente e na Vercel. |
| Migração em branch e `npm run db:migrate` no principal | 9 comandos; cinco tabelas, chaves e índices criados. Sem exclusões. |
| `npm run e2e` | Desktop e Pixel 7 aprovados contra branch Neon, 2 cenários em 19,9 s. |
| `npm run smoke -- https://porto-velho-agora.vercel.app` | `/`, `/entrar`, `/cadastrar`, `/api/saude`: 4 PASS, HTTP 200. |
| `BASE_URL=https://porto-velho-agora.vercel.app npm run e2e` | Desktop e Pixel 7 aprovados, 2 cenários em 27,2 s; requer trust específico da CA de proxy neste ambiente. |
| Logs Vercel filtrados por error/fatal | Nenhuma entrada no período consultado após os testes. |

Na nuvem foi usado `NODE_USE_ENV_PROXY=1` para Node respeitar o proxy herdado. Chromium usou o proxy herdado e `CHROMIUM_TRUSTED_PROXY_SPKI` com SHA-256 da chave pública da CA local, apenas para permitir essa CA específica. Não foi usado `ignoreHTTPSErrors: true`. Em instalações comuns essas opções não são necessárias. O primeiro acesso Chromium remoto falhou por CA desconhecida e não foi registrado como aprovado.

## Cenários exercitados em cada viewport

- Feed público e banco conectado; páginas protegidas redirecionam visitantes.
- Cadastro inválido 400, cadastro válido por formulário 201, duplicidade com e-mail maiúsculo 409.
- Login incorreto 401 e login correto pelo formulário; cookie HttpOnly/Secure/SameSite=Lax.
- Aviso sem imagem gravado por API e consultado no navegador, com texto de teste contendo `<script>` exibido sem execução.
- Aviso com PNG enviado pelo formulário, imagem carregada e recuperada por visitante sem sessão.
- Filtros por categoria/bairro e listagem dos próprios avisos.
- Rejeição de PDF, extensão `.exe`, PNG falso, arquivo >2 MB e categoria desconhecida.
- Logout no navegador; publicação posterior e reutilização do token revogado retornam 401.
- Dez logins concorrentes para a mesma conta inexistente: oito 401 e dois 429.
- Nenhuma rolagem horizontal no viewport; screenshots capturados e inspecionados por IA.

## Conferência do PostgreSQL principal

Após os testes públicos: 2 usuários de teste, ambos com hashes bcrypt; 4 avisos claramente marcados `[TESTE AUTOMATIZADO]`; 2 imagens com `octet_length(conteudo) = tamanho_bytes`; 0 sessões após logout. As contas usam domínio reservado `example.invalid` e senhas aleatórias, que não foram publicadas. Esses dados não representam acontecimentos reais.

Tabelas: usuarios, avisos, avisos_imagens, sessoes e tentativas_login. Confirmados PKs, email único, FKs e checks de categoria/status/MIME/tamanho. A branch de verificação foi mantida para reproduzir a auditoria.

## Histórico e pendências

Seis commits originais preservados, sem mudar hashes, autores ou datas:

```
0e47430 chore: iniciar projeto e preservar spec original antes da adaptação
bd321ad feat: estruturar banco Neon, autenticacao segura e API de avisos
adf7b16 feat: criar interface responsiva e fluxos completos do portal
fc11313 docs: atualizar spec, changelog, seguranca e preparar deploy
9d359fb fix: reforcar upload, serializacao e documentar revisao com IA
349b48d ci: automatizar testes e aplicar headers de seguranca
```

Novos commits registram apenas as correções e verificações efetivamente realizadas. `spec-original.md` permanece idêntica à recebida.

GitHub: criação bloqueada por GraphQL `CreateRepository` e REST HTTP 403 `Resource not accessible by integration`. A autorização no chat não altera o escopo da conexão. É necessário criar um repositório público vazio `oliveiranikolas1991/porto-velho-agora` ou liberar uma conexão com permissão de criação, e então enviar o histórico. Não há commit publicado nem execução GitHub Actions confirmados. O site foi publicado por arquivos, sem integração de deploy automático por push.

Revisão humana, conferência exata do Anexo B (não fornecido), aprovação docente da troca PHP/MySQL → Next.js/PostgreSQL, auditoria manual completa de teclado/contraste e expiração natural após sete dias permanecem pendentes. Nenhum desses itens foi marcado como realizado.
