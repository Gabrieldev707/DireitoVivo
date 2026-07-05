# Módulo `frontend` — Chat web

Interface única do MVP (React + Vite + Tailwind v4). Três fases num único fluxo:

1. **Tela inicial** — proposta de valor + disclaimer em destaque (RF06) + botão "Começar".
2. **Chat** — conversa de triagem; o histórico fica só na memória do navegador e é enviado inteiro a cada chamada (`POST /api/triagem`). Nada persiste: fechar a aba apaga tudo.
3. **Linha de vida** — resultado como sequência priorizada "comece por aqui" (RF04), com cada item expansível mostrando a ficha completa (RF05: critérios, documentos, canal, passo a passo, fonte legal, data de revisão).

## Decisões

- Sem login, sem cookie, sem analytics, sem armazenamento local — anonimato de verdade (RF01).
- Tipos da API duplicados em `src/tipos.ts` de propósito: o pacote `rag` é Node-only e não deve entrar no bundle do navegador.
- Linguagem da interface: frases curtas, sem juridiquês (RF07); fonte base 17px e alvos de toque grandes para acessibilidade.
- Em dev, o Vite faz proxy de `/api` para `http://localhost:3333` (sem CORS).

## Como rodar

```bash
npm run api:dev     # terminal 1 — backend
npm run front:dev   # terminal 2 — abre em http://localhost:5173
```
