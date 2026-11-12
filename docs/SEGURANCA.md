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

- [x] Varredura heurística de todos os blobs dos commits locais: nenhum segredo reconhecido. Inspeção do remoto pendente, pois ainda não existe repositório acessível.
- [x] `npm audit` executado: zero vulnerabilidades reportadas.
- [x] Build e nove testes unitários aprovados; logs de build da Vercel conferidos.
- [x] Schema testado em branch isolada e aplicado ao banco principal; cinco tabelas conferidas.
- [x] Cadastro, duplicidade, login correto/incorreto, logout e revogação do token anterior testados em produção.
- [ ] Expiração natural após sete dias não foi aguardada; a condição `expira_em > NOW()` foi revisada no código.
- [x] Testes de avisos, filtros, upload inválido/excessivo e acesso negado aprovados em produção.
- [x] HTTPS e cookies Secure/HttpOnly/SameSite conferidos em contextos limpos de navegador e por HTTP; cabeçalhos de segurança verificados.
- [x] Fluxo funcional em desktop e Pixel 7, ausência de rolagem horizontal e screenshots revisados por IA.
- [ ] Auditoria manual completa de teclado e contraste por revisor humano.
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


## Reforços desta revisão

- Origem obrigatória e comparação de protocolo/host/porta; cross-site bloqueado.
- Leitura com limite real de bytes antes de interpretar JSON/multipart.
- Decodificação e recodificação de imagem, extensão compatível, limite de pixels e rejeição de animação; metadados removidos.
- Limites de login por e-mail e IP reservados atomicamente antes do bcrypt; teste concorrente aprovado (8 respostas 401, 2 respostas 429).
- Rótulo acessível de senha corrigido após falha detectada pelo navegador.

Evidências completas em `VERIFICACAO.md`. A aprovação dos testes é técnica e automatizada; não preenche o registro de revisão humana acima.
