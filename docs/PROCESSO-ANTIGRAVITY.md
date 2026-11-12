# Processo de desenvolvimento com IA — evidência responsável

A tarefa da disciplina menciona o Google Antigravity. **Este repositório foi produzido com assistência de IA no ChatGPT, não há evidência de que o Google Antigravity tenha sido usado.** Não alegue ao professor que uma ferramenta específica foi usada sem utilizá-la de verdade.

## Registro verificável

1. Entrada: `spec-original.md`, fornecida pelo estudante.
2. Decisão arquitetural: Next.js / Neon / Vercel para viabilizar o deploy pretendido; aprovar mudança de PHP/MySQL com professor.
3. Implementação inicial de banco, validação, autenticação e avisos; commit `bd321ad`.
4. Interface visual responsiva e formulários; commit `adf7b16`.
5. Documentação, spec final, checklist e scripts de teste; commit `fc11313`.
6. Revisão técnica de formato, importações e testes unitários; resultados anotados no changelog.

## Como complementar no Google Antigravity (se exigido pelo docente)

- Abrir o projeto com histórico Git existente; não reescrever commits.
- Ler `spec-original.md` e `spec.md`, pedir ao agente para comparar requisitos e apontar diferenças.
- Executar `npm install`, `npm test`, `npm run build`, e testar os fluxos com a Neon configurada.
- Pedir uma revisão de riscos (SQL injection, sessão, imagens, CSRF e credenciais). Avaliar criticamente cada sugestão; não aplicar automaticamente.
- Registrar no `CHANGELOG.md` quais sugestões foram aceitas, rejeitadas ou alteradas pelo estudante e por quê.
- Guardar evidências reais (prints/logs) datados, se a apostila solicitar.

**Não falsificar logs, screenshots, timestamps nem 'revisão humana'.**
