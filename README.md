# Direito Vivo

**Demonstração de triagem conversacional de direitos, benefícios e serviços públicos brasileiros.**

> O Direito Vivo organiza caminhos que podem ser compatíveis com a situação relatada e mostra o que confirmar, quais documentos preparar e onde buscar atendimento oficial.

📚 Fonte de verdade do escopo: [docs/brief-projeto-direitos-invisiveis.md](docs/brief-projeto-direitos-invisiveis.md) e [docs/sdd-direito-vivo.md](docs/sdd-direito-vivo.md).

---

## Por que existe

No Brasil, milhões de pessoas não recebem o que já é delas por lei — Bolsa Família, BPC/LOAS, tarifa social de energia, isenção de IR — porque **ninguém explicou que existe, quem tem direito ou como pedir**. As pessoas mais vulneráveis são justamente as com menos acesso a informação organizada.

O Direito Vivo ataca esse ponto com uma **demonstração gratuita e sem cadastro**. A resposta separa sinais compatíveis de requisitos ainda pendentes; perigo atual interrompe o fluxo comum e exibe canais de ajuda imediata.

## O que o produto faz hoje

- **Chat de triagem** em português coloquial que faz perguntas incrementais e devolve orientações para confirmação
- **Consentimento explícito no modo demo**, exigido também pela API em cada requisição
- **Mascaramento por padrões** de CPF, e-mail, telefone e CEP antes da primeira chamada externa
- **Urgência determinística** para perigo atual, violência e risco de autoextermínio, sem chamar LLM, busca ou banco
- **Linha de vida** priorizada: o que resolver primeiro, o que destrava o próximo, ficha completa e links para fontes oficiais
- **Base versionada de 30 itens**: 7 estão publicáveis após revisão inicial e 23 permanecem fora da demo até concluírem a revisão editorial
- **Compartilhar o resultado** (Web Share API + fallback pra área de transferência)
- **Interface estilo mensageiro** (chat, bolhas com tail, timestamp, ticks, indicador de digitação) — otimizada para celular
- **PWA instalável** com manifest e ícones
- **Acessibilidade**: leitura em voz alta (Web Speech), modo alto contraste, teclado, atalhos, textos ARIA

## Privacidade como design, não como banner

O SDD trata privacidade como restrição de projeto, não como cláusula:

- **Sem persistência de conversa no banco da aplicação.** O histórico vive no estado da aba e o aceite não é salvo no navegador.
- **API stateless.** O cliente reenvia o histórico completo a cada `POST /api/triagem` — não há sessão, cookie ou identificador.
- **Processamento externo explícito.** O texto protegido por padrões é enviado ao provedor de IA. O mascaramento reduz exposição, mas não é garantia absoluta; por isso a interface orienta a não informar dados pessoais.
- **Sem log de requisição.** `disableRequestLogging: true` no Fastify: relato de triagem + IP + timestamp permitiria reidentificar quem foi. Erros logam só a mensagem técnica, nunca o corpo.
- **LLM instruído a recusar coleta.** O prompt do sistema proíbe pedir dado identificável e nunca promete aprovação de benefício.

## Arquitetura

```
frontend (React 19 + Vite + Tailwind v4)
      │
      ▼ POST /api/triagem
backend (Fastify 5, stateless)
      │
      ▼
rag (Node)
      ├─ provedor-llm  → Gemini (modelo configurável)
      └─ busca         → Supabase pgvector
```

| Módulo | Responsabilidade | Detalhes |
|---|---|---|
| [db/](db/) | Schema Supabase, 4 migrations, auditor editorial e base versionada com 30 itens | [db/README.md](db/README.md) |
| [rag/](rag/) | Motor de triagem, priorização, provider LLM abstrato (troca Gemini↔Claude sem tocar o resto), busca semântica | [rag/README.md](rag/README.md) |
| [backend/](backend/) | HTTP fino: valida schema, chama motor, devolve resposta. Sem sessão. | [backend/README.md](backend/README.md) |
| [frontend/](frontend/) | Chat estilo mensageiro, catálogo, cenários de vida, resultado priorizado, PWA | [frontend/README.md](frontend/README.md) |

## Decisões técnicas que valem uma linha

