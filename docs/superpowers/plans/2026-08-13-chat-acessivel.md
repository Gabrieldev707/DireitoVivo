# Chat acessível — Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrar preferências de acessibilidade, conversa guiada, leitura controlável, apresentação facilitada e entrada opcional por voz ao chat existente sem armazenar conteúdo pessoal.

**Architecture:** Um provedor React compartilha preferências globais e específicas da conversa. APIs de síntese e reconhecimento de voz ficam atrás de adaptadores testáveis; o chat continua usando o contrato HTTP atual e sempre oferece texto livre como alternativa.

**Tech Stack:** React 19, TypeScript 5.6, Web Speech API como melhoria progressiva, CSS, Vite 6, Vitest 4, Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-13-chat-acessivel-confianca-institucional.md`

**Prerequisite:** concluir `docs/superpowers/plans/2026-08-13-central-confianca-marca-rodape.md` para que marca, rotas e links de confiança estejam disponíveis.

## Global Constraints

- Não alterar API, RAG, banco, prompt ou contrato HTTP.
- Não armazenar mensagens, áudio ou transcrições em `localStorage`/`sessionStorage`.
- Entrada por voz nunca envia automaticamente e exige confirmação explícita.
- Voz é opcional; texto livre e respostas guiadas permanecem disponíveis.
- Modo guiado nunca promete número fixo de perguntas nem resultado.
- Apresentação facilitada usa somente campos estruturados já recebidos.
- Nenhum conteúdo crítico depende exclusivamente de áudio, cor ou animação.
- Alvos interativos têm no mínimo 44 × 44 CSS px.
- Testes automáticos não autorizam alegação de conformidade WCAG/eMAG.
- Cada tarefa segue teste vermelho, implementação mínima, teste verde e commit próprio.

---

## File Structure

```text
frontend/src/
  acessibilidade/
    preferencias.ts                   # tipos, chave, parse e aplicação no HTML
    PreferenciasProvider.tsx          # contexto compartilhado
    sinteseVoz.ts                     # controlador de SpeechSynthesis
    reconhecimentoVoz.ts              # adaptador opcional de SpeechRecognition
  componentes/
    conversa/
      AcessibilidadeConversa.tsx      # painel de preferências do chat
      ConfirmacaoEnvio.tsx            # revisão de texto/transcrição
      EntradaVoz.tsx                  # estados do microfone
      ProgressoConversa.tsx           # Entender/Organizar/Onde confirmar
      RespostasGuiadas.tsx            # Sim/Não/Não sei/texto livre
      Conversa.tsx
      Compositor.tsx
      Mensagem.tsx
    resultado/
      LeituraFacilitada.tsx            # resumo, pendências e próximo passo
  estilos/
    conversa.css
    componentes.css
frontend/tests/
  PreferenciasAcessibilidade.test.tsx
  ChatAcessivel.test.tsx
  Voz.test.tsx
  Resultado.test.tsx
```

## Task 1: Estado compartilhado de preferências

**Files:**
- Create: `frontend/src/acessibilidade/preferencias.ts`
- Create: `frontend/src/acessibilidade/PreferenciasProvider.tsx`
- Create: `frontend/tests/PreferenciasAcessibilidade.test.tsx`
- Modify: `frontend/src/componentes/layout/PainelAcessibilidade.tsx`
- Modify: `frontend/src/main.tsx`
- Modify: `frontend/tests/Acessibilidade.test.tsx`

**Interfaces:**
- Produces: `TamanhoTexto = 'normal' | 'grande' | 'maior'`.
- Produces: `VelocidadeLeitura = 'lenta' | 'normal' | 'rapida'`.
- Produces: `PreferenciasAcessibilidade` com campos globais e de conversa.
- Produces: `usePreferenciasAcessibilidade()`.

- [ ] **Step 1: Escrever testes vermelhos do provedor**

```tsx
function LeitorPreferencias() {
  const { preferencias, atualizar, restaurar } = usePreferenciasAcessibilidade();
  return <>
    <output>{JSON.stringify(preferencias)}</output>
    <button onClick={() => atualizar({ modoGuiado: true })}>Guiar</button>
    <button onClick={restaurar}>Restaurar</button>
  </>;
}

