# Módulo `db` — Base de conhecimento

Responsável pelo schema do banco (Supabase/Postgres) e pela curadoria dos itens de direitos/benefícios. É a fundação de todo o resto (SDD, seção 8).

## O que tem aqui

- `migrations/` — SQL versionado, na ordem:
  - `0001_schema_direitos_itens.sql` — tabela `direitos_itens` (schema da seção 4.1 do SDD) + pgvector + RLS (leitura pública, escrita só service_role)
  - `0002_busca_semantica.sql` — função `buscar_direitos(consulta, limite, limiar)` para o RAG
- `seed/itens.json` — **fonte de verdade do conteúdo**: 30 itens curados cobrindo as 8 categorias de vida. Edite aqui, nunca direto no banco.
- `scripts/carregar-seed.ts` — upsert do JSON no banco
- `scripts/gerar-embeddings.ts` — gera os vetores de busca (Gemini `gemini-embedding-001`, 768 dims)

## Decisões de modelagem

- O canal de solicitação (objeto `{tipo, detalhe}` no SDD) vira duas colunas: `canal_tipo` + `canal_detalhe`.
- Colunas de infraestrutura que **não** fazem parte da ficha exibida: `termos_populares` (sinônimos/gírias, só para melhorar a busca semântica), `texto_embedding` (auditoria do que foi vetorizado), `embedding`, `criado_em`, `atualizado_em`.
- **Privacidade por design**: não existe nenhuma tabela de usuário, sessão ou conversa. O banco só guarda conteúdo público.
- `ultima_revisao` (obrigatório) permite auditar quando cada item foi revisado — revisão recomendada a cada 2-3 meses.

## Como rodar

Migrations e seed já estão aplicados no projeto Supabase `direito-vivo` (`wajycuocmmuyxbzeskyl`, região sa-east-1). Para reaplicar/atualizar:

```bash
# na raiz do repositório, com .env preenchido (SUPABASE_CHAVE_SERVICO):
npm run db:seed          # upsert dos itens do itens.json
npm run db:embeddings    # (re)gera embeddings — requer GEMINI_API_KEY
```

Migrations novas: aplicar via Dashboard do Supabase (SQL Editor) ou CLI, mantendo o arquivo versionado aqui.

## Processo de atualização da base (MVP, manual)

1. Edite `seed/itens.json` (e atualize `ultima_revisao` do item mexido).
2. `npm run db:seed`
3. `npm run db:embeddings` (o texto do item mudou ⇒ o vetor precisa mudar).
