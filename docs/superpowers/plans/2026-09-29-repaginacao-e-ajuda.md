# Repaginação e acesso à ajuda Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** entregar uma experiência local clara e acessível para descobrir direitos por situação de vida, encontrar ajuda humana e usar a triagem com informação e aceite explícitos.

**Architecture:** preservar React/Vite, Fastify e o catálogo gerado. A API rejeita triagem sem aceite antes do motor; o frontend mantém relato e resultado somente em memória, sincroniza navegação por hash e compartilha os dados estáticos de ajuda em um módulo. O redesign altera componentes existentes e CSS, sem nova biblioteca de roteamento, conta ou integração remota.

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind 4, Fastify 5, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-29-repaginacao-e-ajuda-design.md`; ler também `docs/superpowers/specs/2026-08-12-demo-publica-confiavel-design.md` para comunicação de privacidade.

## Global Constraints

- Projeto independente e demonstração; não sugerir vínculo governamental ou decisão de elegibilidade.
- O texto enviado à API é processado por provedor externo; não usar “100% anônima”, “sigilosa”, “nada sai do navegador” nem equivalentes.
- Não incluir nome, CPF, endereço, telefone ou relato na URL, em `localStorage`, em log ou no texto compartilhado.
- Preservar `db/seed/itens.json` como origem do catálogo gerado e manter as 30 fichas.
- Conteúdo de urgência usa fontes oficiais e distingue 190/192 de 180/100/CRAS.
- Sem chamada real ao provedor, publicação ou alteração remota de banco durante a implementação e os testes.
- No celular, Ajuda e ao menos uma ação principal devem aparecer sem rolagem horizontal; controles de toque com pelo menos 44 px.
- `prefers-reduced-motion` elimina loops decorativos e rolagem suave não essencial.
- Cada tarefa termina com testes focados, `git diff --check` e commit somente dos arquivos daquela tarefa.

## Review Focus

1. **Envio sem aceite, inclusive chamada direta à API:** rejeitar antes de `executarTriagem`; Task 1 cobre com teste de injeção.
2. **Cenário que parece apenas navegação:** exibir prévia e aguardar aceite antes do primeiro `fetch`; Task 2 cobre com teste de integração.
3. **Hash antigo ou botão Voltar:** mostrar a tela correta e preservar a conversa em memória; Task 3 cobre com teste de navegação.
4. **Busca sem acento e termo popular com filtro combinado:** encontrar apenas fichas pertinentes e orientar em resultado vazio; Task 5 cobre com teste de catálogo.
5. **Teclado dentro da ficha sobreposta:** focar, conter Tab, fechar com Escape e devolver foco; Task 5 cobre com teste de diálogo.

---

## File map

| Arquivo | Responsabilidade neste plano |
| --- | --- |
| `api/src/rotas/triagem.ts` | Exigir aceite antes do motor |
| `api/tests/api.test.ts`, `api/tests/rate-limit.test.ts` | Contrato de aceite, rejeição sem chamada e manutenção do limite |
| `frontend/src/api.ts` | Enviar `aceite_demo` booleano |
| `frontend/src/App.tsx` | Estado de conversa, prévia, aceite e navegação |
| `frontend/src/componentes/AvisoDemo.tsx` | Explicação e decisão antes do envio |
| `frontend/src/componentes/Ajuda.tsx` | Ajuda humana, urgência e dúvidas práticas |
| `frontend/src/dados/canaisAjuda.ts` | Canais oficiais e proveniência |
| `frontend/src/navegacao.ts` | Hashes atuais e antigos |
| `frontend/src/componentes/GovHeader.tsx`, `GovFooter.tsx` | Marca independente e entradas claras |
| `frontend/src/componentes/TelaInicial.tsx` | Entrada por necessidade e busca |
| `frontend/src/componentes/Portifolio.tsx` | Busca e ficha acessível |
| `frontend/src/componentes/CenariosVida.tsx` | Situações e prévia antes da triagem |
| `frontend/src/componentes/Chat.tsx`, `LinhaDaVida.tsx` | Texto, retorno e estados |
| `frontend/src/estilos.css`, `frontend/index.html`, `frontend/public/manifest.webmanifest` | Sistema visual, movimento, metadados |

### Task 1: API e cliente exigem aceite verificável

**Files:** Modify `api/src/rotas/triagem.ts`, `api/tests/api.test.ts`, `api/tests/rate-limit.test.ts`, `frontend/src/api.ts`; create `frontend/tests/api.test.ts`.

**Interfaces:** `enviarTriagem(mensagens: MensagemChat[], aceiteDemo: true): Promise<RespostaTriagem>` envia `{ mensagens, aceite_demo: true }`. A API aceita somente `aceite_demo: true`; resposta para falta ou falso é 400 e o motor não é chamado. O cliente não transforma um booleano falso em verdadeiro.

- [ ] **Step 1: Escrever teste de API que falha.** Em `api/tests/api.test.ts`, adicionar casos para payload ausente e falso, além de ajustar `historicoValido` para `{ mensagens: [...], aceite_demo: true }`:

```ts
for (const aceite of [undefined, false]) {
  it(`rejeita aceite ${String(aceite)} antes do motor`, async () => {
    const payload = aceite === undefined
      ? { mensagens: historicoValido.mensagens }
      : { ...historicoValido, aceite_demo: aceite };
    const r = await app.inject({ method: 'POST', url: '/api/triagem', payload });
    expect(r.statusCode).toBe(400);
    expect(mockExecutarTriagem).not.toHaveBeenCalled();
  });
}
```

- [ ] **Step 2: Confirmar RED.** Rodar `npm run test -w api -- api.test.ts`; esperado: os dois casos novos falham porque a rota atual processa sem aceite.
- [ ] **Step 3: Implementar o contrato.** Adicionar `aceite_demo` às propriedades do schema com `type: 'boolean', enum: [true]` e ao vetor `required`; tipar o corpo como `{ mensagens: MensagemChat[]; aceite_demo: true }`. A validação do Fastify acontece antes de `executarTriagem`. Em `frontend/src/api.ts`, acrescentar o parâmetro literal `true` e enviá-lo no JSON. Em `api/tests/rate-limit.test.ts`, acrescentar `aceite_demo: true` ao payload compartilhado:

```ts
export async function enviarTriagem(
  mensagens: MensagemChat[],
  aceiteDemo: true,
): Promise<RespostaTriagem> {
  const resposta = await fetch('/api/triagem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mensagens, aceite_demo: aceiteDemo }),
  });
  if (!resposta.ok) {
    const corpo = (await resposta.json().catch(() => null)) as { erro?: string } | null;
    throw new Error(corpo?.erro ?? 'Não consegui falar com o servidor. Tente de novo.');
  }
  return (await resposta.json()) as RespostaTriagem;
}
```

- [ ] **Step 4: Testar cliente.** Em `frontend/tests/api.test.ts`, mockar `fetch`, chamar `enviarTriagem([{ papel: 'usuario', conteudo: 'teste' }], true)` e verificar `JSON.parse(init.body)` com `aceite_demo: true`; a resposta falsa deve lançar a mensagem opaca já prevista.
- [ ] **Step 5: Confirmar GREEN.** Rodar `npm run test -w api -- api.test.ts` e `npm run test -w frontend -- api.test.ts`; depois `npm run typecheck` e `git diff --check`.
- [ ] **Step 6: Commit.** `git add api/src/rotas/triagem.ts api/tests/api.test.ts api/tests/rate-limit.test.ts frontend/src/api.ts frontend/tests/api.test.ts` e `git commit -m "fix: exigir aceite antes da triagem"`.

### Task 2: Aviso prévio e prévia dos cenários

**Files:** Create `frontend/src/componentes/AvisoDemo.tsx`, `frontend/tests/AvisoDemo.test.tsx`, `frontend/tests/AppTriagem.test.tsx`; modify `frontend/src/App.tsx`, `frontend/src/componentes/CenariosVida.tsx`, `frontend/tests/Chat.test.tsx`.

**Interfaces:** `AvisoDemo` recebe `{ aberto: boolean; contexto?: { titulo: string; texto: string }; aoAceitar: () => void; aoFechar: () => void }`. `App` guarda `aceiteDemo` apenas em estado; `mensagemPendente` guarda a primeira resposta até o aceite. `processarTriagem(historico, true)` é o único caminho até `enviarTriagem`.

- [ ] **Step 1: Escrever testes que falham.** `AvisoDemo.test.tsx` verifica texto sobre provedor externo, ausência de chamada ao confirmar sem marcar aceite, fechamento por Escape e foco de volta. `AppTriagem.test.tsx` mocka `enviarTriagem` e prova que clicar em “Simular cenário” apenas abre prévia; ao aceitar, chama uma vez com a mensagem exibida. Inclua o caso de pessoa que fecha o aviso e continua no catálogo.
- [ ] **Step 2: Confirmar RED.** `npm run test -w frontend -- AvisoDemo.test.tsx AppTriagem.test.tsx` deve falhar por componente e comportamento ausentes.
- [ ] **Step 3: Implementar o diálogo.** Usar `role="dialog"`, `aria-modal="true"`, título e descrição associados; checkbox desmarcado por padrão, botão de confirmação desabilitado até marcar. Texto principal:

```tsx
<p>O Direito Vivo não cria conta nem salva o histórico desta conversa em seu banco. O relato será processado por um provedor externo de IA. Não informe nome, CPF, endereço ou telefone. A resposta é orientativa.</p>
<label><input type="checkbox" checked={confirmou} onChange={(evento) => setConfirmou(evento.target.checked)} /> Entendi e quero iniciar a demonstração</label>
```

  Ao fechar, descartar `mensagemPendente`; ao aceitar, definir `aceiteDemo` em memória e enviar somente então. Para cenário, exibir `contexto.texto` antes da confirmação. Para conversa digitada, manter o texto no campo ou em estado pendente até a confirmação sem duplicar mensagens. Reutilizar rotina de foco e Escape entre aviso e ficha do catálogo na Task 5.
- [ ] **Step 4: Corrigir linguagem nos fluxos tocados.** Substituir a abertura e o banner do chat por frases verificáveis; atualizar o teste antigo que procurava “anônima” para procurar aviso sobre dados e provedor. O botão de cenário deve dizer o que acontecerá, por exemplo “Ver prévia da conversa”.
- [ ] **Step 5: Confirmar GREEN.** Rodar os testes focados, `npm run typecheck`, `git diff --check`; inspecionar que `enviarTriagem` aparece apenas depois do aceite no caminho do App.
- [ ] **Step 6: Commit.** Adicionar somente arquivos da Task 2 e `git commit -m "feat: explicar e confirmar uso da triagem"`.

### Task 3: Navegação coerente e ajuda sempre acessível

**Files:** Create `frontend/src/navegacao.ts`, `frontend/src/dados/canaisAjuda.ts`, `frontend/src/componentes/Ajuda.tsx`, `frontend/tests/navegacao.test.ts`, `frontend/tests/Ajuda.test.tsx`; modify `frontend/src/App.tsx`, `frontend/src/componentes/GovHeader.tsx`, `frontend/src/componentes/GovFooter.tsx`, `frontend/src/componentes/Chat.tsx`.

**Interfaces:** `type Pagina = 'inicio' | 'direitos' | 'situacoes' | 'ajuda' | 'conversa'`; `lerPagina(hash: string): Pagina` mapeia `catalogo→direitos`, `cenarios→situacoes`, `chat→conversa`; `abrirPagina(pagina: Pagina): void` escreve `location.hash`. `Ajuda` não recebe dados pessoais nem usa API. `Chat` recebe `aoVoltar: () => void`, substituindo `history.back()`.

- [ ] **Step 1: Escrever testes que falham.** `navegacao.test.ts` cobre hashes novos, antigos, inválidos, voltar/avançar e ausência de relato no hash. `Ajuda.test.tsx` verifica 190/192 em perigo imediato, 180/100 como orientação e CRAS fora da seção de emergência. Teste de App verifica navegação até Ajuda sem limpar mensagens.
- [ ] **Step 2: Confirmar RED.** `npm run test -w frontend -- navegacao.test.ts Ajuda.test.tsx AppTriagem.test.tsx` falha nas importações e nos fluxos novos.
- [ ] **Step 3: Criar dados de ajuda com fontes.** Em `canaisAjuda.ts`, usar registros tipados e URLs oficiais da spec; exemplo:

```ts
export interface CanalAjuda {
  id: string;
  titulo: string;
  quando_usar: string;
  acao: string;
  url_oficial: string;
  fonte: string;
  verificado_em: string;
  nivel: 'imediato' | 'orientacao' | 'assistencia';
}
```

  Conferir links e texto ao implementar; registrar data real da consulta. `Ajuda.tsx` renderiza `<a href="tel:190">` e equivalentes para números, link oficial descritivo e perguntas frequentes sobre privacidade, documentos, limites e como usar a triagem.
- [ ] **Step 4: Implementar roteamento por hash.** Substituir `replaceState` a cada troca por função `abrirPagina` e ouvinte de `hashchange`; preservar resultado como tela transitória e voltar do chat para a página de origem guardada em memória. Hash legado deve carregar a página canônica. Nunca serializar `mensagens`/`resultado`.
- [ ] **Step 5: Atualizar cabeçalho e rodapé.** Expor Ajuda e acesso urgente em todas as telas, marca independente e rótulos claros. No celular, usar menu acessível ou quebra responsiva que mantenha Ajuda visível sem rolagem horizontal. Remover comentários que descrevem o site como oficial.
- [ ] **Step 6: Confirmar GREEN.** Testes focados, `npm run typecheck`, `git diff --check`; verificar manualmente hashes `#catalogo`, `#cenarios`, `#chat` e `#ajuda` em URL local.
- [ ] **Step 7: Commit.** Adicionar somente arquivos da Task 3 e `git commit -m "feat: abrir ajuda e corrigir navegacao"`.