- **Provider LLM abstrato** por interface (`rag/src/provedor-llm.ts`) — trocar Gemini por Claude/OpenAI é criar `provedores/x.ts` e registrar. Zero mudança no motor.
- **Retry automático em 429** do Gemini free tier lê o `retryDelay` do próprio erro (não é backoff arbitrário) — [`rag/src/provedores/gemini.ts`](rag/src/provedores/gemini.ts).
- **Priorização determinística**: violência doméstica sempre topo; se o LLM sinaliza `risco_imediato`, saúde mental também sobe; depois `prioridade_base` (1–5 curado); alfabético como desempate estável. Sem ML, sem magia — [`ordenarLinhaDaVida`](rag/src/triagem.ts).
- **LLM não pode inventar item**: só ids que estão na busca semântica são aceitos; se o modelo alucinar, cai em `sem_match` honesto — [`triagem.ts:39`](rag/src/triagem.ts).
- **JSON tolerante a cerca de código markdown**: o Gemini às vezes envolve ` ```json ` — o parser recorta do primeiro `{` ao último `}`.
- **Validação de payload no schema Ajv** do Fastify: no máximo 40 mensagens, cada uma até 2000 chars — cabe pra uma triagem, corta abuso.

## Qualidade

Verificação local em 12/08/2026: **99 testes passaram** (banco 16, RAG 45, API 17 e frontend 21), typecheck e build de produção passaram, e `npm audit --omit=dev` encontrou 0 vulnerabilidades. O comando `npm test` inclui o auditor e os contratos de segurança da migration. Testes que dependem de Gemini e Supabase reais são separados das suítes determinísticas e exigem credenciais próprias. Ainda não há um lint dedicado configurado; o gate estático atual é o TypeScript em modo estrito.

- **RAG**: mascaramento de dados, urgência sem dependências externas, ordenação, contrato pergunta/orientação/sem_match e robustez do parser
- **API**: `fastify.inject` cobre schema (papel, tamanho, tamanho da conversa), erro genérico vs erro de triagem (mensagem opaca — nunca vaza detalhe do provider), teste explícito de que **o corpo da requisição nunca aparece no log**
- **Frontend**: consentimento da demo, chat, painel de urgência, orientação estruturada, sem_match e compartilhamento
- **Conteúdo e banco**: metadados editoriais, fontes HTTPS oficiais, vigência, duplicidade, estados de publicação e contrato SQL de RLS/permissões/RPC
- **Perfis end-to-end**: `npm run rag:testes` roda 3 conversas roteirizadas (mãe solo desempregada, idoso com deficiência, trabalhador informal acidentado) contra Gemini e Supabase reais e valida que cada perfil recebe ao menos 1 item esperado + ficha completa + ordem correta

## Como rodar

```bash
# 1. Preencha o .env (copie de .env.example):
#    GEMINI_API_KEY        → https://aistudio.google.com/apikey (tier free basta)
#    SUPABASE_URL, SUPABASE_CHAVE_PUBLICA → do projeto Supabase
#    SUPABASE_CHAVE_SERVICO → só se for rodar seed/embeddings
npm install

# 2. Audite o conteúdo e gere o catálogo público local.
npm run db:auditar
npm run db:catalogo

# 3. Valide o motor sem frontend (requer serviços reais e roda 3 perfis).
npm run rag:testes

# 4. Suba tudo.
npm run api:dev      # terminal 1 → http://localhost:3333
npm run front:dev    # terminal 2 → http://localhost:5173

# Extras
npm run typecheck    # strict em rag + backend + frontend
npm test             # suítes determinísticas dos quatro módulos
npm run build        # build de produção do frontend
```

Para atualizar o Supabase, siga a ordem e os gates documentados em [`db/README.md`](db/README.md). O estado remoto precisa sempre ser confirmado por consultas e testes; a presença dos arquivos no Git não comprova implantação.

## Status dos critérios de aceite (SDD seção 7)

| Critério | Status |
|---|---|
| Triagem sem exigir CPF/RG/nome | ✅ Sem login/cadastro; interface orienta a não enviar PII; padrões conhecidos são mascarados |
| ≥1 item relevante para 3 perfis de teste | ✅ 3/3 passam em `npm run rag:testes` (com retry automático nos rate-limits do free tier) |
| Ficha completa por item (RF05) | ✅ Os 7 itens publicáveis têm campos editoriais, alertas e fontes oficiais; 23 itens continuam em revisão/rascunho |
| Resultado em ordem de prioridade (RF04) | ✅ Violência/risco no topo, depois `prioridade_base`, alfabético como desempate |
| Disclaimer antes da triagem (RF06) | ✅ Tela inicial, banner no chat, rodapé no resultado |
| Base com ≥20 itens revisáveis | ✅ 30 itens versionados e auditáveis; publicação é bloqueada até fonte, vigência e revisão estarem válidas |

## Fora de escopo do MVP (Fase 2 do SDD)

Estão fora **de propósito** — cada um exige aprovação de terceiro ou convênio institucional, não é só código: WhatsApp Business API, validação por CPF/documento, integração com sistemas oficiais (CadÚnico/Meu INSS), regras estaduais/municipais detalhadas e alerta comunitário. O SDD prevê tocar essas features quando o MVP validar demanda.

## Estado de infraestrutura

- **Local verificado em 12/08/2026**: 99 testes, typecheck e build passaram; catálogo gerado somente a partir de itens publicáveis.
- **Supabase verificado em 12/08/2026**: migration `0004` aplicada manualmente no SQL Editor ao projeto `wajycuocmmuyxbzeskyl`; 30 itens internos, 7 publicáveis, 7 embeddings e 3/3 perfis reais aprovados.
- **Segurança remota verificada**: RLS ativo; `anon` com SELECT/RPC e sem INSERT/UPDATE/DELETE; RPC como `security invoker` e `search_path` explícito; Security Advisor reexecutado com 0 erros, 0 avisos e 0 sugestões.
- **Limite da evidência**: a aplicação manual não foi registrada pela CLI como migration remota; a chave `service_role` não foi armazenada localmente e não houve teste direto autenticado como `service_role`.
- **Deploy previsto**: a arquitetura desenhada usa Vercel para frontend/API e Supabase para a base pública. Nenhuma URL pública é declarada aqui até uma preview ser validada em desktop e celular.