it('persiste somente preferências, nunca conteúdo da conversa', async () => {
  const user = userEvent.setup();
  render(<PreferenciasProvider><LeitorPreferencias /></PreferenciasProvider>);
  await user.click(screen.getByRole('button', { name: 'Guiar' }));
  const salvo = window.localStorage.getItem('direito-vivo-acessibilidade') ?? '';
  expect(salvo).toContain('"modoGuiado":true');
  expect(salvo).not.toMatch(/mensagens|transcricao|conteudo/);
});
```

- [ ] **Step 2: Confirmar falha**

Run: `npm run test -w frontend -- PreferenciasAcessibilidade.test.tsx Acessibilidade.test.tsx`

Expected: FAIL porque contexto e tipos não existem.

- [ ] **Step 3: Implementar tipos, parse e aplicação**

```ts
export interface PreferenciasAcessibilidade {
  tamanho: TamanhoTexto;
  contraste: boolean;
  links: boolean;
  movimento: boolean;
  modoGuiado: boolean;
  leituraAutomatica: boolean;
  velocidadeLeitura: VelocidadeLeitura;
  botoesMaiores: boolean;
  confirmarEnvio: boolean;
}

export const PREFERENCIAS_PADRAO: PreferenciasAcessibilidade = {
  tamanho: 'normal', contraste: false, links: false, movimento: false,
  modoGuiado: false, leituraAutomatica: false, velocidadeLeitura: 'normal',
  botoesMaiores: false, confirmarEnvio: false,
};
```

`carregarPreferencias` deve validar enumerações e booleanos, ignorar propriedades desconhecidas e retornar padrão quando JSON for inválido. `aplicarPreferencias` controla classes/datasets do elemento `html`, incluindo `botoes-chat-maiores`.

- [ ] **Step 4: Criar provider e migrar painel existente**

O contexto expõe:

```ts
interface ContextoPreferencias {
  preferencias: PreferenciasAcessibilidade;
  atualizar: (parcial: Partial<PreferenciasAcessibilidade>) => void;
  restaurar: () => void;
}
```

O componente aceita `preferenciasIniciais?: Partial<PreferenciasAcessibilidade>` exclusivamente para inicialização determinística e testes; em produção, quando a prop não é fornecida, usa `carregarPreferencias()`.

Envolver `<App />` no provider em `main.tsx`. Remover estado/localStorage duplicado de `PainelAcessibilidade`; manter sua interface visual e testes atuais.

- [ ] **Step 5: Testar migração e tipo**

Run: `npm run test -w frontend -- PreferenciasAcessibilidade.test.tsx Acessibilidade.test.tsx && npm run typecheck -w frontend`

Expected: PASS, inclusive restauração e JSON inválido.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/acessibilidade/preferencias.ts frontend/src/acessibilidade/PreferenciasProvider.tsx frontend/src/componentes/layout/PainelAcessibilidade.tsx frontend/src/main.tsx frontend/tests/PreferenciasAcessibilidade.test.tsx frontend/tests/Acessibilidade.test.tsx
git commit -m "feat(frontend): compartilhar preferencias de acessibilidade"
```

## Task 2: Painel do chat, progresso e respostas guiadas

**Files:**
- Create: `frontend/src/componentes/conversa/AcessibilidadeConversa.tsx`
- Create: `frontend/src/componentes/conversa/ProgressoConversa.tsx`
- Create: `frontend/src/componentes/conversa/RespostasGuiadas.tsx`
- Create: `frontend/tests/ChatAcessivel.test.tsx`
- Modify: `frontend/src/componentes/conversa/Conversa.tsx`
- Modify: `frontend/src/componentes/conversa/ContextoConversa.tsx`
- Modify: `frontend/src/componentes/conversa/Compositor.tsx`
- Modify: `frontend/src/estilos/conversa.css`
- Modify: `frontend/src/estilos/componentes.css`

