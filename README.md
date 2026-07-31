# Direito Vivo

**Triagem conversacional anônima de direitos, benefícios e serviços públicos brasileiros — feita para quem tem menos acesso a informação.**

> Você provavelmente tem direito a coisas que nem sabe que existem. O Direito Vivo faz uma conversa curta, sem pedir CPF nem nome, e devolve uma "linha de vida" priorizada de por onde começar.

📚 Fonte de verdade do escopo: [docs/brief-projeto-direitos-invisiveis.md](docs/brief-projeto-direitos-invisiveis.md) e [docs/sdd-direito-vivo.md](docs/sdd-direito-vivo.md).

---

## Por que existe

No Brasil, milhões de pessoas não recebem o que já é delas por lei — Bolsa Família, BPC/LOAS, tarifa social de energia, isenção de IR — porque **ninguém explicou que existe, quem tem direito ou como pedir**. As pessoas mais vulneráveis são justamente as com menos acesso a informação organizada.

O Direito Vivo ataca esse ponto: **triagem por linguagem natural, gratuita, anônima, sem cadastro**, com resposta priorizada por urgência real (violência doméstica e risco de vida sempre no topo) e com passo a passo até o balcão certo.

## O que o produto faz hoje

- **Chat de triagem** em português coloquial que faz perguntas incrementais e devolve entre 1 e 5 direitos que provavelmente se aplicam
- **Linha de vida** priorizada: o que resolver primeiro, o que destrava o próximo, ficha completa (critérios, documentos, canal, passo a passo, base legal, data de revisão)
- **Base curada de 30 direitos federais** com fonte legal e prazo de revisão explícito
- **Compartilhar o resultado** (Web Share API + fallback pra área de transferência)
- **Interface estilo mensageiro** (chat, bolhas com tail, timestamp, ticks, indicador de digitação) — otimizada para celular
- **PWA instalável** com manifest e ícones
- **Acessibilidade**: leitura em voz alta (Web Speech), modo alto contraste, teclado, atalhos, textos ARIA

## Privacidade como design, não como banner

O SDD trata privacidade como restrição de projeto, não como cláusula:

- **Zero PII persistida.** Nenhuma tabela guarda nome, CPF, RG ou conversa. O histórico vive só na aba do navegador; fechar apaga.
- **API stateless.** O cliente reenvia o histórico completo a cada `POST /api/triagem` — não há sessão, cookie ou identificador.
- **Sem log de requisição.** `disableRequestLogging: true` no Fastify: relato de triagem + IP + timestamp permitiria reidentificar quem foi. Erros logam só a mensagem técnica, nunca o corpo.
- **LLM instruído a recusar coleta.** O prompt do sistema proíbe pedir dado identificável e nunca promete aprovação de benefício.

## Arquitetura

```
frontend (React 19 + Vite + Tailwind v4)
      │
      ▼ POST /api/triagem
api (Fastify 5, stateless)
      │
      ▼
rag (Node)
      ├─ provedor-llm  → Gemini 2.5 Flash (tier free)
      └─ busca         → Supabase pgvector
```

| Módulo | Responsabilidade | Detalhes |
|---|---|---|
| [db/](db/) | Schema Supabase, 3 migrations, base de conhecimento com 30 itens | [db/README.md](db/README.md) |
| [rag/](rag/) | Motor de triagem, priorização, provider LLM abstrato (troca Gemini↔Claude sem tocar o resto), busca semântica | [rag/README.md](rag/README.md) |
| [api/](api/) | HTTP fino: valida schema, chama motor, devolve resposta. Sem sessão. | [api/README.md](api/README.md) |
| [frontend/](frontend/) | Chat estilo mensageiro, catálogo, cenários de vida, resultado priorizado, PWA | [frontend/README.md](frontend/README.md) |

## Decisões técnicas que valem uma linha

