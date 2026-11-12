# Porto Velho Agora

**A cidade acontece. Você fica sabendo.**

Portal comunitário responsivo para Porto Velho (RO), em que cidadãos publicam avisos de utilidade pública e visitantes acompanham acontecimentos locais sem criar conta.

## Funcionalidades

- Feed público de avisos em ordem cronológica, com filtros de **categoria e bairro**.
- Cadastro, login e logout com senhas em **bcrypt**, sessões persistidas no PostgreSQL.
- Publicação de aviso com **imagem opcional** JPEG, PNG ou WEBP de até 2 MB.
- Detalhes do aviso com bairro, data, autor e foto.
- Área protegida **Meus avisos**.
- Design responsivo em azul e verde inspirado em Rondônia.

## Tecnologia

Next.js 16 / React 19 / Node.js / Neon PostgreSQL (`@neondatabase/serverless`) / Vercel. A spec original PHP/MySQL foi preservada em [`spec-original.md`](spec-original.md) e a adaptada, que corresponde ao código, está em [`spec.md`](spec.md).

## Sistema publicado

**URL pública:** https://porto-velho-agora.vercel.app

**GitHub:** https://github.com/oliveiranikolas1991/porto-velho-agora — repositório público com os seis commits originais e as correções preservadas.

**Banco:** PostgreSQL 17 no projeto Neon existente `sparkling-pond-43274194`, banco `neondb`. As cinco tabelas foram criadas após validação em branch isolada, sem exclusão de dados.

## Executar localmente

É preciso Node.js 24 e uma base PostgreSQL Neon com as tabelas criadas.

```bash
npm ci
cp .env.example .env.local
# Edite .env.local: DATABASE_URL recebe sua string REAL da Neon, não comite o arquivo.
# O comando carrega .env.local sem exibir a conexão:
npm run db:migrate
npm run dev
```

**Ambiente:** `DATABASE_URL` é a única variável obrigatória. Obtenha a conexão no painel Neon e mantenha `.env.local` privado. Em produção ela está configurada como variável sensível na Vercel. Não coloque segredos em comandos, commits ou screenshots.

## Testes e verificações

```bash
npm test              # testes unitários
npm run build         # compilação de produção
npm run security      # arquivos sensíveis rastreados (verificação estática básica)
npm run smoke -- https://porto-velho-agora.vercel.app   # leitura, conectividade e rotas públicas
```

Os nove testes unitários, auditoria de dependências e build passaram nesta revisão. Dois cenários completos de navegador, desktop e Pixel 7, passaram contra uma branch real do Neon. Evidências e status de produção ficam em `docs/VERIFICACAO.md`. A revisão humana permanece pendente.

Para os testes de navegador, instale o Chromium do Playwright (`npx playwright install chromium`) ou defina `CHROMIUM_PATH` para seu binário. Execute com o servidor iniciado:

```bash
npm run e2e
BASE_URL=https://porto-velho-agora.vercel.app npm run e2e
```

O E2E cria contas `@example.invalid` com senhas aleatórias e avisos marcados `[TESTE AUTOMATIZADO]`; não relata ocorrências reais. Use preferencialmente banco de teste. Relatórios e screenshots ficam em `test-results/` (ignorado pelo Git).

## Publicação e entrega

Leia [`docs/ENTREGA.md`](docs/ENTREGA.md) para consultar a publicação, o estado da conexão Vercel e o procedimento de atualização. O professor deve receber **GitHub + URL funcionando + spec + changelog**.

Leia também [`CHANGELOG.md`](CHANGELOG.md) e [`docs/SEGURANCA.md`](docs/SEGURANCA.md). Nunca comite `.env.local` ou a string de conexão real.

## Limites do MVP

Não há moderação/denúncias, recuperação de senha, edição de avisos ou paginação após 100 avisos. O conteúdo é produzido pelos colaboradores; não é uma fonte oficial da prefeitura. O armazenamento de fotos em PostgreSQL foi escolhido para simplificar o MVP, não para grandes volumes.