### Task 4: Página inicial e identidade visual

**Files:** Modify `frontend/src/componentes/TelaInicial.tsx`, `frontend/src/componentes/GovHeader.tsx`, `frontend/src/componentes/GovFooter.tsx`, `frontend/src/estilos.css`, `frontend/index.html`, `frontend/public/manifest.webmanifest`, `frontend/tests/TelaInicial.test.tsx`; create `frontend/tests/identidade.test.tsx`.

**Interfaces:** `TelaInicial` recebe `aoBuscarDireitos(termo: string)`, `aoVerAjuda()`, `aoVerSituacoes()`, `aoComecar()`; `App` passa `termoInicial` ao catálogo, sem colocá-lo na URL. O conteúdo da página usa as oito categorias existentes e a rota de ajuda da Task 3.

- [ ] **Step 1: Escrever testes que falham.** Testar busca inicial por “BPC”, chamada correta de `aoBuscarDireitos`, botão de ajuda antes da triagem, aviso de independência e disclaimer antes do CTA. Testar por texto que as frases absolutas de anonimato não aparecem na página e em `index.html`.
- [ ] **Step 2: Confirmar RED.** `npm run test -w frontend -- TelaInicial.test.tsx identidade.test.tsx` falha nas novas ações e no texto antigo.
- [ ] **Step 3: Reescrever a primeira dobra.** Busca, situações e acesso urgente vêm antes da explicação longa. Usar uma fotografia apenas se autoria/licença dos arquivos atuais forem verificáveis; sem prova, usar composição tipográfica e formas CSS. Remover painéis e cartões repetidos, preservando o conteúdo informativo necessário.
- [ ] **Step 4: Aplicar tokens e metadados.** Em `estilos.css`, criar `--ink: #173044`, `--navy: #173B52`, `--surface-blue: #EAF2F5`, `--action: #176B5B`, `--focus: #F3C85A`; atualizar cores, tipografia e layout dos componentes tocados. Em `index.html`, corrigir título, descrição e OG/Twitter; retirar Google Fonts e promessas de anonimato. Alinhar `theme_color` do manifest.
- [ ] **Step 5: Confirmar GREEN.** Testes focados, `npm run typecheck`, `npm run build`, `git diff --check`; revisar 360 px, 768 px e desktop com screenshot, foco e contraste. Se não houver ferramenta visual, registrar essa limitação e fazer inspeção manual do DOM/CSS.
- [ ] **Step 6: Commit.** Adicionar somente arquivos da Task 4 e `git commit -m "feat: redesenhar inicio e identidade"`.