**Interfaces:**
- Produces: `AcessibilidadeConversa()` consumindo o contexto da Task 1.
- Produces: `ProgressoConversa({ etapa }: { etapa: 'entender' | 'organizar' | 'confirmar' })`.
- Produces: `RespostasGuiadas({ pergunta, desabilitado, aoEscolher, aoExplicar })`.
- Consumes: `aoEnviar(texto: string): void` existente.

- [ ] **Step 1: Escrever contratos vermelhos do modo guiado**

```tsx
it('oferece respostas guiadas e mantém texto livre', async () => {
  const user = userEvent.setup();
  render(<PreferenciasProvider preferenciasIniciais={{ modoGuiado: true }}>
    <Conversa mensagens={mensagens} enviando={false} aoEnviar={vi.fn()} />
  </PreferenciasProvider>);
  expect(screen.getByRole('button', { name: 'Sim' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Não' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Não sei' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Quero explicar com minhas palavras' }));
  expect(screen.getByRole('textbox', { name: 'Escreva sua resposta' })).toHaveFocus();
});

it('não apresenta progresso como percentual', () => {
  render(<ProgressoConversa etapa="organizar" />);
  expect(screen.getByText('Organizar')).toHaveAttribute('aria-current', 'step');
  expect(document.body).not.toHaveTextContent(/%|perguntas restantes/i);
});
```

- [ ] **Step 2: Confirmar falha**

Run: `npm run test -w frontend -- ChatAcessivel.test.tsx`

Expected: FAIL pela ausência dos componentes.

- [ ] **Step 3: Implementar painel específico do chat**

Adicionar no cabeçalho interno o botão `Acessibilidade da conversa`. O diálogo controla `modoGuiado`, `leituraAutomatica`, `velocidadeLeitura`, `botoesMaiores` e `confirmarEnvio`, e contém link `#acessibilidade` e botão para abrir os ajustes gerais. Usar foco inicial, Escape e retorno de foco ao acionador.

- [ ] **Step 4: Implementar progresso não determinístico**

Calcular em `Conversa`:

```ts
const respostasDoUsuario = mensagens.filter((m) => m.papel === 'usuario').length;
const etapa = respostasDoUsuario === 0 ? 'entender' : 'organizar';
```

`confirmar` aparece no resultado, não como promessa dentro do chat. No desktop, o progresso substitui a jornada estática do aside; no mobile, aparece recolhido no guia.

- [ ] **Step 5: Implementar respostas guiadas**

Exibir `Sim`, `Não`, `Não sei` e `Quero explicar com minhas palavras` somente quando a última mensagem for do assistente, o modo estiver ativo e não houver requisição. Os três primeiros chamam o mesmo fluxo do compositor. O quarto apenas foca o textarea. Não tentar classificar semanticamente a pergunta nesta etapa.

Consumir e apagar `sessionStorage['direito-vivo-iniciar-guiado']` ao abrir o chat pela página de acessibilidade, salvando apenas a preferência booleana depois disso.

- [ ] **Step 6: Testar chat e responsividade estrutural**

Run: `npm run test -w frontend -- ChatAcessivel.test.tsx Conversa.test.tsx Responsividade.test.tsx`

