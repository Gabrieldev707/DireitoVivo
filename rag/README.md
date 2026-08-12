# Módulo `rag` — Motor de triagem

Coração do produto: mascara padrões conhecidos de dados pessoais, trata urgências explícitas sem dependências externas e, nos demais casos, busca itens candidatos e usa o LLM para decidir entre **fazer a próxima pergunta** ou **entregar uma orientação verificável**.

A orientação separa critérios confirmados dos pendentes. Documentos e próximos passos vêm da base curada, não do texto gerado pelo modelo. O mascaramento cobre CPF, e-mail, telefone e CEP; ele não substitui a orientação de evitar dados pessoais.

## Responsabilidades

- `src/provedor-llm.ts` + `src/provedores/gemini.ts` — abstração de LLM exigida pelo SDD (seção 5): a lógica de negócio só conhece a interface `ProvedorLLM`. Provedor padrão do MVP: **Gemini (tier free)**. Trocar para Claude no futuro = criar `provedores/claude.ts` e registrar na fábrica.
- `src/embeddings.ts` — texto canônico de cada item para vetorização (768 dims) — usado também pelo script de embeddings do módulo `db`.
- `src/busca.ts` — busca semântica via função SQL `buscar_direitos` (pgvector), com fallback para a base inteira se os embeddings ainda não existirem.
- `src/triagem.ts` — orquestração da triagem + ordenação da linha de vida (heurística: violência/risco de vida no topo, depois `prioridade_base`).
- `src/prompts.ts` — prompt do assistente (tom acolhedor, uma pergunta por vez, proibição de coletar PII, nunca prometer aprovação).

**Stateless e sem PII**: o motor recebe o histórico a cada chamada e não grava nada. Não há tabela de conversa.

## Como rodar

Requer `.env` na raiz com `GEMINI_API_KEY`, `SUPABASE_URL` e `SUPABASE_CHAVE_PUBLICA`.

```bash
npm run rag:cli      # chat interativo no terminal
npm run rag:testes   # roda os 3 perfis dos critérios de aceite (seção 7 do SDD)
```

`rag:testes` executa perfis contra serviços reais quando há credenciais. A suíte padrão usa dependências falsas e valida contratos, proteção de dados, urgência, ficha completa e ordenação.