### Task 5: Catálogo, cenários, conversa e resultado acessíveis

**Files:** Modify `frontend/src/componentes/Portifolio.tsx`, `CenariosVida.tsx`, `Chat.tsx`, `LinhaDaVida.tsx`, `FichaItem.tsx`, `frontend/src/estilos.css`, `frontend/tests/Chat.test.tsx`, `frontend/tests/LinhaDaVida.test.tsx`; create `frontend/tests/Portifolio.test.tsx`, `frontend/tests/CenariosVida.test.tsx`.

**Interfaces:** `Portifolio` aceita `termoInicial?: string` e continua usando `CATALOGO_DIREITOS`; função local `normalizarBusca(texto: string): string` remove diacríticos via `normalize('NFD').replace(/[\u0300-\u036f]/g, '')`, minúsculas e espaços extras. A ficha exposta por `itemModal` usa `role="dialog"` e `aria-modal="true"`.

- [ ] **Step 1: Escrever testes que falham.** Catálogo: “auxilio” acha “Auxílio”, termo popular encontra item, categoria combinada reduz resultados, limpar restaura lista, busca sem resultado mostra saída útil. Diálogo: foco vai ao título/fechar, Tab não escapa, Escape fecha e foco volta ao botão “Ver ficha”. Cenários: clicar não envia API; mostra prévia. Chat: Voltar chama `aoVoltar`, erro oferece Ajuda. Resultado: compartilhamento não contém relato nem promessa absoluta.
- [ ] **Step 2: Confirmar RED.** `npm run test -w frontend -- Portifolio.test.tsx CenariosVida.test.tsx Chat.test.tsx LinhaDaVida.test.tsx` deve falhar nos comportamentos novos.
- [ ] **Step 3: Implementar busca e diálogo.** Normalizar o termo e cada campo buscável; passar `termoInicial` do App. Guardar `document.activeElement` ao abrir, focar título ou Fechar, conter Tab/Shift+Tab, fechar Escape e restaurar foco. Travar rolagem do body enquanto aberto e limpar listeners/estilo no unmount. Não duplicar a ficha em outro banco de dados.
- [ ] **Step 4: Ajustar estados e linguagem.** Cenários mostram canais humanos primeiro nos casos de risco; conversa usa rótulos claros sem estética de mensageiro que sugira sigilo; resultado chama a lista de “orientação” e mantém o disclaimer. Erro 429/502 aponta catálogo e ajuda; imprimir não inclui ações inúteis. Retirar “Nada sai do seu navegador” do compartilhamento.
- [ ] **Step 5: Aplicar movimento contido.** Remover seletores `brasil-globe` e seus `@keyframes` se ficarem sem uso; não animar toda página no carregamento. Em CSS:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

  No `Chat`, usar `matchMedia('(prefers-reduced-motion: reduce)')` para escolher `behavior: 'auto'` no `scrollTo`.
