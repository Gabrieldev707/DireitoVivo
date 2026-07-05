# 🌱 Direito Vivo (MVP)

Triagem conversacional, **anônima e gratuita**, de benefícios, direitos e serviços públicos brasileiros que a pessoa provavelmente tem acesso — mas não sabe que existem. Foco em quem está em situação de vulnerabilidade.

> Specs do projeto: [docs/brief-projeto-direitos-invisiveis.md](docs/brief-projeto-direitos-invisiveis.md) e [docs/sdd-direito-vivo.md](docs/sdd-direito-vivo.md) (fonte de verdade do escopo).

## Arquitetura

```
frontend (React/Vite/Tailwind)  →  api (Fastify)  →  rag (motor: Gemini + RAG)  →  Supabase (pgvector)
```

| Módulo | Responsabilidade | README |
|---|---|---|
| [db/](db/) | Schema Supabase, migrations e base de conhecimento curada (30 itens) | [db/README.md](db/README.md) |
| [rag/](rag/) | Provedor LLM abstraído (Gemini no MVP), busca semântica, motor de triagem e "linha de vida" | [rag/README.md](rag/README.md) |
| [api/](api/) | HTTP stateless (`POST /api/triagem`), validação e privacidade de logs | [api/README.md](api/README.md) |
| [frontend/](frontend/) | Chat web: disclaimer → triagem → linha de vida com fichas completas | [frontend/README.md](frontend/README.md) |

**Privacidade por design**: nenhuma tabela guarda dado de usuário (nem CPF, nem nome, nem conversa). A API é stateless, o histórico vive só na aba do navegador e os logs não registram corpo de requisição.

## Como rodar

```bash
npm install

# 1. Preencha o .env (copie de .env.example):
#    - GEMINI_API_KEY        → https://aistudio.google.com/apikey (tier free)
#    - SUPABASE_CHAVE_SERVICO → só para scripts de escrita (seed/embeddings)
#    (SUPABASE_URL e SUPABASE_CHAVE_PUBLICA já apontam para o projeto provisionado)

# 2. Gere os embeddings da base (uma vez, e a cada mudança de conteúdo):
npm run db:embeddings

# 3. Teste o motor sem frontend (recomendado pelo SDD):
npm run rag:cli      # chat no terminal
npm run rag:testes   # 3 perfis dos critérios de aceite

# 4. Suba tudo:
npm run api:dev      # terminal 1 → http://localhost:3333
npm run front:dev    # terminal 2 → http://localhost:5173
```

## Status dos critérios de aceite (SDD seção 7)

| Critério | Status |
|---|---|
| Triagem completa sem CPF/RG/nome | ✅ Sem login/cadastro; prompt proíbe coleta; nada é persistido |
| ≥1 item relevante para 3 perfis de teste | ⏳ Automatizado em `npm run rag:testes` — rodar após configurar `GEMINI_API_KEY` |
| Ficha completa por item (RF05) | ✅ Todos os 30 itens têm todos os campos; o teste de perfis também valida na resposta |
| Resultado em ordem de prioridade (RF04) | ✅ `ordenarLinhaDaVida`: violência/risco no topo, depois `prioridade_base` |
| Disclaimer antes da triagem (RF06) | ✅ Tela inicial dedicada + reforço no resultado e no rodapé |
| Base com ≥20 itens revisáveis | ✅ 30 itens com `ultima_revisao` e fonte legal, seed versionado em `db/seed/itens.json` |

⏳ = depende apenas da `GEMINI_API_KEY` (tier free) no `.env` — os dois passos pendentes são `npm run db:embeddings` e `npm run rag:testes`.

## Fora de escopo (Fase 2 — não implementado de propósito)

WhatsApp, validação por CPF/documento, integração com sistemas oficiais, regras estaduais detalhadas, alerta comunitário e loop de retorno (SDD, seção 1).

## Infra provisionada

- Supabase: projeto `direito-vivo` (`wajycuocmmuyxbzeskyl`), região `sa-east-1`, plano free. Migrations e seed já aplicados; advisors de segurança limpos.
- Deploy previsto (quando chegar a hora): Vercel (frontend) + Railway (api), conforme SDD seção 5.