Expected: PASS; somente `.dv-messages` permanece como área rolável.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/componentes/conversa/AcessibilidadeConversa.tsx frontend/src/componentes/conversa/ProgressoConversa.tsx frontend/src/componentes/conversa/RespostasGuiadas.tsx frontend/src/componentes/conversa/Conversa.tsx frontend/src/componentes/conversa/ContextoConversa.tsx frontend/src/componentes/conversa/Compositor.tsx frontend/src/estilos/conversa.css frontend/src/estilos/componentes.css frontend/tests/ChatAcessivel.test.tsx
git commit -m "feat(frontend): adicionar conversa guiada acessivel"
```

## Task 3: Confirmação antes de enviar

**Files:**
- Create: `frontend/src/componentes/conversa/ConfirmacaoEnvio.tsx`
- Modify: `frontend/src/componentes/conversa/Compositor.tsx`
- Modify: `frontend/src/estilos/conversa.css`
- Modify: `frontend/tests/ChatAcessivel.test.tsx`

**Interfaces:**
- Produces: `ConfirmacaoEnvio({ texto, origem, aoConfirmar, aoEditar, aoCancelar })`.
- Modifies: `Compositor` recebe `confirmarEnvio?: boolean` e `origemPendente?: 'texto' | 'voz'` internamente.

- [ ] **Step 1: Adicionar testes vermelhos de confirmação**

```tsx
it('revisa texto antes de enviar quando a preferência está ativa', async () => {
  const user = userEvent.setup();
  const aoEnviar = vi.fn();
  renderChat({ confirmarEnvio: true, aoEnviar });
  await user.type(screen.getByRole('textbox'), 'Minha renda caiu');
  await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));
  expect(aoEnviar).not.toHaveBeenCalled();
  expect(screen.getByRole('dialog', { name: 'Confirmar mensagem' })).toHaveTextContent('Minha renda caiu');
  await user.click(screen.getByRole('button', { name: 'Confirmar envio' }));
  expect(aoEnviar).toHaveBeenCalledWith('Minha renda caiu');
});
```

- [ ] **Step 2: Confirmar falha**

Run: `npm run test -w frontend -- ChatAcessivel.test.tsx`

Expected: FAIL porque o envio ainda é imediato.

- [ ] **Step 3: Implementar diálogo e fluxo**

`ConfirmacaoEnvio` mostra o texto, origem `Digitado` ou `Transcrito por voz` e três ações: `Confirmar envio`, `Editar` e `Cancelar`. Confirmar chama `aoEnviar`; Editar fecha e devolve foco ao textarea sem perder o texto; Cancelar limpa apenas a pendência, preservando o texto para decisão do usuário.

O compositor usa confirmação quando a preferência estiver ativa; Enter abre a confirmação em vez de contorná-la.

- [ ] **Step 4: Testar teclado e foco**

Acrescentar teste de Escape, retorno ao textarea e Shift+Enter. Run: `npm run test -w frontend -- ChatAcessivel.test.tsx Conversa.test.tsx`.

Expected: PASS sem alterar envio padrão quando `confirmarEnvio=false`.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/componentes/conversa/ConfirmacaoEnvio.tsx frontend/src/componentes/conversa/Compositor.tsx frontend/src/estilos/conversa.css frontend/tests/ChatAcessivel.test.tsx frontend/tests/Conversa.test.tsx
git commit -m "feat(frontend): confirmar mensagens antes do envio"
```

## Task 4: Síntese de voz controlável

**Files:**
- Create: `frontend/src/acessibilidade/sinteseVoz.ts`
- Create: `frontend/tests/Voz.test.tsx`
- Modify: `frontend/src/componentes/conversa/Mensagem.tsx`
- Modify: `frontend/src/componentes/conversa/Conversa.tsx`
- Modify: `frontend/src/estilos/conversa.css`

**Interfaces:**
- Produces: singleton `controladorSintese` com `disponivel`, `ouvir`, `pausarOuContinuar`, `parar`.
- Consumes: `VelocidadeLeitura` e preferência `leituraAutomatica`.
- Modifies: `Mensagem` recebe `leituraAutomatica?: boolean` e `velocidade?: VelocidadeLeitura`.

- [ ] **Step 1: Escrever testes vermelhos do controlador**

