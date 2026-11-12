# Entrega — roteiro operacional

## Links para preencher após publicação

- **GitHub:** PENDENTE — link público do repositório com todo o histórico.
- **Sistema:** PENDENTE — URL de produção Vercel aberta em aba anônima.
- **Spec final:** `spec.md` na raiz do repositório.
- **Changelog:** `CHANGELOG.md` na raiz do repositório.

> Não use uma URL fictícia como evidência. O repositório local contém commits reais, mas só estará acessível ao avaliador após push à conta GitHub.

## Etapa 1 — GitHub

1. Crie um repositório vazio `porto-velho-agora` na sua conta GitHub, público (ou convide o professor, se privado).
2. **Envie o histórico Git existente, não apenas os arquivos de um ZIP.** No diretório do projeto, execute `git remote add origin https://github.com/SEU_USUARIO/porto-velho-agora.git` e `git push -u origin main`. Não crie um repositório novo com um commit único.
3. Confirme que o GitHub exibe os commits de implementação e documentação e contém `spec.md`, `CHANGELOG.md` e `schema.sql`.
4. Nunca envie `.env.local`, senhas, credenciais da Neon, cookies ou chaves.

## Etapa 2 — Neon (PostgreSQL)

1. Em `https://console.neon.tech`, crie um projeto gratuito em região próxima, nome sugerido `porto-velho-agora`.
2. Na página SQL Editor, cole o conteúdo de `schema.sql` e execute. Verifique as cinco tabelas.
3. Copie a URL de conexão via *Connection details* (use SSL obrigatório). Não cole a URL no chat nem em arquivos públicos.
4. Alternativa por CLI, com `DATABASE_URL` definida somente no ambiente de execução: `npm run db:migrate`.

## Etapa 3 — Vercel

1. Entre em `https://vercel.com/new`, clique em Import Git Repository e selecione `porto-velho-agora`.
2. Framework: Next.js; Root Directory: `./`; build padrão `npm run build`; Node 22.
3. Em **Environment Variables**, configure `DATABASE_URL` como a URL **real da Neon**, selecionando Production (e Preview/Development se desejar). Jamais prefira escrever a URL no código.
4. Clique em Deploy. Confira logs e endereço `https://...vercel.app` retornado pelo serviço.
5. Para alterações posteriores, faça novos commits e `git push` — a integração Vercel pode redesplegar automaticamente.

Como alternativa à conexão manual, a integração Neon no Marketplace da Vercel pode disponibilizar `DATABASE_URL` diretamente no projeto: verifique escopo e conexão do banco antes de subir a aplicação. Referência: https://vercel.com/docs/postgres.

## Etapa 4 — Testes do sistema publicado (obrigatórios)

Executar `npm run smoke -- https://SEU-PROJETO.vercel.app` para testar rotas de leitura e conexão real. Em **janela anônima** do navegador, testar manualmente:

1. Acessar homepage, sem login. Confirmar que o feed aparece, mesmo se estiver vazio.
2. Criar conta com e-mail não utilizado; repetir o cadastro e confirmar erro de e-mail duplicado.
3. Entrar com senha errada (erro); entrar com senha correta (sucesso).
4. Publicar aviso sem foto, conferir no feed e na página de detalhes.
5. Publicar aviso com imagem JPG/PNG/WEBP pequena, conferir a foto persistente e URL `/api/avisos/ID/imagem`.
6. Testar filtro categoria + bairro e clicar no aviso a partir dos resultados.
7. Testar envio de PDF renomeado ou arquivo maior que 2 MB e confirmar rejeição sem publicação.
8. Abrir `/publicar` e `/meus-avisos` após logout; o sistema deve redirecionar para login.
9. Inspecionar o repositório no GitHub em aba anônima e certificar-se de que não contém `.env` ou segredos.
10. Registrar data, navegador, URL, achados, correções e quem revisou em `docs/SEGURANCA.md` e no changelog.

## Observações para avaliação

- A spec original usava PHP/MySQL; a versão final usa Next.js/Neon. Se a disciplina exigir a stack original, é preciso aprovação docente prévia.
- O MVP não tem moderação nem verificação das postagens; não publique dados pessoais de terceiros.
- O `spec.md` final não deve afirmar que foi publicado até o deploy passar nos testes.
- Leia o **Anexo B da apostila** e preencha apenas verificações realmente concluídas; o anexo não foi enviado nesta conversa.
