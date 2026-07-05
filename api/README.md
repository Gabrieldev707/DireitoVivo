# Módulo `api` — Backend HTTP

Servidor Fastify fino: valida a entrada, chama o motor de triagem (`@direito-vivo/rag`) e devolve o resultado. Toda a lógica de negócio mora no módulo `rag`.

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/saude` | Healthcheck (`{ok: true}`) |
| `POST` | `/api/triagem` | Corpo: `{mensagens: [{papel: 'usuario'\|'assistente', conteudo: string}]}`. Resposta: `{tipo: 'pergunta'\|'resultado'\|'sem_match', mensagem, itens?}` |

A API é **stateless**: o histórico da conversa vem do cliente a cada chamada e **nada é persistido** — não existe sessão, cookie ou tabela de conversa (privacidade por design, SDD seção 3).

## Decisões de privacidade

- `disableRequestLogging: true` — nenhum log de rota/IP/corpo por requisição; o relato de triagem + IP + timestamp permitiria reidentificação.
- Em erro, loga só a mensagem técnica da exceção, nunca o conteúdo da conversa.
- Validação de schema limita tamanho e formato das mensagens (máx. 40 mensagens de 2000 caracteres).

## Como rodar

```bash
npm run api:dev   # na raiz (tsx watch, porta API_PORTA — padrão 3333)
```

Requer `.env` na raiz (`GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_CHAVE_PUBLICA`, `API_ORIGEM_PERMITIDA`).