```tsx
it('cancela a fala anterior antes de iniciar outra', async () => {
  render(<Mensagem mensagem={{ papel: 'assistente', conteudo: 'Primeira orientação' }} />);
  await userEvent.click(screen.getByRole('button', { name: 'Ouvir mensagem' }));
  expect(window.speechSynthesis.cancel).toHaveBeenCalledBefore(window.speechSynthesis.speak as Mock);
});

it('não mostra controles sem síntese disponível', () => {
  vi.stubGlobal('speechSynthesis', undefined);
  render(<Mensagem mensagem={{ papel: 'assistente', conteudo: 'Texto' }} />);
  expect(screen.queryByRole('button', { name: /ouvir/i })).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Confirmar falha**

Run: `npm run test -w frontend -- Voz.test.tsx`

Expected: FAIL nos novos estados e no isolamento.

- [ ] **Step 3: Implementar controlador de síntese**

Mapear velocidades `lenta=0.8`, `normal=1`, `rapida=1.25`. A fala usa `pt-BR`, cancela a anterior e expõe callbacks de estado. `pausarOuContinuar` consulta `speechSynthesis.paused`; `parar` sempre cancela.

- [ ] **Step 4: Integrar mensagem e leitura automática somente para conteúdo novo**

Em `Conversa`, guardar o tamanho anterior em `useRef`. Marcar como nova apenas a última mensagem do assistente quando `mensagens.length` aumentar. Não ler a mensagem de abertura ao montar. Em troca de rota ou desmontagem, chamar `parar()`.

Os botões exibem `Ouvir`, `Pausar/Continuar` quando suportado e `Parar`, com `aria-pressed`/status adequados. A mensagem textual nunca é escondida.

- [ ] **Step 5: Testar estados e regressões**

Run: `npm run test -w frontend -- Voz.test.tsx Conversa.test.tsx ChatAcessivel.test.tsx`

Expected: PASS; leitura automática ocorre uma vez apenas para nova resposta.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/acessibilidade/sinteseVoz.ts frontend/src/componentes/conversa/Mensagem.tsx frontend/src/componentes/conversa/Conversa.tsx frontend/src/estilos/conversa.css frontend/tests/Voz.test.tsx
git commit -m "feat(frontend): controlar leitura das respostas"
```

## Task 5: Entrada opcional por voz com revisão obrigatória

**Files:**
- Create: `frontend/src/acessibilidade/reconhecimentoVoz.ts`
- Create: `frontend/src/componentes/conversa/EntradaVoz.tsx`
- Modify: `frontend/src/componentes/conversa/Compositor.tsx`
- Modify: `frontend/src/estilos/conversa.css`
- Modify: `frontend/tests/Voz.test.tsx`
- Modify: `frontend/tests/setup.ts`

**Interfaces:**
- Produces: `criarReconhecedorVoz(): ReconhecedorVoz | undefined`.
- Produces: `ReconhecedorVoz.iniciar(callbacks): void` e `cancelar(): void`.
- Produces: estados `ocioso | explicacao | ouvindo | revisao | erro`.
- Consumes: `ConfirmacaoEnvio` da Task 3; voz sempre força confirmação.

- [ ] **Step 1: Escrever testes vermelhos do fluxo de voz**

```tsx
it('explica o processamento antes da primeira escuta', async () => {
  instalarReconhecimentoFake();
  renderChat();
  await userEvent.click(screen.getByRole('button', { name: 'Falar em vez de digitar' }));
  expect(screen.getByRole('dialog', { name: 'Usar entrada por voz' })).toHaveTextContent(/serviço externo do navegador/i);
});

it('coloca a transcrição em revisão e nunca envia automaticamente', async () => {
  const { emitirResultado, aoEnviar } = renderChatComVoz();
  await habilitarEIniciarVoz();
  emitirResultado('preciso de remédios');
  expect(aoEnviar).not.toHaveBeenCalled();
  expect(screen.getByRole('dialog', { name: 'Confirmar mensagem' })).toHaveTextContent('preciso de remédios');
});
```

- [ ] **Step 2: Confirmar falha**

Run: `npm run test -w frontend -- Voz.test.tsx`

