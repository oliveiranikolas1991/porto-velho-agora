# Spec final — Porto Velho Agora

**Versão:** 1.0.0 (MVP)  
**Data da revisão técnica:** 12/11/2026  
**Estado:** aplicação publicada em https://porto-velho-agora.vercel.app, banco Neon integrado, nove testes unitários e dois cenários E2E locais aprovados. Resultados de produção em `docs/VERIFICACAO.md`. GitHub e revisão humana pendentes.  
**Lema:** A cidade acontece. Você fica sabendo.

> Esta é a especificação *do código desenvolvido*. A especificação recebida, baseada em PHP + MySQL/XAMPP, é preservada sem alterações em [`spec-original.md`](spec-original.md).

## 1. Problema e objetivo

Portal web colaborativo de utilidade pública para Porto Velho (RO). Um visitante vê avisos recentes sobre feiras, buracos, chuvas, eventos e outros acontecimentos; cidadãos cadastrados podem publicar avisos textuais com foto opcional. O feed é público e os avisos são exibidos imediatamente, sem moderação na versão inicial. Não é um canal oficial da prefeitura.

## 2. Público e permissões

| Papel | O que pode fazer |
| --- | --- |
| Visitante | Abrir o feed, filtrar por categoria e bairro, consultar detalhes de um aviso, criar conta e entrar. |
| Cidadão colaborador | Tudo que o visitante faz, além de publicar avisos e ver suas próprias publicações, e encerrar sessão. |

Não há papel administrativo nem moderação no MVP. A API de publicação valida a sessão no servidor e não apenas na interface.

## 3. Casos de uso e requisitos funcionais

- **RF01 / UC01 — Cadastro:** nome de 2–100 caracteres, e-mail válido único (normalizado em minúsculas), senha entre 8 e 72 bytes; hash bcrypt com custo 12; erro para e-mail duplicado.
- **RF02 / UC02 — Login:** autenticação por e-mail e senha contra bcrypt; sessão aleatória armazenada no servidor como hash SHA-256; limites atômicos por e-mail (8 tentativas/15 min) e IP (50/15 min), inclusive sob concorrência; cadastro limitado a 20/15 min por IP.
- **RF03 / UC03 — Logout:** destrói a sessão no banco e remove cookie de autenticação.
- **RF04 / UC04 — Feed público:** avisos `ativo` em ordem decrescente por data e ID (até 100 por página neste MVP); visitantes não precisam entrar.
- **RF05 / UC05 — Filtros:** categoria `Feiras`, `Buracos`, `Chuvas`, `Eventos` ou `Outros`; pesquisa textual por bairro, combináveis.
- **RF06 / UC06 — Detalhes:** mostra título, descrição integral, categoria, bairro, hora no fuso de Porto Velho, nome do autor e foto, se houver.
- **RF07 / UC07 — Novo aviso:** somente usuário autenticado. Título de 5–120 caracteres, descrição de 10–5.000, categoria válida, bairro de 2–80 e imagem opcional JPEG/PNG/WEBP de até 2 MB; validação no servidor incluindo assinatura, extensão correspondente e decodificação real. Imagens estáticas de até 20 milhões de pixels são recodificadas, removendo metadados; limite de 2 MB aplicado também ao resultado.
- **RF08 / UC07 — Publicação imediata:** aviso novo criado como `ativo` e visível ao público.
- **RF09 — Meus avisos:** usuário autenticado acessa a lista das próprias publicações.

## 4. Requisitos não funcionais

### Interface

HTML semântico, CSS responsivo, JavaScript/React para formulários; identidade azul `#173E79`, verde `#159447`, branco `#FFFFFF`, fundo `#F0F4F8` e texto `#253347`. Priorização de uso mobile, contraste, etiquetas em formulários, mensagens de erro e estados vazios. Meta de desempenho: boa experiência em rede comum; o valor inicial <2 s no XAMPP não é transferível diretamente à hospedagem serverless e deverá ser medido em produção.

### Segurança

- Bcrypt para senha, `httpOnly`, `secure` em produção e `SameSite=Lax` no cookie, token de sessão aleatório e só o hash do token no banco.
- Consultas **parametrizadas** usando driver Neon (templates SQL; jamais concatenar valores de usuário em SQL).
- Validações no servidor, proibição de MIME incompatível com a assinatura da imagem; upload máximo de 2 MB.
- Rotas e consultas filtradas por sessão e por status ativo.
- Origem HTTP obrigatória e exata para requisições que alteram dados, rejeitando também cross-site; contadores atômicos de tentativas por IP e e-mail no banco. Corpos JSON e multipart têm limites reais de leitura, além do Content-Length.
- Segredos exclusivamente em `DATABASE_URL`, fora de commits via `.gitignore` e ambiente Vercel.
- Arquivos servidos com `X-Content-Type-Options: nosniff`.
- Revisão humana de uso, segurança e conformidade com o Anexo B da apostila **pendente**; ver `docs/SEGURANCA.md`.

## 5. Stack implementada e decisão técnica

