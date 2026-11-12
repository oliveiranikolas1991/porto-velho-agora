# Segurança e revisão humana — Anexo B

**Importante:** o texto integral do **Anexo B** não foi fornecido. Abaixo há um checklist técnico baseado nos requisitos explícitos da atividade e da spec. Ele **não é uma transcrição nem substitui** a checagem exata contra o Anexo B. Marque as pendências após testar em produção.

## Checagens já implementadas e verificáveis no código

- [x] Sem segredos embutidos: `DATABASE_URL` é lida do ambiente e `.env*` (exceto `.env.example`) fica em `.gitignore`.
- [x] Senhas protegidas: cadastro com `bcrypt.hash(..., 12)` e login com `bcrypt.compare`.
- [x] Consultas parametrizadas do driver Neon; nada de interpolação de entrada do usuário em SQL manual.
- [x] Acesso condicionado ao login tanto na rota protegida da interface como em `POST /api/avisos`.
- [x] Cookie HTTP-only, SameSite=Lax, Secure em produção; sessão revogável no logout, token armazenado no banco apenas como hash.
- [x] Validação no backend de campos, IDs, categoria e tamanho/formato/assinatura de foto; rejeição inicial de `Content-Length` excessivo.
- [x] Apenas imagens de avisos ativos são servidas, com MIME controlado e `nosniff`.
- [x] Limite básico de tentativas de login no banco; checagem de origem em requisições mutantes.
- [x] Frontend não renderiza HTML inserido pelo usuário via `dangerouslySetInnerHTML`.

## Exige teste/ação real antes de marcar como concluído

- [ ] Confirmar que nenhum segredo aparece nos commits e no repositório remoto (`git log`, `git grep`, inspeção visual).
- [ ] Rodar `npm audit` em ambiente com acesso ao registro de pacotes; tratar alertas relevantes.
- [ ] Rodar `npm run build` e `npm test` após instalar dependências; validar logs de build da Vercel.
- [ ] Executar `schema.sql` na Neon e consultar tabelas reais.
- [ ] Testar cadastro, duplicidade, login certo/errado, logout e expiração de sessão na URL de produção.
- [ ] Testar avisos com/sem foto, filtros, imagem inválida/maior que 2 MB e controle de acesso no backend.
- [ ] Conferir deploy com **HTTPS**, `secure` no cookie, cabeçalhos e URL em navegador anônimo.
- [ ] Testar funcionalidade em celular, teclado e contraste visual.
- [ ] Conferir item por item o Anexo B oficial da apostila (adicionar itens faltantes aqui).
- [ ] Revisão humana registrada abaixo — é obrigatória para a avaliação e não pode ser inventada.

## Registro de revisão humana (preencher após revisão de verdade)

- **Revisor:** ____________________
- **Data/hora:** ____________________
- **URL GitHub inspecionada:** ____________________
- **URL Vercel testada:** ____________________
- **Cenários executados:** ____________________
- **Falhas encontradas e como foram corrigidas:** ____________________
- **Alterações aprovadas ou rejeitadas em sugestões da IA:** ____________________
- **Anexo B completo conferido?** Sim / Não — observações: ____________________

**Riscos conhecidos:** upload com armazenamento em banco pode gerar custo/uso de espaço; a limitação de login é básica e não substitui proteção WAF/rate limiting distribuído; avisos públicos não passam por moderação; não há confirmação de e-mail nem recuperação de senha na versão 1.0.