Expected: FAIL porque entrada de voz não existe.

- [ ] **Step 3: Implementar adaptador compatível**

Detectar `window.SpeechRecognition` ou `window.webkitSpeechRecognition` sem adicionar dependência. Configurar `lang='pt-BR'`, `interimResults=false`, `maxAlternatives=1`, `continuous=false`. Traduzir erros: `not-allowed`, `no-speech`, `audio-capture`, `network` e fallback genérico. Não acessar nem criar `MediaRecorder`, Blob ou upload.

- [ ] **Step 4: Implementar explicação, escuta e cancelamento**

No primeiro uso por aba, mostrar diálogo com `Continuar`, `Agora não` e link `#privacidade`. Depois de `Continuar`, iniciar reconhecimento. Exibir estado visual e textual `Ouvindo…`, botão `Cancelar escuta` e região `status`. Resultado preenche o compositor e abre `ConfirmacaoEnvio` com origem `voz`. Cancelamento descarta a transcrição parcial.

- [ ] **Step 5: Testar indisponibilidade e erros**

Adicionar casos: API ausente esconde botão; permissão negada mostra explicação textual; `no-speech` permite tentar novamente; cancelamento não chama `aoEnviar`; transcrição nunca entra em `localStorage`.

Run: `npm run test -w frontend -- Voz.test.tsx PreferenciasAcessibilidade.test.tsx Conversa.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/acessibilidade/reconhecimentoVoz.ts frontend/src/componentes/conversa/EntradaVoz.tsx frontend/src/componentes/conversa/Compositor.tsx frontend/src/estilos/conversa.css frontend/tests/Voz.test.tsx frontend/tests/setup.ts
git commit -m "feat(frontend): adicionar entrada opcional por voz"
```

## Task 6: Leitura facilitada de resultados estruturados

**Files:**
- Create: `frontend/src/componentes/resultado/LeituraFacilitada.tsx`
- Modify: `frontend/src/componentes/resultado/Resultado.tsx`
- Modify: `frontend/src/componentes/resultado/Urgencia.tsx`
- Modify: `frontend/src/estilos/paginas.css`
- Modify: `frontend/tests/Resultado.test.tsx`

**Interfaces:**
- Produces: `LeituraFacilitada({ resumo, confirmar, proximoPasso, aoVerCompleto })`.
- Consumes: campos existentes de `RespostaTriagem`; não recebe texto novo da IA.

- [ ] **Step 1: Escrever teste vermelho da apresentação facilitada**

```tsx
it('organiza resultado existente sem esconder a versão completa', async () => {
  render(<Resultado resposta={orientacao} aoRecomecar={vi.fn()} aoVerDireitos={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: 'Ver em passos' }));
  expect(screen.getByRole('heading', { name: 'Resumo' })).toBeVisible();
  expect(screen.getByRole('heading', { name: 'O que confirmar' })).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Próximo passo' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Ver informações completas' })).toBeVisible();
});
```

- [ ] **Step 2: Confirmar falha**

Run: `npm run test -w frontend -- Resultado.test.tsx`

Expected: FAIL pela ausência do controle.

- [ ] **Step 3: Implementar transformação puramente estrutural**

Para orientação: `resumo` vem de `resposta.resumo`; `confirmar` concatena `criterios_pendentes`; `proximoPasso` usa o primeiro `proximos_passos` e canal. Para `sem_match`: usar mensagem e primeiros próximos passos. Para urgência: manter todos os números e quando usar, sem colapsar canais.

O toggle não modifica dados, não chama API e não remove acesso ao conteúdo completo.

- [ ] **Step 4: Testar e commitar**

Run: `npm run test -w frontend -- Resultado.test.tsx && npm run typecheck -w frontend`

Expected: PASS.

```bash
git add frontend/src/componentes/resultado/LeituraFacilitada.tsx frontend/src/componentes/resultado/Resultado.tsx frontend/src/componentes/resultado/Urgencia.tsx frontend/src/estilos/paginas.css frontend/tests/Resultado.test.tsx
git commit -m "feat(frontend): adicionar leitura facilitada do resultado"
```

