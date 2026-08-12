# Módulo `frontend` — Chat web

Interface única do MVP (React + Vite + Tailwind v4). Três fases num único fluxo:

1. **Tela inicial** — proposta de valor + disclaimer em destaque (RF06) + botão "Começar".
2. **Chat** — conversa de triagem; o histórico fica só na memória do navegador e é enviado inteiro a cada chamada (`POST /api/triagem`). Nada persiste: fechar a aba apaga tudo.
3. **Orientação** — sequência priorizada com compatibilidade aparente, requisitos a confirmar, documentos e próximos passos.
4. **Urgência** — painel separado com canais telefônicos acionáveis quando a API identifica perigo atual.

## Decisões

- Sem login, cookie de sessão ou analytics. O consentimento da demonstração vive apenas no estado React.
- O texto é processado por um provedor externo de IA; a interface orienta a não informar dados pessoais e não promete anonimato absoluto.
- Tipos da API duplicados em `src/tipos.ts` de propósito: o pacote `rag` é Node-only e não deve entrar no bundle do navegador.
- Linguagem da interface: frases curtas, sem juridiquês (RF07); fonte base 17px e alvos de toque grandes para acessibilidade.
- Em dev, o Vite faz proxy de `/api` para `http://localhost:3333` (sem CORS).

## Como rodar

```bash
npm run api:dev     # terminal 1 — backend
npm run front:dev   # terminal 2 — abre em http://localhost:5173
```
