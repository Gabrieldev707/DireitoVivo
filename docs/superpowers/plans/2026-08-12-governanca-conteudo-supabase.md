# Governança de Conteúdo e Supabase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer com que somente direitos com conteúdo rastreável, revisão válida e fonte oficial possam ser recomendados pela demonstração.

**Architecture:** O seed JSON continua sendo a fonte editorial de verdade e ganha metadados tipados de governança. Um auditor local puro valida o conteúdo antes de seed, catálogo ou embeddings. Uma migration versionada espelha os campos no Supabase, restringe leitura/RPC a itens publicáveis e limita parâmetros da busca; nenhuma alteração será aplicada ao projeto remoto neste bloco.

**Tech Stack:** TypeScript, Vitest, Node.js, PostgreSQL/Supabase, pgvector.

**Spec:** `docs/superpowers/specs/2026-08-12-demo-publica-confiavel-design.md`

## Global Constraints

- O Supabase armazena apenas conteúdo público; nenhuma conversa, perfil ou feedback textual.
- Somente `status_conteudo = 'publicavel'`, dentro da vigência, com revisão válida e fonte oficial pode entrar na busca da demo.
- `service_role` permanece somente no backend/scripts; nunca no frontend.
- Migrations são criadas e verificadas localmente, sem aplicação remota automática.
- Fonte oficial precisa usar HTTPS e domínio governamental permitido; portais agregadores, blogs e redes sociais não qualificam.
- `revisado_por` representa revisão editorial, nunca revisão jurídica.
- Cada mudança funcional segue RED → GREEN → regressão → commit separado.

---

### Task 1: Criar contrato editorial e auditor local

**Files:**
- Create: `db/src/conteudo.ts`
- Create: `db/tests/conteudo.test.ts`
- Create: `db/scripts/auditar-conteudo.ts`
- Modify: `db/package.json`

**Interfaces:**
- Produces: `StatusConteudo = 'rascunho' | 'revisao_pendente' | 'publicavel' | 'expirado'`.
- Produces: `auditarItens(itens, hoje): ProblemaConteudo[]`.
- Produces: `podeSerPublicado(item, hoje): boolean`.
- Produces: comando `npm run db:auditar` com código 1 quando houver erro bloqueante.

- [ ] **Step 1: Escrever testes falhando**

Cobrir com fixtures literais: item publicável válido; URL HTTP; domínio não oficial; fonte vazia; revisão vencida; vigência encerrada; programa temporário sem vigência; campo essencial vazio; afirmações absolutas (`direito garantido`, `você tem direito`); IDs duplicados.

- [ ] **Step 2: Rodar e observar RED**

Run: `npm exec --workspace db vitest run tests/conteudo.test.ts`

Expected: FAIL porque `db/src/conteudo.ts` não existe.

- [ ] **Step 3: Implementar o contrato mínimo**

Domínios aceitos inicialmente: `gov.br` e subdomínios, `planalto.gov.br`, `in.gov.br`, `camara.leg.br`, `senado.leg.br`, `cnj.jus.br`, `stf.jus.br`, `stj.jus.br`, `trf*.jus.br`, `trt*.jus.br`, `defensoria.*.def.br`, `caixa.gov.br` e `dataprev.gov.br`. URLs devem ser analisadas por `URL`, nunca por sufixo textual ingênuo.

- [ ] **Step 4: Implementar CLI sem acesso de rede**

O script lê `db/seed/itens.json`, usa a data recebida por `--hoje=AAAA-MM-DD` ou a data atual e imprime um resumo por severidade, sem modificar arquivos.

- [ ] **Step 5: Rodar GREEN e regressão**

Run: `npm exec --workspace db vitest run tests/conteudo.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add db/src/conteudo.ts db/tests/conteudo.test.ts db/scripts/auditar-conteudo.ts db/package.json
git commit -m "feat(db): auditar governanca do conteudo"
```

### Task 2: Versionar schema e políticas seguras

**Files:**
- Create: `db/migrations/0004_governanca_conteudo.sql`
- Create: `db/tests/migration-governanca.test.ts`

**Interfaces:**
- Adds: colunas `resumo_simples`, `criterios_estruturados`, `excecoes_e_alertas`, `fontes_oficiais`, `vigencia_inicio`, `vigencia_fim`, `status_conteudo`, `revisado_por`, `revisao_prevista_em`, `versao_conteudo`.
- Replaces: política pública para permitir somente conteúdo publicável e vigente.
- Replaces: `buscar_direitos` com `limite` efetivo entre 1 e 20 e `limiar` entre 0 e 1.

- [ ] **Step 1: Escrever teste de contrato SQL falhando**

O teste carrega as migrations em ordem e exige: RLS habilitado; revogação explícita de escrita; política de leitura publicável/vigente; RPC `security invoker`; `search_path` explícito; limites defensivos; `EXECUTE` revogado de `PUBLIC` e concedido somente a `anon`, `authenticated` e `service_role`.

- [ ] **Step 2: Rodar RED**

Run: `npm exec --workspace db vitest run tests/migration-governanca.test.ts`

Expected: FAIL porque a migration 0004 não existe.

- [ ] **Step 3: Criar migration imperativa versionada**