## Task 7: Semântica, foco, validação manual e documentação

**Files:**
- Modify: `frontend/src/componentes/conversa/Conversa.tsx`
- Modify: `frontend/src/componentes/conversa/AcessibilidadeConversa.tsx`
- Modify: `frontend/src/componentes/conversa/ConfirmacaoEnvio.tsx`
- Modify: `frontend/src/estilos/conversa.css`
- Modify: `frontend/tests/ChatAcessivel.test.tsx`
- Modify: `frontend/tests/Responsividade.test.tsx`
- Modify: `README.md`
- Modify: `frontend/README.md`

**Interfaces:**
- Consumes: todos os componentes do plano.
- Produces: evidência automática e checklist manual sem afirmação indevida de conformidade.

- [ ] **Step 1: Escrever testes vermelhos de semântica e foco**

```tsx
it('marca o histórico como log e o carregamento como status', () => {
  renderChat({ enviando: true });
  expect(screen.getByRole('log', { name: 'Histórico da conversa' })).toHaveAttribute('aria-live', 'polite');
  expect(screen.getByRole('status')).toHaveTextContent(/organizando uma resposta/i);
});

it('devolve foco ao acionador ao fechar acessibilidade da conversa', async () => {
  const botao = abrirPainelDaConversa();
  await userEvent.keyboard('{Escape}');
  expect(botao).toHaveFocus();
});
```

- [ ] **Step 2: Implementar semântica mínima**

Usar `role="log" aria-live="polite" aria-relevant="additions text" aria-busy={enviando}` no histórico. Digitação usa `role="status"`; erro recuperável usa `role="alert"`. Não colocar `aria-live` em cada bolha. Diálogos usam título associado, foco inicial, Escape e restauração do foco.

- [ ] **Step 3: Executar suíte completa e gates**

Run: `npm test`

Expected: banco, RAG, API e frontend com 0 falhas.

Run: `npm run typecheck && npm run build && npm audit --omit=dev`

Expected: código 0 e 0 vulnerabilidades de produção.

- [ ] **Step 4: Verificar visualmente em navegador**

Inspecionar 360×800, 390×844, 768×1024 e 1440×950 com: modo guiado, texto 125%, botões maiores, confirmação, leitura e voz fake/real compatível. Confirmar largura do documento igual à largura do viewport, compositor totalmente visível e apenas histórico rolável.

- [ ] **Step 5: Validar somente com teclado**

Percurso: abrir `#conversa`, aceitar consentimento, abrir/fechar painel, ativar modo guiado, escolher `Não sei`, editar confirmação, enviar, alcançar erro/retry e limpar conversa. Confirmar foco visível e ausência de armadilha.

- [ ] **Step 6: Validar NVDA no Windows**

Com NVDA real, verificar landmarks, nome do chat, anúncio de nova resposta sem repetição do histórico, estados de voz, confirmação, erro e resultado. Registrar cada passo como `PASS`, `FAIL` ou `NÃO EXECUTADO`; não converter ausência de hardware/software em PASS.

- [ ] **Step 7: Atualizar documentação com resultados reais**

Documentar recursos, compatibilidade variável da voz, ausência de armazenamento e validações executadas. Atualizar contagem de testes a partir da saída fresca. Listar VoiceOver/TalkBack como pendentes se não testados em dispositivo real.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/componentes/conversa frontend/src/estilos/conversa.css frontend/tests/ChatAcessivel.test.tsx frontend/tests/Responsividade.test.tsx README.md frontend/README.md
git commit -m "test(frontend): validar experiencia de chat acessivel"
```

- [ ] **Step 9: Verificar árvore e histórico**

Run: `git diff --check && git status --short && git log -10 --oneline`

Expected: diff sem espaços inválidos, árvore limpa e commits do plano em ordem.
