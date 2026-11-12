# Entrega — roteiro operacional

## Publicação real e pendências

- **GitHub:** https://github.com/oliveiranikolas1991/porto-velho-agora — histórico original e correções publicados.
- **Sistema:** https://porto-velho-agora.vercel.app — produção Vercel, acesso público.
- **Spec final:** `spec.md` na raiz do repositório.
- **Changelog:** `CHANGELOG.md` na raiz do repositório.

O código foi enviado à branch `main` após a liberação da conexão GitHub. Os nove commits iniciais foram conferidos no remoto, e o primeiro GitHub Actions passou (execução 43319011360).

## Etapa 1 — GitHub concluído

O repositório é público. Novas alterações devem usar commits reais e `git push origin main`, sem reescrever os seis commits originais. `.env.local` permanece ignorado.


## Etapa 2 — Neon (PostgreSQL)

1. Reutilize o projeto `porto-velho-agora`, ID `sparkling-pond-43274194`. Não crie outro projeto.
2. As cinco tabelas já foram criadas no projeto existente. Para uma instalação separada, valide `schema.sql` em branch isolada antes de aplicar.
3. Copie a URL de conexão via *Connection details* (use SSL obrigatório). Não cole a URL no chat nem em arquivos públicos.
4. Alternativa por CLI, com `DATABASE_URL` definida somente no ambiente de execução: `npm run db:migrate`.

## Etapa 3 — Vercel

1. Abra o projeto Vercel **existente** `porto-velho-agora` → Settings → Git → Connect Git Repository. Selecione `oliveiranikolas1991/porto-velho-agora`. Não crie outro projeto.
2. Framework: Next.js; Root Directory: `./`; build padrão `npm run build`; Node 24.
3. Em **Environment Variables**, configure `DATABASE_URL` como a URL **real da Neon**, selecionando Production (e Preview/Development se desejar). Jamais prefira escrever a URL no código.
4. O site já está publicado por arquivos. A conexão Git automática ainda depende de a Vercel reconhecer o repositório; a tentativa por API retornou `incorrect_git_source_info`. Após conectar, confira o deployment e os logs.
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