Usar `jsonb` para critérios/fontes, checks para status/versão/vigência e política idempotente. Não executar contra o projeto remoto.

- [ ] **Step 4: Rodar GREEN**

Run: `npm exec --workspace db vitest run tests/migration-governanca.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add db/migrations/0004_governanca_conteudo.sql db/tests/migration-governanca.test.ts
git commit -m "feat(db): restringir base a conteudo publicavel"
```

### Task 3: Curar lote inicial com fontes oficiais

**Files:**
- Modify: `db/seed/itens.json`
- Modify: `db/tests/conteudo.test.ts`

**Interfaces:**
- Produces: metadados completos para todos os 30 itens.
- Produces: um lote inicial `publicavel` somente após verificação em fonte oficial atual.
- Marks: conteúdo duvidoso, temporário ou dependente de regra local como `revisao_pendente`, `rascunho` ou `expirado`.

- [ ] **Step 1: Criar teste de integração do seed**

O teste exige IDs únicos, todos os campos editoriais presentes e `auditarItens` sem erros bloqueantes nos itens `publicavel`.

- [ ] **Step 2: Rodar RED**

Run: `npm exec --workspace db vitest run tests/conteudo.test.ts`

Expected: FAIL porque o seed ainda usa o contrato antigo.

- [ ] **Step 3: Verificar fontes oficiais e atualizar o seed**

Para cada item publicável, registrar título, URL, órgão e `acessado_em=2026-08-12`. Não inferir vigência nem requisito. O item `novo-desenrola-brasil` não pode permanecer publicável sem norma/programa oficial vigente comprovado.

- [ ] **Step 4: Rodar auditor**

Run: `npm run db:auditar -- --hoje=2026-08-12`

Expected: exit 0 para o conjunto publicável; pendências editoriais aparecem como avisos não publicáveis.

- [ ] **Step 5: Commit**

```powershell
git add db/seed/itens.json db/tests/conteudo.test.ts
git commit -m "content: adicionar fontes e status editoriais"
```

### Task 4: Propagar governança pelo seed, busca e catálogo

**Files:**
- Modify: `rag/src/tipos.ts`
- Modify: `rag/src/busca.ts`
- Modify: `rag/src/triagem.ts`
- Modify: `rag/tests/triagem.test.ts`
- Modify: `db/scripts/carregar-seed.ts`
- Modify: `db/scripts/gerar-embeddings.ts`
- Modify: `db/scripts/gerar-catalogo-frontend.ts`
- Modify: `frontend/src/tipos.ts`
- Modify: `frontend/src/componentes/FichaItem.tsx`
- Modify: `frontend/tests/LinhaDaVida.test.tsx`

**Interfaces:**
- Adds: `fontes_oficiais` às fichas e orientações.
- Filters: seed/catalog/embedding para conteúdo publicável, vigente e auditado.
- Produces: links oficiais visíveis com órgão e data de acesso.

- [ ] **Step 1: Atualizar testes de contrato antes da implementação**

Exigir que fonte oficial cadastrada atravesse `linhaParaItem`, resposta de orientação e renderização; item não publicável não pode entrar no catálogo gerado.

- [ ] **Step 2: Rodar RED**

Run: `npm test --workspace rag` e `npm test --workspace frontend`

Expected: FAIL no novo contrato.

- [ ] **Step 3: Implementar propagação mínima**

Documentos/próximos passos/fontes continuam vindo exclusivamente da ficha cadastrada. O prompt recebe fontes, mas a LLM não cria nem altera URLs.

- [ ] **Step 4: Regenerar catálogo e verificar determinismo**

Run: `npm run db:catalogo`, repetir o comando e confirmar `git diff` idêntico.

- [ ] **Step 5: Rodar GREEN**

Run: `npm test`, `npm run typecheck`, `npm run build`.

- [ ] **Step 6: Commit**

```powershell
git add rag db/scripts frontend
git commit -m "feat: exibir apenas orientacoes com fonte oficial"
```

### Task 5: Verificação local e documentação operacional

**Files:**
- Modify: `README.md`
- Modify: `db/README.md`

**Interfaces:**
- Documents: fluxo editorial seed → auditor → catálogo → seed remoto → embeddings.
- Records: limites da verificação local e passos remotos ainda não executados.

- [ ] **Step 1: Atualizar documentação factual**

Registrar comandos, status editoriais e a regra de publicação. Não declarar migration aplicada, advisors limpos ou embeddings completos sem evidência remota.

- [ ] **Step 2: Executar gates locais**

Run:

```powershell
npm run db:auditar -- --hoje=2026-08-12
npm test
npm run typecheck
npm run build
npm audit --omit=dev
git diff --check
```

- [ ] **Step 3: Revisar segurança manualmente**

Confirmar no diff: nenhuma chave; nenhuma conversa; escrita pública revogada; leitura limitada; RPC limitada; URLs vindas do seed; migration não aplicada remotamente.

- [ ] **Step 4: Commit documental**

```powershell
git add README.md db/README.md
git commit -m "docs: registrar fluxo editorial auditavel"
```

- [ ] **Step 5: Registrar estado real**

Run: `git status --short --branch` e `git log --oneline -15`.

Expected: branch limpa e commits separados; aplicação remota, advisors e validação live permanecem pendentes.