| Camada | Tecnologia final | Motivo |
| --- | --- | --- |
| UI | Next.js 16, React 19 e CSS puro | Suporte oficial à Vercel, páginas responsivas e rotas integradas. |
| Backend | Next.js Route Handlers em Node.js | API com login, cadastro, publicação e entrega de imagem. |
| Banco | PostgreSQL (Neon), driver `@neondatabase/serverless` | Banco persistente externo compatível com Vercel; acesso parametrizado. |
| Senhas | `bcryptjs` | Hash bcrypt sem armazenar senhas em claro. |
| Sessões | Cookie seguro + tabela PostgreSQL | Revogação server-side no logout. |
| Imagens | `BYTEA` em tabela separada no Neon | Evita dependência de disco efêmero da Vercel; atende ao limite de até 2 MB para MVP acadêmico. |
| Versionamento | Git/GitHub | Histórico real de commits com documentação. |
| Hospedagem | Vercel, Node 24 | Deploy público por API de arquivos; conexão automática com GitHub pendente de criação/permissão do repositório. |

**Mudança principal vs. original:** PHP + MySQL (e `password_hash()` / PDO) foram substituídos por Next.js + Neon PostgreSQL (`bcryptjs` / consultas parametrizadas). Esta troca **deve ser aprovada pelo professor se a disciplina exigir especificamente PHP**. O objetivo funcional e os critérios de segurança foram preservados, mas a linguagem e o banco mudaram. Imagens deixaram de ser arquivos na pasta `uploads/avisos` e passaram a ser armazenadas em PostgreSQL, com URL pública `/api/avisos/{id}/imagem`.

## 6. Dados e integridade

- `usuarios`: `id`, `nome`, `email` único, `senha_hash`, `criado_em`.
- `avisos`: `id`, `usuario_id` FK, `titulo`, `descricao`, `categoria`, `bairro`, `imagem_url` opcional, `status` (`ativo`, `pendente`, `removido`), `criado_em`.
- `avisos_imagens`: `aviso_id` FK e PK, `tipo_mime`, `conteudo BYTEA`, `tamanho_bytes`; 0 ou 1 imagem por aviso.
- `sessoes`: `token_hash`, `usuario_id` FK, `expira_em`, `criado_em`.
- `tentativas_login`: `chave_hash`, `quantidade`, `ultima_tentativa`.

Relações: usuário 1:N avisos; usuário 1:N sessões; aviso 1:0..1 imagem. O SQL executável está em `schema.sql`.

## 7. Rotas

| Endereço | Acesso |
| --- | --- |
| `/` | Feed e filtros públicos |
| `/avisos/[id]` | Detalhes públicos de aviso ativo |
| `/cadastrar` | Cadastro público |
| `/entrar` | Login público |
| `/publicar` | Criar aviso (login obrigatório) |
| `/meus-avisos` | Próprios avisos (login obrigatório) |
| `POST /api/cadastro` | Validação, hash e criação de conta |
| `POST /api/entrar` | Autenticação e cookie de sessão |
| `POST /api/sair` | Revogação da sessão |
| `POST /api/avisos` | Grava aviso com foto opcional (multipart) |
| `GET /api/avisos/[id]/imagem` | Retorna foto de aviso ativo |
| `GET /api/saude` | Verifica conectividade do banco sem revelar credenciais |

## 8. Critérios de aceite

1. Cadastro válido gera usuário com hash bcrypt; e-mail duplicado e dados inválidos retornam erro.
2. Login correto cria sessão persistida; login incorreto não autentica; logout a invalida.
3. Visitante acessa feed e detalhes sem login; filtros de bairro/categoria funcionam.
4. Conta logada publica texto sem imagem; novo aviso aparece imediatamente.
5. Conta logada publica aviso com JPEG/PNG/WEBP de até 2 MB; a foto abre pelo link público.
6. Extensões/MIME inválidos e foto maior que 2 MB são rejeitados; o aviso inválido não é gravado.
7. Não autenticado não publica nem acessa `/meus-avisos`.
8. Repositório não contém senhas, chaves ou strings de conexão reais.
9. Usuário sem acesso à máquina do desenvolvedor consegue abrir GitHub e URL publicada em aba anônima.
10. Revisão humana de segurança e testes de ponta a ponta documentados em `docs/SEGURANCA.md`.

## 9. Fora do escopo e limites conhecidos

Moderação, denúncias, edição/remoção de aviso, recuperação de senha, paginação além de 100 avisos, confirmação de e-mail, verificação factual de publicações e upload em object storage. A limitação por IP/e-mail não substitui um WAF/rate limiter distribuído. Fotos no banco são adequadas ao uso acadêmico inicial, não a tráfego intenso. As postagens são responsabilidade dos autores.

## 10. Publicação e verificação

Banco Neon existente migrado e aplicação publicada via API Vercel na equipe autorizada, com DATABASE_URL sensível e acesso público ao feed. A criação do GitHub retornou HTTP 403 por permissão insuficiente; os seis commits anteriores e os novos commits estão preservados localmente. Consulte `docs/ENTREGA.md` e `docs/VERIFICACAO.md` para evidências e pendências.
