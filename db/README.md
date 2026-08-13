# Módulo `db` — Base de conhecimento

Responsável pelo schema do banco (Supabase/Postgres) e pela curadoria dos itens de direitos/benefícios. É a fundação de todo o resto (SDD, seção 8).

## O que tem aqui

- `migrations/` — SQL versionado, na ordem:
  - `0001_schema_direitos_itens.sql` — tabela `direitos_itens` (schema da seção 4.1 do SDD) + pgvector + RLS (leitura pública, escrita só service_role)
  - `0002_busca_semantica.sql` — função `buscar_direitos(consulta, limite, limiar)` para o RAG
  - `0003_busca_direitos_embedding_dim.sql` — compatibiliza a dimensão do embedding usado pelo projeto
  - `0004_governanca_conteudo.sql` — metadados editoriais, RLS por publicação/vigência, escrita pública revogada e RPC limitada
- `seed/itens.json` — **fonte de verdade editorial**: 30 itens cobrindo as 8 categorias de vida. Atualmente 7 estão `publicavel`, 22 em `revisao_pendente` e 1 em `rascunho`.
- `scripts/auditar-conteudo.ts` — bloqueia erros editoriais antes de catálogo ou carga remota
- `scripts/carregar-seed.ts` — upsert do JSON no banco
- `scripts/gerar-embeddings.ts` — gera os vetores de busca (Gemini `gemini-embedding-001`, 768 dims)
- `scripts/gerar-catalogo-frontend.ts` — publica no catálogo local somente itens vigentes, revisados e publicáveis

## Decisões de modelagem

- O canal de solicitação (objeto `{tipo, detalhe}` no SDD) vira duas colunas: `canal_tipo` + `canal_detalhe`.
- Colunas de infraestrutura que **não** fazem parte da ficha exibida: `termos_populares` (sinônimos/gírias, só para melhorar a busca semântica), `texto_embedding` (auditoria do que foi vetorizado), `embedding`, `criado_em`, `atualizado_em`.
- **Privacidade por design**: não existe nenhuma tabela de usuário, sessão ou conversa. O banco só guarda conteúdo público.
- `status_conteudo`, `revisado_por`, `revisao_prevista_em`, vigência, versão e fontes oficiais formam o gate de publicação.
- Estados editoriais: `rascunho`, `revisao_pendente`, `publicavel` e `arquivado`. Somente `publicavel` com revisão vigente pode ser lido pela API pública.
- A migration revoga escrita de `anon` e `authenticated`; scripts de carga usam exclusivamente `service_role` no backend.

## Como rodar

O repositório não presume que o estado remoto acompanha os arquivos locais. Antes de qualquer atualização, valide localmente:

```bash
# na raiz do repositório
npm run db:auditar
npm test
npm run typecheck
npm run build
```

Depois da revisão do SQL, aplique as migrations em ordem por uma ferramenta oficial do Supabase. Só então, com `.env` preenchido e `SUPABASE_CHAVE_SERVICO` disponível apenas no backend:

```bash
npm run db:seed
npm run db:embeddings
```

Após a carga, confirme no ambiente remoto: RLS ativo; `anon` e `authenticated` sem escrita; leitura retornando apenas itens publicáveis e vigentes; RPC limitando `limite` e `limiar`; advisors de segurança sem achados bloqueantes. Esses checks remotos ainda são pendentes enquanto não houver evidência de execução.

## Processo de atualização da base (MVP, manual)

1. Edite `seed/itens.json`; atualize conteúdo, fontes, datas, revisor e `versao_conteudo`.
2. Mantenha o item em `revisao_pendente` até uma pessoa responsável confirmar as fontes e os critérios.
3. Execute `npm run db:auditar`. Erros bloqueiam; avisos indicam itens deliberadamente fora da publicação.
4. Quando aprovado, altere para `publicavel` e execute novamente auditoria, testes e `npm run db:catalogo`.
5. Em uma janela controlada, execute `npm run db:seed` e `npm run db:embeddings`.
6. Valide permissões e resultados no Supabase antes de liberar uma preview.
