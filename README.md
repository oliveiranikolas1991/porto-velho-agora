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

## Executar localmente

É preciso Node.js 22+ e uma base PostgreSQL Neon com as tabelas criadas.

```bash
npm install
cp .env.example .env.local
# Edite .env.local: DATABASE_URL recebe sua string REAL da Neon, não comite o arquivo.
# Para migração via CLI, exporte DATABASE_URL no seu terminal e rode:
npm run db:migrate
npm run dev
```

**Observação:** o `scripts/migrate.mjs` lê `process.env.DATABASE_URL` do processo; não carrega `.env.local` automaticamente. Uma opção é executar `node --env-file=.env.local scripts/migrate.mjs` (Node 22+) sem expor a variável em comando versionado. Alternativamente rode `schema.sql` no SQL Editor Neon.

## Testes e verificações

```bash
npm test              # testes unitários
npm run build         # compilação de produção
npm run security      # arquivos sensíveis rastreados (verificação estática básica)
npm run smoke -- https://URL-REAL-DA-VERCEL   # leitura, conectividade e rotas públicas
```

A execução de testes end-to-end com banco real e a revisão humana ainda precisam ser documentadas após o deploy. Não há dados falsos embutidos nem contas pré-criadas.

## Publicação e entrega

Leia [`docs/ENTREGA.md`](docs/ENTREGA.md) para criar as tabelas Neon, enviar o histórico Git ao GitHub, configurar `DATABASE_URL` na Vercel e validar o endereço público. O professor deve receber **GitHub + URL funcionando + spec + changelog**.

Leia também [`CHANGELOG.md`](CHANGELOG.md) e [`docs/SEGURANCA.md`](docs/SEGURANCA.md). Nunca comite `.env.local` ou a string de conexão real.

## Limites do MVP

Não há moderação/denúncias, recuperação de senha, edição de avisos ou paginação após 100 avisos. O conteúdo é produzido pelos colaboradores; não é uma fonte oficial da prefeitura. O armazenamento de fotos em PostgreSQL foi escolhido para simplificar o MVP, não para grandes volumes.
