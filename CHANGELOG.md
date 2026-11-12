# Changelog — Porto Velho Agora

Registros de decisões e revisão técnica; em ordem cronológica de implementação. As datas são reais, sem retrodatagem artificial de commits.

## 2026-11-12 — Início e preservação da spec
- Criada a estrutura Git e preservada integralmente a especificação enviada em `spec-original.md`.
- Decisão de adaptar a arquitetura original de PHP/MySQL/XAMPP para Next.js/Neon/Vercel, visando URL pública em hospedagem gratuita e integração solicitada.
- **Revisão necessária:** confirmar com o professor se a substituição da stack original é permitida.

## 2026-11-12 — Backend e segurança inicial
- Banco PostgreSQL com tabelas `usuarios`, `avisos`, `avisos_imagens`, `sessoes`, `tentativas_login` e chaves/índices.
- Criado cadastro com bcrypt custo 12, login com cookie seguro, logout com revogação e rotas de avisos.
- Revisão do design inicial: **não usar disco local da Vercel para fotos**, pois não é armazenamento persistente; optado pelo armazenamento transacional de fotos na tabela `avisos_imagens`, com limite de 2 MB e validação de assinatura.
- Revisão de risco: consultas SQL parametrizadas; credenciais apenas no ambiente; checagem de origem; limitação de tentativas de login; retorno genérico de erros do servidor.
- Testes unitários implementados para cadastro, campos obrigatórios, imagens e origem.

## 2026-11-12 — Interface e fluxos principais
- Criadas páginas mobile-first: início, filtros, detalhes, registro, login, publicação, meus avisos e páginas de erro.
- Visual comunitário azul/verde com CSS próprio e SVGs sem dependência de imagens externas.
- Tratamento de validação e mensagens de falha nos formulários.

## 2026-11-12 — Documentação e preparação de deploy
- Spec atualizada para refletir fielmente a arquitetura implementada.
- Elaborado roteiro de deployment em Neon/Vercel/GitHub e teste de fumaça somente-leitura.
- Checklist de segurança com distinção entre verificações automatizadas e verificações **pendentes**.

## Status de validação

- [x] Testes unitários locais de validação com Node.js.
- [x] Revisão de código estática e configuração do `.gitignore`.
- [ ] Instalação das dependências e `next build` em ambiente com rede de pacotes.
- [ ] Criação e migração do banco Neon real.
- [ ] Publicação de código e histórico no GitHub do estudante.
- [ ] Publicação pública no Vercel e teste de fumaça real.
- [ ] Teste de ponta a ponta com cadastro, login, dois avisos (com e sem foto), filtros e logout.
- [ ] **Revisão humana** documentada e aprovada pelo estudante/professor, especialmente conforme Anexo B da apostila.

**Integridade acadêmica:** o que foi verificado por código/IA está descrito como revisão técnica. Não se declara revisão humana nem funcionamento em produção sem que tenham ocorrido de fato. O professor deve poder conferir o histórico verdadeiro, as limitações e as evidências.

## 2026-11-12 — Revisão técnica adicional
- Revisados 33 arquivos JavaScript (sintaxe JSX/JS e resolução de importações): zero erros encontrados por análise estática.
- Reexecutados cinco testes automatizados: todos passaram.
- Corrigido retorno dos IDs para texto na API, evitando problemas de serialização de inteiros grandes.
- Inserida verificação inicial do tamanho declarado da requisição multipart, além do limite do arquivo e da restrição de tamanho no banco.
- Documentada de forma explícita a ausência de evidência de uso do Google Antigravity, para não criar um relatório acadêmico falso.

## 2026-11-12 — Validação contínua
- Criado workflow GitHub Actions para instalar dependências, executar testes unitários, conferir arquivos sensíveis e compilar o Next.js em cada push/PR.
- Adicionados cabeçalhos HTTP `nosniff`, `Referrer-Policy`, `X-Frame-Options` e `Permissions-Policy` para reduzir exposição a vetores comuns de navegador.
- O workflow será efetivamente executado **apenas após publicar o repositório no GitHub**. Ainda não há resultado de CI real para alegar como aprovado.

## 2026-11-12 — Auditoria e preparação real da publicação
- Confirmados e preservados os seis commits recebidos no ZIP, de `0e47430` a `349b48d`; sem reescrever autores ou datas.
- Instaladas dependências, criado lockfile e alterado CI para `npm ci`; primeira compilação de produção concluída.
- Reforçado CSRF: rejeição de origem ausente, nula, de outro protocolo ou cross-site.
- Corrigida confiança exclusiva no Content-Length: limite aplicado aos bytes realmente recebidos, inclusive JSON e multipart transmitidos sem tamanho declarado.
- Upload agora exige extensão correspondente, decodifica e recodifica JPEG/PNG/WEBP via sharp, remove metadados e conteúdo anexado, rejeita imagens falsas, animadas ou com mais de 20 milhões de pixels.
- Corrigida janela de concorrência no bloqueio de login: reserva atômica antes do bcrypt, limites por e-mail e IP; cadastro também limitado por IP. Hash fictício de comparação reduz diferença de tempo para conta inexistente.
- Corrigido rótulo acessível da senha após primeira execução Playwright; acrescentado link para pular ao conteúdo e aplicada cor de fundo original #F0F4F8.
- Migração testada em branch isolada do projeto Neon existente; cinco tabelas conferidas. Adaptada execução para transação atômica e carregamento de `.env.local` pelo comando npm.
- Nove testes unitários executados e aprovados; `npm audit` sem vulnerabilidades. Varredura dos seis commits encontrou apenas URLs fictícias dos exemplos, nenhum segredo reconhecido.
- Tentativas reais de criar GitHub bloqueadas: GraphQL `CreateRepository` e REST HTTP 403 `Resource not accessible by integration`. Autorização verbal do usuário não amplia as permissões do token.
- Criado projeto Vercel na equipe autorizada, Node 24 e variável DATABASE_URL sensível; evidências de produção serão registradas após os testes.
- Revisão humana e conferência do Anexo B permanecem pendentes. Nenhuma revisão humana foi atribuída ao estudante.
