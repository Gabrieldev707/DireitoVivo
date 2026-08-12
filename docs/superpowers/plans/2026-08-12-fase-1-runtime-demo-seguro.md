# Fase 1 — Runtime Seguro da Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar um runtime de demonstração que exige consentimento, mascara PII, trata urgências sem LLM e retorna um contrato profissional renderizado pelo frontend.

**Architecture:** A API mantém o estado stateless e passa mensagens por uma camada pura de proteção antes do motor RAG. Urgências saem por uma resposta determinística; conversas comuns seguem para o RAG, cujo resultado é convertido para uma união discriminada estável. O frontend exige aceite local não persistido e renderiza pergunta, urgência, orientação ou ausência de correspondência.

**Tech Stack:** TypeScript, Fastify 5, React 19, Vite 6, Vitest 4, Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-12-demo-publica-confiavel-design.md`

## Global Constraints

- O modo público desta etapa é `demo`; `producao` real continua bloqueado.
- Nenhuma conversa, aceite ou checklist é persistido no banco.
- Nenhum prompt, resposta ou dado mascarado é escrito em logs.
- Urgência explícita não chama embedding, Supabase nem LLM.
- A API recebe `aceite_demo: true` em cada requisição de triagem no modo demo.
- A interface não usa “100% anônima”, “sigilosa”, “oficial” ou promessa de elegibilidade.
- Cada mudança funcional é desenvolvida por teste falhando primeiro e termina em commit separado.

---

### Task 1: Estabilizar o executor de testes do frontend

**Files:**
- Modify: `frontend/vitest.config.ts`
- Verify: `frontend/tests/*.test.tsx`

**Interfaces:**
- Produces: comando `npm run test -w frontend` executando os testes `jsdom` com pool de threads e um worker.

- [ ] **Step 1: Confirmar a falha da linha de base**

Run: `npm run test -w frontend`

Expected: FAIL antes de executar testes, com `Failed to start forks worker` ou `Timeout waiting for worker to respond` no ambiente Windows com memória pressionada.

- [ ] **Step 2: Aplicar a configuração mínima**

Adicionar ao bloco `test`:

```ts
pool: 'threads',
maxWorkers: 1,
```

- [ ] **Step 3: Verificar a suíte frontend**

Run: `npm run test -w frontend`

Expected: PASS, 3 arquivos e 17 testes.

- [ ] **Step 4: Verificar o comando canônico**

Run: `npm test`

Expected: PASS, 60 testes no estado anterior às novas funcionalidades.

- [ ] **Step 5: Commit**

```powershell
git add frontend/vitest.config.ts
git commit -m "test: estabilizar workers do frontend"
```

### Task 2: Criar configuração explícita do modo da aplicação

**Files:**
- Create: `rag/src/modo-aplicacao.ts`
- Create: `rag/tests/modo-aplicacao.test.ts`
- Modify: `rag/src/index.ts`
- Modify: `.env.example`

**Interfaces:**
- Produces: `type ModoAplicacao = 'desenvolvimento' | 'demo' | 'producao'`.
- Produces: `obterModoAplicacao(ambiente?: NodeJS.ProcessEnv): ModoAplicacao`.
- Produces: `validarModoAplicacao(modo: ModoAplicacao): void` que recusa `producao` nesta etapa.

- [ ] **Step 1: Escrever testes falhando**

```ts
import { describe, expect, it } from 'vitest';
import { obterModoAplicacao, validarModoAplicacao } from '../src/modo-aplicacao.js';

describe('modo da aplicação', () => {
  it('usa desenvolvimento quando a variável está ausente', () => {
    expect(obterModoAplicacao({})).toBe('desenvolvimento');
  });

  it('aceita explicitamente o modo demo', () => {
    expect(obterModoAplicacao({ MODO_APLICACAO: 'demo' })).toBe('demo');
  });

  it('recusa valor desconhecido', () => {
    expect(() => obterModoAplicacao({ MODO_APLICACAO: 'publico' })).toThrow('MODO_APLICACAO');
  });

  it('mantém produção real bloqueada', () => {
    expect(() => validarModoAplicacao('producao')).toThrow('não está liberado');
  });
});
```

- [ ] **Step 2: Rodar e observar RED**

Run: `npm run test -w rag -- modo-aplicacao.test.ts`

Expected: FAIL porque `modo-aplicacao.ts` ainda não existe.

- [ ] **Step 3: Implementar o mínimo**

Criar funções puras, exportá-las por `rag/src/index.ts` e documentar em `.env.example`:

```dotenv
MODO_APLICACAO=desenvolvimento
```

- [ ] **Step 4: Rodar GREEN e regressão RAG**

Run: `npm run test -w rag`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add rag/src/modo-aplicacao.ts rag/tests/modo-aplicacao.test.ts rag/src/index.ts .env.example
git commit -m "feat: definir modo seguro da aplicacao"
```

### Task 3: Exigir consentimento no modo demo

**Files:**
- Modify: `api/src/rotas/triagem.ts`
- Modify: `api/tests/api.test.ts`

**Interfaces:**
- Consumes: `obterModoAplicacao()` da Task 2.
- Produces: corpo `POST /api/triagem` com `{ mensagens, aceite_demo?: boolean }`.
- Produces: HTTP 403 e `{ erro: string }` quando `MODO_APLICACAO=demo` e o aceite não é `true`.

- [ ] **Step 1: Escrever teste de rota falhando**

Adicionar um teste com app Fastify real e `MODO_APLICACAO=demo`:

```ts
it('recusa triagem sem aceite no modo demo', async () => {
  process.env.MODO_APLICACAO = 'demo';
  const resposta = await app.inject({
    method: 'POST',
    url: '/api/triagem',
    payload: { mensagens: [{ papel: 'usuario', conteudo: 'Perfil fictício sem dados pessoais' }] },
  });
  expect(resposta.statusCode).toBe(403);
  expect(resposta.json()).toEqual({
    erro: 'Confirme os termos da demonstração antes de continuar.',
  });
});
```

Restaurar `process.env.MODO_APLICACAO` no `afterEach` para não contaminar outros testes.

- [ ] **Step 2: Rodar e observar RED**

Run: `npm run test -w api -- api.test.ts`

Expected: FAIL porque a rota ainda aceita o corpo sem consentimento.

- [ ] **Step 3: Implementar schema e gate**

Adicionar `aceite_demo` opcional ao schema. No handler, antes do RAG, obter o modo e retornar 403 quando necessário. Em desenvolvimento, manter compatibilidade com testes existentes.

- [ ] **Step 4: Rodar GREEN e regressão API**

Run: `npm run test -w api`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add api/src/rotas/triagem.ts api/tests/api.test.ts
git commit -m "feat(api): exigir aceite na demonstracao"
```

### Task 4: Mascarar PII antes do provedor externo

**Files:**
- Create: `rag/src/protecao-dados.ts`
- Create: `rag/tests/protecao-dados.test.ts`
- Modify: `rag/src/triagem.ts`
- Modify: `rag/src/index.ts`
- Modify: `rag/tests/triagem.test.ts`

**Interfaces:**
- Produces: `protegerMensagens(mensagens: MensagemChat[]): { mensagens: MensagemChat[]; categoriasMascaradas: CategoriaDado[] }`.
- `CategoriaDado`: `cpf | email | telefone | cep`.
- Marcadores literais: `[CPF REMOVIDO]`, `[E-MAIL REMOVIDO]`, `[TELEFONE REMOVIDO]`, `[CEP REMOVIDO]`.

- [ ] **Step 1: Escrever testes puros falhando**

Cobrir ao menos:

```ts
expect(protegerMensagens([
  { papel: 'usuario', conteudo: 'CPF 123.456.789-09 e email pessoa@exemplo.com' },
])).toEqual({
  mensagens: [{ papel: 'usuario', conteudo: 'CPF [CPF REMOVIDO] e email [E-MAIL REMOVIDO]' }],
  categoriasMascaradas: ['cpf', 'email'],
});
```

Adicionar casos para CPF sem pontuação, telefone brasileiro, CEP e texto que contém somente valores monetários/datas e não deve ser alterado.

- [ ] **Step 2: Rodar e observar RED**

Run: `npm run test -w rag -- protecao-dados.test.ts`

Expected: FAIL porque o módulo não existe.

- [ ] **Step 3: Implementar mascaramento determinístico**

Aplicar padrões do mais específico ao mais amplo, deduplicar categorias na ordem de detecção e nunca mutar o array recebido.

- [ ] **Step 4: Escrever integração falhando com a triagem**

No teste existente do motor, capturar as mensagens recebidas pelo provedor fake e verificar que o CPF não chega a `gerarTexto` nem a `gerarEmbedding`.

- [ ] **Step 5: Rodar e observar RED da integração**

Run: `npm run test -w rag -- triagem.test.ts`

Expected: FAIL porque `executarTriagem` ainda usa o histórico original.

- [ ] **Step 6: Integrar proteção no início da triagem**

Usar as mensagens protegidas para relato de busca e geração. Adicionar `aviso_dados_mascarados: true` às respostas geradas quando alguma categoria for encontrada.

- [ ] **Step 7: Rodar GREEN e regressão RAG**

Run: `npm run test -w rag`

Expected: PASS.

- [ ] **Step 8: Commit**

```powershell
git add rag/src/protecao-dados.ts rag/tests/protecao-dados.test.ts rag/src/triagem.ts rag/src/index.ts rag/tests/triagem.test.ts
git commit -m "feat(rag): mascarar dados pessoais antes da ia"
```

### Task 5: Tratar urgência por regras determinísticas

**Files:**
- Create: `rag/src/urgencia.ts`
- Create: `rag/tests/urgencia.test.ts`
- Modify: `rag/src/tipos.ts`
- Modify: `rag/src/triagem.ts`
- Modify: `rag/src/index.ts`
- Modify: `rag/tests/triagem.test.ts`

**Interfaces:**
- Produces: `detectarUrgencia(texto: string): RespostaUrgencia | undefined`.
- Produces: `RespostaUrgencia` com `tipo: 'urgencia'`, `nivel: 'imediato'` e canais tipados.
- O detector cobre perigo atual/ameaça, violência contra mulher e ideação suicida; fome e falta de abrigo entram como prioridade social, não automaticamente como emergência policial.

- [ ] **Step 1: Escrever tabela de casos falhando**

Casos positivos literais:

```ts
[
  ['ele está armado e vai me matar agora', ['190']],
  ['meu marido me agrediu e estou em perigo', ['190', '180']],
  ['estou pensando em me matar hoje', ['188', '192']],
]
```

Casos negativos obrigatórios:

```ts
[
  'fui assaltado no ano passado e hoje estou desempregado',
  'tenho pensamentos ruins às vezes, mas não estou em risco agora',
  'quero informações sobre medida protetiva para outra pessoa',
]
```

- [ ] **Step 2: Rodar e observar RED**

Run: `npm run test -w rag -- urgencia.test.ts`

Expected: FAIL porque o detector não existe.

- [ ] **Step 3: Implementar detector conservador**

Normalizar caixa e acentos, exigir combinação entre marcador de risco e atualidade/intenção, e retornar canais fixos. Evitar regex única ampla que produza falso positivo nos casos negativos.

- [ ] **Step 4: Escrever teste de curto-circuito falhando**

Configurar provedor fake que lança se for chamado e executar:

```ts
const resposta = await executarTriagem([
  { papel: 'usuario', conteudo: 'Ele está armado e vai me matar agora' },
]);
expect(resposta.tipo).toBe('urgencia');
```

- [ ] **Step 5: Rodar e observar RED**

Run: `npm run test -w rag -- triagem.test.ts`

Expected: FAIL porque a busca/LLM ainda é chamada.

- [ ] **Step 6: Integrar antes da busca semântica**

Depois da proteção de dados, juntar mensagens de usuário, chamar `detectarUrgencia` e retornar imediatamente quando houver resposta.

- [ ] **Step 7: Rodar GREEN e regressão RAG**

Run: `npm run test -w rag`

Expected: PASS.

- [ ] **Step 8: Commit**

```powershell
git add rag/src/urgencia.ts rag/tests/urgencia.test.ts rag/src/tipos.ts rag/src/triagem.ts rag/src/index.ts rag/tests/triagem.test.ts
git commit -m "feat(rag): priorizar urgencias sem depender da llm"
```

### Task 6: Migrar para o contrato profissional de orientação

**Files:**
- Modify: `rag/src/tipos.ts`
- Modify: `rag/src/prompts.ts`
- Modify: `rag/src/triagem.ts`
- Modify: `rag/tests/prompts.test.ts`
- Modify: `rag/tests/triagem.test.ts`
- Modify: `frontend/src/tipos.ts`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/componentes/LinhaDaVida.tsx`
- Modify: `frontend/tests/LinhaDaVida.test.tsx`

**Interfaces:**
- Replaces: `{ tipo: 'resultado'; mensagem; itens }`.
- Produces: `{ tipo: 'orientacao'; resumo; confianca; itens; alertas; aviso_dados_mascarados }`.
- Cada item produz `situacao`, `criterios_confirmados`, `criterios_pendentes`, `proximos_passos`, `documentos` e ficha existente.

- [ ] **Step 1: Atualizar testes do motor para o contrato desejado**

Usar resposta fake literal:

```json
{
  "tipo": "orientacao",
  "resumo": "Há caminhos que vale confirmar.",
  "confianca": "media",
  "itens": [{
    "id": "bolsa-familia",
    "situacao": "precisa_confirmar",
    "motivo": "A renda relatada pode ser compatível.",
    "criterios_confirmados": ["Família com baixa renda"],
    "criterios_pendentes": ["Confirmar renda por pessoa"]
  }],
  "alertas": []
}
```

Verificar que ID fora dos candidatos é descartado e que orientação vazia vira `sem_match`.

- [ ] **Step 2: Rodar e observar RED no RAG**

Run: `npm run test -w rag -- triagem.test.ts prompts.test.ts`

Expected: FAIL por incompatibilidade de tipos/formato.

- [ ] **Step 3: Implementar tipos, prompt, parser e montagem**

Usar validadores explícitos para enums e arrays. `proximos_passos` e `documentos` vêm da ficha cadastrada; a LLM fornece apenas resumo, situação, motivo e critérios. A confiança é calculada pelo motor: `alta` quando não há critérios pendentes, `media` quando há até dois, `baixa` acima disso.

- [ ] **Step 4: Rodar GREEN no RAG**

Run: `npm run test -w rag`

Expected: PASS.

- [ ] **Step 5: Atualizar teste frontend antes da implementação**

Alterar a fixture de `LinhaDaVida.test.tsx` para `tipo: 'orientacao'` e verificar títulos acessíveis “O que parece compatível”, “O que confirmar”, “Próximos passos” e “Documentos”.

- [ ] **Step 6: Rodar e observar RED no frontend**

Run: `npm run test -w frontend -- LinhaDaVida.test.tsx`

Expected: FAIL porque o componente ainda espera `resultado`.

- [ ] **Step 7: Implementar renderização estruturada**

Atualizar tipos, estado do `App` e `LinhaDaVida`, preservando compartilhamento e leitura em voz alta sobre o resumo já validado.

- [ ] **Step 8: Rodar GREEN e regressão frontend**

Run: `npm run test -w frontend`

Expected: PASS.

- [ ] **Step 9: Commit**

```powershell
git add rag/src/tipos.ts rag/src/prompts.ts rag/src/triagem.ts rag/tests/prompts.test.ts rag/tests/triagem.test.ts frontend/src/tipos.ts frontend/src/App.tsx frontend/src/componentes/LinhaDaVida.tsx frontend/tests/LinhaDaVida.test.tsx
git commit -m "feat: estruturar orientacoes verificaveis"
```

### Task 7: Criar consentimento e identidade visual de demonstração

**Files:**
- Create: `frontend/src/componentes/ConsentimentoDemo.tsx`
- Create: `frontend/tests/ConsentimentoDemo.test.tsx`
- Modify: `frontend/src/api.ts`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/componentes/Chat.tsx`
- Modify: `frontend/src/componentes/GovHeader.tsx`
- Modify: `frontend/src/componentes/TelaInicial.tsx`
- Modify: `frontend/src/componentes/GovFooter.tsx`
- Modify: `frontend/src/estilos.css`
- Modify: `frontend/tests/Chat.test.tsx`
- Modify: `frontend/tests/TelaInicial.test.tsx`

**Interfaces:**
- Produces: `ConsentimentoDemo` com `aoAceitar(): void` e `aoCancelar(): void`.
- Changes: `enviarTriagem(mensagens, aceiteDemo)` envia `aceite_demo`.
- O aceite vive apenas no estado React e volta a `false` ao limpar/recarregar.

- [ ] **Step 1: Escrever testes falhando do consentimento**

Verificar:

- texto “Demonstração de portfólio”;
- aviso de provedor externo;
- botão “Entendi e quero testar”;
- chat não dispara envio antes do aceite;
- ao aceitar, o callback é chamado sem escrever em `localStorage`.

- [ ] **Step 2: Rodar e observar RED**

Run: `npm run test -w frontend -- ConsentimentoDemo.test.tsx`

Expected: FAIL porque o componente não existe.

- [ ] **Step 3: Implementar componente e fluxo mínimo**

Abrir consentimento ao iniciar chat livre ou cenário. Após aceite, enviar `aceite_demo: true`. Remover textos absolutos de anonimato e incluir selo permanente no cabeçalho.

- [ ] **Step 4: Atualizar testes de tela e chat**

Verificar que a comunicação nova está presente e que as expressões proibidas não aparecem na página renderizada.

- [ ] **Step 5: Rodar GREEN e regressão frontend**

Run: `npm run test -w frontend`

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add frontend/src/componentes/ConsentimentoDemo.tsx frontend/tests/ConsentimentoDemo.test.tsx frontend/src/api.ts frontend/src/App.tsx frontend/src/componentes/Chat.tsx frontend/src/componentes/GovHeader.tsx frontend/src/componentes/TelaInicial.tsx frontend/src/componentes/GovFooter.tsx frontend/src/estilos.css frontend/tests/Chat.test.tsx frontend/tests/TelaInicial.test.tsx
git commit -m "feat(frontend): apresentar demo com consentimento claro"
```

### Task 8: Integrar resposta de urgência no frontend

**Files:**
- Create: `frontend/src/componentes/AlertaUrgencia.tsx`
- Create: `frontend/tests/AlertaUrgencia.test.tsx`
- Modify: `frontend/src/tipos.ts`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/estilos.css`

**Interfaces:**
- Consumes: `RespostaUrgencia` da API.
- Produces: tela com canais clicáveis `tel:`, mensagem de perigo atual e ação “Limpar e sair”.

- [ ] **Step 1: Escrever teste falhando**

Renderizar `AlertaUrgencia` com canais 190 e 180 e verificar links `tel:190`, `tel:180`, título de alerta e callback de limpeza.

- [ ] **Step 2: Rodar e observar RED**

Run: `npm run test -w frontend -- AlertaUrgencia.test.tsx`

Expected: FAIL porque o componente não existe.

- [ ] **Step 3: Implementar componente e roteamento do App**

Quando a API retornar `urgencia`, interromper o chat e mostrar o alerta. Não exibir recomendações de benefício na mesma tela.

- [ ] **Step 4: Rodar GREEN e regressão frontend**

Run: `npm run test -w frontend`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add frontend/src/componentes/AlertaUrgencia.tsx frontend/tests/AlertaUrgencia.test.tsx frontend/src/tipos.ts frontend/src/App.tsx frontend/src/estilos.css
git commit -m "feat(frontend): exibir canais imediatos de urgencia"
```

### Task 9: Verificação integral da Fase 1

**Files:**
- Modify if needed: `README.md`
- Modify if needed: module READMEs

**Interfaces:**
- Produces: documentação fiel ao runtime entregue.

- [ ] **Step 1: Atualizar documentação factual**

Registrar modo demo, consentimento, mascaramento limitado por padrões, urgência determinística, novo contrato e limitações. Não registrar contagem de testes até obter a execução final.

- [ ] **Step 2: Rodar verificação completa**

Run:

```powershell
npm test
npm run typecheck
npm run build
npm audit --omit=dev
git diff --check
```

Expected: testes, typecheck e build com exit 0; `git diff --check` limpo. A auditoria de produção deve ser reportada literalmente — se ainda houver vulnerabilidade alta, a fase não recebe selo de pronta para deploy.

- [ ] **Step 3: Revisar requisitos da Fase 1**

Confirmar manualmente no diff:

- consentimento exigido pela API em demo;
- PII mascarada antes da primeira chamada externa;
- urgência não chama dependências externas;
- contrato frontend e backend idêntico;
- textos absolutos removidos;
- nenhum segredo ou log de conversa adicionado.

- [ ] **Step 4: Commit documental separado**

```powershell
git add README.md api/README.md rag/README.md frontend/README.md
git commit -m "docs: documentar runtime seguro da demo"
```

- [ ] **Step 5: Registrar o estado real**

Run: `git status --short --branch` e `git log --oneline -12`.

Expected: somente arquivos externos já conhecidos podem permanecer sem rastreamento; cada entrega funcional aparece em commit próprio.