- **Provider LLM abstrato** por interface (`rag/src/provedor-llm.ts`) — trocar Gemini por Claude/OpenAI é criar `provedores/x.ts` e registrar. Zero mudança no motor.
- **Retry automático em 429** do Gemini free tier lê o `retryDelay` do próprio erro (não é backoff arbitrário) — [`rag/src/provedores/gemini.ts`](rag/src/provedores/gemini.ts).
- **Priorização determinística**: violência doméstica sempre topo; se o LLM sinaliza `risco_imediato`, saúde mental também sobe; depois `prioridade_base` (1–5 curado); alfabético como desempate estável. Sem ML, sem magia — [`ordenarLinhaDaVida`](rag/src/triagem.ts).
- **LLM não pode inventar item**: só ids que estão na busca semântica são aceitos; se o modelo alucinar, cai em `sem_match` honesto — [`triagem.ts:39`](rag/src/triagem.ts).
- **JSON tolerante a cerca de código markdown**: o Gemini às vezes envolve ` ```json ` — o parser recorta do primeiro `{` ao último `}`.
- **Validação de payload no schema Ajv** do Fastify: no máximo 40 mensagens, cada uma até 2000 chars — cabe pra uma triagem, corta abuso.

## Qualidade

```
Testes automatizados     39 tests, 3 suítes  (rag: 12 · api: 10 · frontend: 17)
Perfis de aceite (SDD)   3/3 passam ponta a ponta (Gemini + Supabase real)
Typecheck (strict)       rag, api, frontend  — sem erros
Advisors de segurança    Supabase — limpos
```

- **RAG**: pureza de `ordenarLinhaDaVida`, decisão pergunta/resultado/sem_match com provider mockado, robustez do parser (cerca markdown, JSON inválido, formato inesperado)
- **API**: `fastify.inject` cobre schema (papel, tamanho, tamanho da conversa), erro genérico vs erro de triagem (mensagem opaca — nunca vaza detalhe do provider), teste explícito de que **o corpo da requisição nunca aparece no log**
- **Frontend**: Chat (envio, sugestões rápidas, estado enviando, banner de anonimato), LinhaDaVida (ordem RF04, sem_match, share via Web Share API), TelaInicial (disclaimer RF06 presente, CTAs)
- **Perfis end-to-end**: `npm run rag:testes` roda 3 conversas roteirizadas (mãe solo desempregada, idoso com deficiência, trabalhador informal acidentado) contra Gemini e Supabase reais e valida que cada perfil recebe ao menos 1 item esperado + ficha completa + ordem correta

## Como rodar

```bash
# 1. Preencha o .env (copie de .env.example):
#    GEMINI_API_KEY        → https://aistudio.google.com/apikey (tier free basta)
#    SUPABASE_URL, SUPABASE_CHAVE_PUBLICA → do projeto Supabase
#    SUPABASE_CHAVE_SERVICO → só se for rodar seed/embeddings
npm install

# 2. Gere embeddings da base (uma vez, e a cada mudança de conteúdo).
npm run db:embeddings

# 3. Valide o motor sem frontend (rodam 3 perfis dos critérios de aceite).
npm run rag:testes

# 4. Suba tudo.
npm run api:dev      # terminal 1 → http://localhost:3333
npm run front:dev    # terminal 2 → http://localhost:5173

# Extras
npm run typecheck    # strict em rag + api + frontend
npm test             # 39 tests unitários (Vitest)
```

## Status dos critérios de aceite (SDD seção 7)

| Critério | Status |
|---|---|
| Triagem completa sem CPF/RG/nome | ✅ Sem login/cadastro; prompt proíbe coleta; nada é persistido |
| ≥1 item relevante para 3 perfis de teste | ✅ 3/3 passam em `npm run rag:testes` (com retry automático nos rate-limits do free tier) |
| Ficha completa por item (RF05) | ✅ Todos os 30 itens têm todos os campos; validação automatizada |
| Resultado em ordem de prioridade (RF04) | ✅ Violência/risco no topo, depois `prioridade_base`, alfabético como desempate |
| Disclaimer antes da triagem (RF06) | ✅ Tela inicial, banner no chat, rodapé no resultado |
| Base com ≥20 itens revisáveis | ✅ 30 itens com `ultima_revisao` e fonte legal em `db/seed/itens.json` |

## Fora de escopo do MVP (Fase 2 do SDD)

Estão fora **de propósito** — cada um exige aprovação de terceiro ou convênio institucional, não é só código: WhatsApp Business API, validação por CPF/documento, integração com sistemas oficiais (CadÚnico/Meu INSS), regras estaduais/municipais detalhadas e alerta comunitário. O SDD prevê tocar essas features quando o MVP validar demanda.

## Infra provisionada

- **Supabase**: projeto `direito-vivo` (`wajycuocmmuyxbzeskyl`), região `sa-east-1`, plano free. Migrations e seed já aplicados; advisors de segurança limpos. Pausa automaticamente após inatividade — restaurável em ~2min.
- **Deploy previsto** (quando chegar a hora): Vercel (frontend PWA) + Railway (api), conforme SDD seção 5.