- [ ] **Step 6: Confirmar GREEN.** Testes focados, `npm run typecheck`, `npm run build`, `git diff --check`; revisar teclado e movimento reduzido no navegador.
- [ ] **Step 7: Commit.** Adicionar somente arquivos da Task 5 e `git commit -m "fix: tornar catalogo e triagem acessiveis"`.

### Task 6: Verificação integrada e entrega local

**Files:** Modify `frontend/README.md` e, se necessário, testes que revelem defeitos concretos; criar `docs/auditorias/2026-09-29-repaginacao-e-ajuda.md` com evidência e limites.

**Interfaces:** nenhuma nova; verificar o fluxo completo do plano e manter o backend mockado/offline.

- [ ] **Step 1: Executar gates.** Rodar `npm test`, `npm run typecheck`, `npm run build` e `git diff --check`; registrar contagem, comando, código de saída e eventual falha com causa.
- [ ] **Step 2: Fazer revisão de conteúdo e links.** `rg -n -i '100% anônim|sigilos|nada sai|oficial gov|você vai receber' frontend/src frontend/index.html`; revisar ocorrências no contexto. Abrir fontes oficiais de 190/192/180/100/CRAS e registrar data de verificação. Não chamar LLM nem alterar seed jurídico sem evidência específica.
- [ ] **Step 3: Verificar experiência no navegador.** Conferir início, Ajuda, catálogo, cenário, aviso, chat mockado e resultado mockado em 360 px, 768 px e desktop; teclado, foco, alto contraste, zoom de texto, movimento reduzido, recarga e voltar/avançar. Registrar screenshots locais e problemas encontrados; corrigir apenas problemas deste escopo e repetir o gate pertinente.
- [ ] **Step 4: Atualizar documentação.** `frontend/README.md` descreve rotas, ajuda, privacidade verificável e como rodar testes. O relatório lista o que passou, o que foi só inspecionado e o que ainda exige revisão jurídica ou teste com provedor real.
- [ ] **Step 5: Commit e estado final.** `git add frontend/README.md docs/auditorias/2026-09-29-repaginacao-e-ajuda.md` mais correções efetivas; `git commit -m "docs: registrar verificacao da repaginacao"`; `git status --short --branch` deve deixar intactos `.claude/` e `.codex/` preexistentes.

## Handoff

Executar Task 1 primeiro. Não publicar, usar credenciais reais, chamar provedor remoto ou aplicar alterações ao banco durante este plano. Se o contrato real ou o conteúdo jurídico apresentar divergência, registrar a evidência e corrigir apenas o necessário ao fluxo aprovado; ampliar o escopo exige atualizar a especificação.
