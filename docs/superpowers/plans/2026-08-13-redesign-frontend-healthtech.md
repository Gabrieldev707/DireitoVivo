# Redesign Healthtech do Frontend — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir todo o frontend do Direito Vivo como uma experiência healthtech responsiva, acessível e brasileira, com 12 situações de entrada, catálogo verificável, conversa mobile-first e resultado acionável.

**Architecture:** `App.tsx` permanece como orquestrador do fluxo, mas apresentação e dados serão separados por domínio em `layout`, `inicio`, `situacoes`, `direitos`, `conversa`, `resultado` e `compartilhados`. A navegação continuará baseada em hash por compatibilidade, enquanto estilos serão divididos em tokens, base, componentes, páginas e conversa; API, RAG, Supabase e contratos HTTP não serão alterados.

**Tech Stack:** React 19, TypeScript 5, Vite 6, CSS responsivo, Vitest, Testing Library, `@fontsource-variable/manrope` e `@fontsource/ibm-plex-mono` empacotados localmente.

**Spec:** `docs/superpowers/specs/2026-08-13-redesign-frontend-healthtech.md`

## Global Constraints

- Alterar somente `frontend/` e documentação associada; não mudar API, RAG, banco, prompts, embeddings ou proteções.
- Exibir somente os 7 itens com `status_conteudo: "publicavel"` presentes em `frontend/src/dados/catalogoDireitos.ts`.
- Implementar exatamente 12 situações; nenhuma pode prometer benefício que não esteja no catálogo publicável.
- Preservar consentimento obrigatório, mascaramento informado, rate limit da API e ausência de persistência da conversa.
- Usar português brasileiro natural e rotas reais como CRAS, SUS, INSS, CAPS e Defensoria.
- Não usar bandeira, mapa, globo, brasão, verde-amarelo ornamental ou aparência de portal governamental.
- Não copiar marca, textos ou componentes da K Health, NHS ou gov.br.
- Não gerar ou adicionar imagens rasterizadas; toda expressão visual será tipografia, CSS e SVG próprio.
- Atender WCAG AA, foco visível, `prefers-reduced-motion`, alvos de toque de 44px e zoom de texto de 200%.
- Validar os breakpoints 360, 390, 768, 1024 e 1440px.
- Cada tarefa começa por um teste que falha pelo comportamento ausente e termina com testes e tipagem verdes.
- Não atualizar a Preview pública antes de todos os gates locais passarem.

---

## Estrutura de arquivos final

```text
frontend/src/
  App.tsx                         # estado e transições do fluxo
  api.ts                         # cliente HTTP existente
  main.tsx                       # fontes locais e folhas de estilo
  tipos.ts                       # contratos compartilhados existentes
  componentes/
    layout/
      Cabecalho.tsx              # navegação desktop/mobile e acessibilidade
      Marca.tsx                  # wordmark e sinal de percurso
      Rodape.tsx                 # limites, fontes e links internos
    inicio/
      Inicio.tsx                 # composição da página inicial
      DemonstracaoRota.tsx       # visual conte → confirme → procure
    situacoes/
      Situacoes.tsx              # página, filtros e contagem
      CartaoSituacao.tsx         # entrada individual
      FiltrosSituacoes.tsx       # seleção de categoria
    direitos/
      Direitos.tsx               # busca, filtros e estados
      CartaoDireito.tsx          # resumo e CTA
      DetalhesDireito.tsx        # critérios, passos, fontes e revisão
    conversa/
      Conversa.tsx               # shell responsivo
      ContextoConversa.tsx       # privacidade e progresso no desktop
      Mensagem.tsx               # mensagem e leitura em voz alta
      Compositor.tsx             # textarea, sugestões e reenvio
    resultado/
      Resultado.tsx              # rota de ação
      Urgencia.tsx               # canais prioritários
    compartilhados/
      Icone.tsx                  # ícones SVG próprios
      Selo.tsx                   # status sem depender de cor
      EstadoVazio.tsx            # orientação quando não há conteúdo
  dados/
    catalogoDireitos.ts          # 7 itens existentes
    situacoes.ts                 # 12 situações tipadas
  estilos/
    tokens.css                   # cores, tipografia, espaçamento e sombras
    base.css                     # reset, body, foco e acessibilidade
    componentes.css              # botões, cards, chips e formulários
    paginas.css                  # home, situações, catálogo e resultado
    conversa.css                 # shell, mensagens e mobile 100dvh
frontend/tests/
  Navegacao.test.tsx
  Inicio.test.tsx
  Situacoes.test.tsx
  Direitos.test.tsx
  Conversa.test.tsx
  Resultado.test.tsx
  Responsividade.test.tsx
```

Arquivos antigos serão removidos somente quando o substituto estiver testado: `GovHeader.tsx`, `GovFooter.tsx`, `MarcaDireitoVivo.tsx`, `TelaInicial.tsx`, `CenariosVida.tsx`, `Portifolio.tsx`, `Chat.tsx`, `LinhaDaVida.tsx`, `PainelUrgencia.tsx`, `FichaItem.tsx` e `estilos.css`.

---

### Tarefa 1: Contratos de navegação e dados das situações

**Files:**
- Create: `frontend/src/dados/situacoes.ts`
- Create: `frontend/tests/Situacoes.test.tsx`
- Create: `frontend/tests/Navegacao.test.tsx`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/tipos.ts`

**Interfaces:**
- Produces: `CategoriaSituacao`, `PrioridadeSituacao`, `Situacao`, `CATEGORIAS_SITUACAO`, `SITUACOES`, `TOTAL_SITUACOES`.
- Produces: `AbaNavegacao = 'inicio' | 'direitos' | 'situacoes' | 'conversa' | 'resultado'`.
- Compatibility: `#catalogo → direitos`, `#cenarios → situacoes`, `#chat → conversa`.

- [ ] **Step 1: Escrever o teste vermelho para os 12 dados reais**

```tsx
import { describe, expect, it } from 'vitest';
import { SITUACOES } from '../src/dados/situacoes';

describe('situações orientadas', () => {
  it('oferece exatamente 12 entradas com ids e mensagens únicas', () => {
    expect(SITUACOES).toHaveLength(12);
    expect(new Set(SITUACOES.map((item) => item.id)).size).toBe(12);
    expect(new Set(SITUACOES.map((item) => item.mensagemInicial)).size).toBe(12);
  });

  it('limita referências aos sete direitos publicáveis', () => {
    const idsPermitidos = new Set([
      'bolsa-familia', 'bpc-loas-idoso', 'bpc-loas-pcd', 'seguro-desemprego',
      'auxilio-incapacidade-temporaria', 'farmacia-popular', 'caps',
    ]);
    for (const situacao of SITUACOES) {
      expect(situacao.direitosIds.every((id) => idsPermitidos.has(id))).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Executar o teste e confirmar a falha correta**

Run: `npm run test -w frontend -- Situacoes.test.tsx`

Expected: FAIL porque `../src/dados/situacoes` não existe.

- [ ] **Step 3: Criar tipos e os 12 objetos de situação**

```ts
export type CategoriaSituacao = 'renda_trabalho' | 'cuidado_deficiencia' | 'saude' | 'urgencia' | 'orientacao_geral';
export type PrioridadeSituacao = 'orientacao' | 'alta' | 'imediata';

export interface Situacao {
  id: string;
  titulo: string;
  resumo: string;
  categoria: CategoriaSituacao;
  prioridade: PrioridadeSituacao;
  direitosIds: string[];
  canais: string[];
  mensagemInicial: string;
}

export const CATEGORIAS_SITUACAO = [
  { id: 'todas', rotulo: 'Todas' },
  { id: 'renda_trabalho', rotulo: 'Renda e trabalho' },
  { id: 'cuidado_deficiencia', rotulo: 'Cuidado e deficiência' },
  { id: 'saude', rotulo: 'Saúde' },
  { id: 'urgencia', rotulo: 'Urgência' },
  { id: 'orientacao_geral', rotulo: 'Orientação geral' },
] as const;
```

Implementar esta matriz literal; `mensagemInicial` deve ser uma frase natural e única baseada no título, sem dados pessoais:

| id | título | categoria | prioridade | direitosIds | canais |
|---|---|---|---|---|---|
| `perdi-emprego` | Perdi o emprego com carteira assinada | `renda_trabalho` | `alta` | `seguro-desemprego` | Carteira de Trabalho Digital, SINE |
| `renda-caiu` | Minha renda caiu e a casa precisa de apoio | `renda_trabalho` | `alta` | `bolsa-familia` | CRAS, CadÚnico |
| `idoso-pouca-renda` | Tenho 65 anos ou mais e pouca renda | `cuidado_deficiencia` | `orientacao` | `bpc-loas-idoso` | CRAS, INSS |
| `pessoa-com-deficiencia` | Sou PCD ou cuido de uma pessoa com deficiência | `cuidado_deficiencia` | `orientacao` | `bpc-loas-pcd` | CRAS, INSS |
| `crianca-deficiencia-autismo` | Uma criança da família tem deficiência ou autismo | `cuidado_deficiencia` | `orientacao` | `bpc-loas-pcd` | CRAS, INSS |
| `doente-sem-trabalhar` | Estou doente e não consigo trabalhar | `saude` | `alta` | `auxilio-incapacidade-temporaria` | UBS, INSS |
| `acidente-afastamento` | Sofri acidente e preciso me afastar | `saude` | `alta` | `auxilio-incapacidade-temporaria` | SUS, INSS |
| `medicamentos` | Preciso de remédios de uso contínuo | `saude` | `orientacao` | `farmacia-popular` | UBS, Farmácia Popular |
| `sofrimento-emocional` | Estou em sofrimento emocional ou crise de saúde mental | `saude` | `alta` | `caps` | CAPS, UBS, SAMU 192 |
| `alcool-outras-drogas` | Preciso de ajuda com álcool ou outras drogas | `saude` | `alta` | `caps` | CAPS AD, UBS |
| `violencia-risco` | Há violência, ameaça ou risco imediato | `urgencia` | `imediata` | nenhum | 190, 180, 100, Defensoria |
| `nao-sei-servico` | Não sei qual serviço procurar | `orientacao_geral` | `orientacao` | nenhum | CRAS, UBS, Defensoria |

- [ ] **Step 4: Escrever e executar o teste vermelho de compatibilidade dos hashes**

```tsx
it.each([
  ['#catalogo', 'Direitos'],
  ['#cenarios', 'Situações'],
  ['#chat', 'Conversar'],
])('mantém o link antigo %s', (hash, nomeDestino) => {
  window.location.hash = hash;
  render(<App />);
  expect(screen.getByRole('main')).toHaveAttribute('data-view', nomeDestino.toLowerCase());
});
```

Run: `npm run test -w frontend -- Navegacao.test.tsx`

Expected: FAIL porque `App` ainda usa os nomes antigos e não expõe `data-view`.

- [ ] **Step 5: Implementar o mapeamento de hash sem mudar o fluxo HTTP**

```ts
const HASH_PARA_ABA: Record<string, AbaNavegacao> = {
  inicio: 'inicio', direitos: 'direitos', catalogo: 'direitos',
  situacoes: 'situacoes', cenarios: 'situacoes',
  conversa: 'conversa', chat: 'conversa',
};
```

Atualizar somente nomes de abas e transições em `App.tsx`; manter `processarTriagem`, consentimento, `enviarTriagem` e estados de resultado.

- [ ] **Step 6: Executar testes e tipos**

Run: `npm run test -w frontend -- Situacoes.test.tsx Navegacao.test.tsx && npm run typecheck -w frontend`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/dados/situacoes.ts frontend/src/tipos.ts frontend/src/App.tsx frontend/tests/Situacoes.test.tsx frontend/tests/Navegacao.test.tsx
git commit -m "test(frontend): definir contratos da nova experiencia"
```

---

### Tarefa 2: Fundação visual, fontes e componentes compartilhados

**Files:**
- Create: `frontend/src/estilos/tokens.css`
- Create: `frontend/src/estilos/base.css`
- Create: `frontend/src/estilos/componentes.css`
- Create: `frontend/src/estilos/paginas.css`
- Create: `frontend/src/estilos/conversa.css`
- Create: `frontend/src/componentes/compartilhados/Icone.tsx`
- Create: `frontend/src/componentes/compartilhados/Selo.tsx`
- Create: `frontend/src/componentes/compartilhados/EstadoVazio.tsx`
- Create: `frontend/tests/Compartilhados.test.tsx`
- Modify: `frontend/src/main.tsx`
- Modify: `frontend/package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: CSS custom properties `--dv-*`, classes `.dv-button`, `.dv-card`, `.dv-chip`, `.dv-focus`.
- Produces: `Icone({ nome, tamanho? })`, `Selo({ tom, children })`, `EstadoVazio({ titulo, descricao, acao? })`.

- [ ] **Step 1: Escrever teste vermelho dos componentes acessíveis**

```tsx
it('expõe selo e estado vazio sem depender de ícone decorativo', () => {
  render(<EstadoVazio titulo="Nenhum direito encontrado" descricao="Tente outra busca." />);
  expect(screen.getByRole('heading', { name: 'Nenhum direito encontrado' })).toBeVisible();
  expect(screen.getByText('Tente outra busca.')).toBeVisible();
});
```

Run: `npm run test -w frontend -- Compartilhados.test.tsx`

Expected: FAIL porque os componentes não existem.

- [ ] **Step 2: Instalar as fontes locais**

Run: `npm install -w frontend @fontsource-variable/manrope @fontsource/ibm-plex-mono`

Expected: dependências adicionadas sem vulnerabilidade de severidade alta.

- [ ] **Step 3: Criar tokens com a paleta aprovada**

```css
:root {
  --dv-ink: #102a2e;
  --dv-care: #087a70;
  --dv-care-dark: #075b55;
  --dv-mint: #ddf4ea;
  --dv-clinical: #3568f0;
  --dv-signal: #f06f5f;
  --dv-canvas: #f7faf8;
  --dv-paper: #ffffff;
  --dv-radius-sm: .75rem;
  --dv-radius-md: 1.25rem;
  --dv-radius-lg: 2rem;
  --dv-shadow: 0 18px 60px rgb(16 42 46 / .10);
  --dv-content: 76rem;
}
```

Adicionar escala neutra, espaçamentos, duração de movimento e fontes. Em `base.css`, definir foco `3px solid var(--dv-clinical)`, `overflow-wrap: anywhere`, `prefers-reduced-motion` e classe `.sr-only`.

- [ ] **Step 4: Importar fontes e CSS no entrypoint**

```ts
import '@fontsource-variable/manrope';
import '@fontsource/ibm-plex-mono/500.css';
import './estilos/tokens.css';
import './estilos/base.css';
import './estilos/componentes.css';
import './estilos/paginas.css';
import './estilos/conversa.css';
```

Criar temporariamente `paginas.css` e `conversa.css` vazios com comentário de responsabilidade para manter o build verde até as tarefas seguintes.

- [ ] **Step 5: Implementar componentes compartilhados mínimos**

`Icone` deve aceitar apenas nomes tipados (`seta`, `escudo`, `busca`, `conversa`, `documento`, `saude`, `trabalho`, `cuidado`, `urgencia`, `fechar`, `menu`, `ouvir`, `enviar`, `limpar`) e retornar SVG com `aria-hidden="true"`. Controles que usam somente ícone devem receber `aria-label` no botão consumidor.

- [ ] **Step 6: Verificar testes, tipos e build**

Run: `npm run test -w frontend -- Compartilhados.test.tsx && npm run typecheck -w frontend && npm run build -w frontend`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/main.tsx frontend/src/estilos frontend/src/componentes/compartilhados frontend/tests/Compartilhados.test.tsx frontend/package.json package-lock.json
git commit -m "refactor(frontend): criar fundacao visual healthtech"
```

---

### Tarefa 3: Marca, cabeçalho, rodapé e navegação responsiva

**Files:**
- Create: `frontend/src/componentes/layout/Marca.tsx`
- Create: `frontend/src/componentes/layout/Cabecalho.tsx`
- Create: `frontend/src/componentes/layout/Rodape.tsx`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/estilos/componentes.css`
- Test: `frontend/tests/Navegacao.test.tsx`
- Delete after green: `frontend/src/componentes/GovHeader.tsx`
- Delete after green: `frontend/src/componentes/GovFooter.tsx`
- Delete after green: `frontend/src/componentes/MarcaDireitoVivo.tsx`

**Interfaces:**
- Consumes: `AbaNavegacao`, `Icone`.
- Produces: `Cabecalho({ abaAtiva, aoMudarAba })`, `Rodape({ aoMudarAba })`, `Marca({ compacta? })`.

- [ ] **Step 1: Ampliar teste vermelho da navegação**

```tsx
it('abre e fecha o menu móvel com nomes acessíveis', async () => {
  const user = userEvent.setup();
  render(<Cabecalho abaAtiva="inicio" aoMudarAba={vi.fn()} />);
  await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
  expect(screen.getByRole('navigation', { name: 'Principal' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Fechar menu' }));
  expect(screen.queryByRole('button', { name: 'Fechar menu' })).not.toBeInTheDocument();
});
```

Run: `npm run test -w frontend -- Navegacao.test.tsx`

Expected: FAIL porque `Cabecalho` não existe.

- [ ] **Step 2: Implementar wordmark e sinal de percurso**

`Marca` renderiza texto real `Direito Vivo`, selo textual `demonstração` quando não compacta e um SVG de três pontos conectados. Não renderizar `SimboloDireitoVivo`, globo, bandeira ou brasão.

- [ ] **Step 3: Implementar cabeçalho e menu**

Usar links/botões `Início`, `Situações`, `Direitos`, `Conversar`; CTA `Começar conversa`; aviso curto `Projeto independente`. Manter controles de fonte e alto contraste dentro do menu de acessibilidade, não em uma barra permanente.

- [ ] **Step 4: Implementar rodapé curto**

Incluir limites do serviço, `Sem cadastro`, `Não substitui atendimento oficial`, links internos e texto `Confirme regras no canal oficial`. Não listar contatos inventados nem simular rodapé governamental.

- [ ] **Step 5: Integrar no App e remover componentes antigos**

Substituir imports e JSX. O header deve receber `data-chat="true"` quando `abaAtiva === 'conversa'`, permitindo o CSS móvel esconder elementos não essenciais.

- [ ] **Step 6: Verificar e commit**

Run: `npm run test -w frontend -- Navegacao.test.tsx && npm run typecheck -w frontend && npm run build -w frontend`

```bash
git add frontend/src/App.tsx frontend/src/componentes/layout frontend/src/estilos/componentes.css frontend/tests/Navegacao.test.tsx
git add -u frontend/src/componentes/GovHeader.tsx frontend/src/componentes/GovFooter.tsx frontend/src/componentes/MarcaDireitoVivo.tsx
git commit -m "refactor(frontend): reconstruir marca e navegacao"
```

---

### Tarefa 4: Nova página inicial healthtech brasileira

**Files:**
- Create: `frontend/src/componentes/inicio/Inicio.tsx`
- Create: `frontend/src/componentes/inicio/DemonstracaoRota.tsx`
- Create: `frontend/tests/Inicio.test.tsx`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/estilos/paginas.css`
- Delete after green: `frontend/src/componentes/TelaInicial.tsx`
- Delete after green: `frontend/tests/TelaInicial.test.tsx`

**Interfaces:**
- Consumes: `SITUACOES`, `CATALOGO_DIREITOS`, `Icone`, `Selo`.
- Produces: `Inicio({ aoComecar, aoVerDireitos, aoVerSituacoes, aoEscolherSituacao })`.

- [ ] **Step 1: Escrever testes vermelhos da home enxuta**

```tsx
it('apresenta uma ação principal e seis situações prioritárias', () => {
  render(<Inicio aoComecar={vi.fn()} aoVerDireitos={vi.fn()} aoVerSituacoes={vi.fn()} aoEscolherSituacao={vi.fn()} />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Encontre o próximo passo');
  expect(screen.getByRole('button', { name: 'Contar minha situação' })).toBeVisible();
  expect(screen.getAllByTestId('situacao-destaque')).toHaveLength(6);
});

it('não renderiza imagens nem o símbolo antigo', () => {
  const { container } = render(<Inicio {...props} />);
  expect(container.querySelectorAll('img')).toHaveLength(0);
  expect(screen.queryByText(/serviço digital de cidadania/i)).not.toBeInTheDocument();
});
```

Run: `npm run test -w frontend -- Inicio.test.tsx`

Expected: FAIL porque `Inicio` não existe.

- [ ] **Step 2: Implementar hero e demonstração da rota**

Copy principal: `Você conta o momento. O Direito Vivo organiza o próximo passo.`; subtítulo deve explicar IA, direitos possíveis e canais oficiais em até duas frases. `DemonstracaoRota` usa três estágios: `Conte`, `Confirme`, `Procure` com exemplos `perdi renda`, `carteira assinada?`, `Carteira de Trabalho Digital`.

- [ ] **Step 3: Implementar confiança, seis situações e sete direitos**

Renderizar quatro selos de confiança, seis situações obtidas por ids explícitos e três direitos em amostra. Mostrar `7 conteúdos revisados` em vez de uma promessa genérica de catálogo amplo.

- [ ] **Step 4: Integrar e remover home antiga**

Atualizar callbacks para os novos nomes de aba. Não reaproveitar classes `home-hero`, `gov-panel`, `feature-card` ou imagens em `public/assets`.

- [ ] **Step 5: Verificar e commit**

Run: `npm run test -w frontend -- Inicio.test.tsx && npm run typecheck -w frontend && npm run build -w frontend`

```bash
git add frontend/src/App.tsx frontend/src/componentes/inicio frontend/src/estilos/paginas.css frontend/tests/Inicio.test.tsx
git add -u frontend/src/componentes/TelaInicial.tsx frontend/tests/TelaInicial.test.tsx
git commit -m "feat(frontend): reconstruir pagina inicial"
```

---

### Tarefa 5: Página de 12 situações filtráveis

**Files:**
- Create: `frontend/src/componentes/situacoes/Situacoes.tsx`
- Create: `frontend/src/componentes/situacoes/CartaoSituacao.tsx`
- Create: `frontend/src/componentes/situacoes/FiltrosSituacoes.tsx`
- Modify: `frontend/tests/Situacoes.test.tsx`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/estilos/paginas.css`
- Delete after green: `frontend/src/componentes/CenariosVida.tsx`

**Interfaces:**
- Consumes: `SITUACOES`, `CATEGORIAS_SITUACAO`, `Situacao`.
- Produces: `Situacoes({ aoEscolher })`, onde `aoEscolher(situacao: Situacao): void`.

- [ ] **Step 1: Escrever teste vermelho de filtro e seleção**

```tsx
it('filtra saúde e envia a situação selecionada', async () => {
  const user = userEvent.setup();
  const aoEscolher = vi.fn();
  render(<Situacoes aoEscolher={aoEscolher} />);
  expect(screen.getAllByTestId('cartao-situacao')).toHaveLength(12);
  await user.click(screen.getByRole('button', { name: 'Saúde' }));
  expect(screen.getByText('5 situações encontradas')).toBeVisible();
  await user.click(screen.getByRole('button', { name: /conversar sobre remédios/i }));
  expect(aoEscolher).toHaveBeenCalledWith(expect.objectContaining({ id: 'medicamentos' }));
});
```

- [ ] **Step 2: Executar e confirmar falha por componente ausente**

Run: `npm run test -w frontend -- Situacoes.test.tsx`

- [ ] **Step 3: Implementar filtros e cards**

Filtros são botões com `aria-pressed`. Card mostra prioridade por texto, resumo, canais, até dois direitos publicados e CTA específico `Conversar sobre {assunto}`. Situação imediata mostra canais antes do CTA.

- [ ] **Step 4: Integrar com consentimento e conversa**

Alterar `aoSelecionarCenarioParaChat` para `aoSelecionarSituacao(situacao)`. Preservar o comportamento: se não houve aceite, guardar histórico pendente; após aceite, processar a mensagem inicial.

- [ ] **Step 5: Verificar e commit**

Run: `npm run test -w frontend -- Situacoes.test.tsx ConsentimentoDemo.test.tsx && npm run typecheck -w frontend`

```bash
git add frontend/src/App.tsx frontend/src/dados/situacoes.ts frontend/src/componentes/situacoes frontend/src/estilos/paginas.css frontend/tests/Situacoes.test.tsx
git add -u frontend/src/componentes/CenariosVida.tsx
git commit -m "feat(frontend): ampliar situacoes orientadas"
```

---

### Tarefa 6: Catálogo pesquisável de direitos verificados

**Files:**
- Create: `frontend/src/componentes/direitos/Direitos.tsx`
- Create: `frontend/src/componentes/direitos/CartaoDireito.tsx`
- Create: `frontend/src/componentes/direitos/DetalhesDireito.tsx`
- Create: `frontend/tests/Direitos.test.tsx`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/estilos/paginas.css`
- Delete after green: `frontend/src/componentes/Portifolio.tsx`
- Delete after green: `frontend/src/componentes/FichaItem.tsx`

**Interfaces:**
- Consumes: `CATALOGO_DIREITOS`, `ItemLinhaDaVida`.
- Produces: `Direitos({ aoConversarSobre })` e `DetalhesDireito({ item, aberto, aoAlternar })`.

- [ ] **Step 1: Escrever teste vermelho de busca, filtro e fonte**

```tsx
it('busca entre sete itens e abre detalhes verificáveis', async () => {
  const user = userEvent.setup();
  render(<Direitos aoConversarSobre={vi.fn()} />);
  expect(screen.getByText('7 direitos e serviços revisados')).toBeVisible();
  await user.type(screen.getByRole('searchbox', { name: 'Buscar direitos' }), 'remédio');
  expect(screen.getAllByTestId('cartao-direito')).toHaveLength(1);
  await user.click(screen.getByRole('button', { name: /ver detalhes de farmácia popular/i }));
  expect(screen.getByRole('link', { name: /fonte oficial/i })).toHaveAttribute('href', expect.stringMatching(/^https:\/\//));
});
```

- [ ] **Step 2: Executar e confirmar falha**

Run: `npm run test -w frontend -- Direitos.test.tsx`

- [ ] **Step 3: Implementar busca e categorias**

Normalizar acentos com `texto.normalize('NFD').replace(/\p{Diacritic}/gu, '')`. Buscar em `nome_popular`, `resumo_simples` e `termos_populares`. Filtros devem ser derivados das sete categorias existentes, não de opções vazias.

- [ ] **Step 4: Implementar detalhes e estado vazio**

Detalhes exibem resumo, critérios, documentos, passos, canal, fontes, `ultima_revisao` e alerta de confirmação. Links externos usam `target="_blank" rel="noreferrer"`. Estado vazio oferece limpar filtros ou conversar.

- [ ] **Step 5: Integrar e remover catálogo antigo**

Renomear callback para `aoConversarSobreDireito`. Manter o histórico preparado sem afirmar elegibilidade antes da triagem.

- [ ] **Step 6: Verificar e commit**

Run: `npm run test -w frontend -- Direitos.test.tsx && npm run typecheck -w frontend && npm run build -w frontend`

```bash
git add frontend/src/App.tsx frontend/src/componentes/direitos frontend/src/estilos/paginas.css frontend/tests/Direitos.test.tsx
git add -u frontend/src/componentes/Portifolio.tsx frontend/src/componentes/FichaItem.tsx
git commit -m "feat(frontend): refazer catalogo de direitos"
```

---

### Tarefa 7: Conversa responsiva e recuperável

**Files:**
- Create: `frontend/src/componentes/conversa/Conversa.tsx`
- Create: `frontend/src/componentes/conversa/ContextoConversa.tsx`
- Create: `frontend/src/componentes/conversa/Mensagem.tsx`
- Create: `frontend/src/componentes/conversa/Compositor.tsx`
- Modify: `frontend/tests/Chat.test.tsx` → rename `frontend/tests/Conversa.test.tsx`
- Create: `frontend/tests/Responsividade.test.tsx`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/estilos/conversa.css`
- Delete after green: `frontend/src/componentes/Chat.tsx`

**Interfaces:**
- Consumes: `MensagemChat`, `enviando`, `erro`, `aoEnviar`, `aoLimpar`, `aoTentarNovamente`.
- Produces: `Conversa`, `Mensagem`, `Compositor`, `ContextoConversa`.

- [ ] **Step 1: Escrever teste vermelho do comportamento preservado**

```tsx
it('envia com Enter, quebra com Shift+Enter e preserva texto após erro', async () => {
  const user = userEvent.setup();
  const aoEnviar = vi.fn();
  const { rerender } = render(<Conversa mensagens={mensagens} enviando={false} aoEnviar={aoEnviar} />);
  const entrada = screen.getByRole('textbox', { name: 'Escreva sua resposta' });
  await user.type(entrada, 'Minha renda caiu{shift>}{enter}{/shift}este mês');
  expect(entrada).toHaveValue('Minha renda caiu\neste mês');
  await user.keyboard('{Enter}');
  expect(aoEnviar).toHaveBeenCalledWith('Minha renda caiu\neste mês');
  rerender(<Conversa mensagens={mensagens} enviando={false} erro="Falha de conexão" aoEnviar={aoEnviar} ultimaMensagemPendente="Minha renda caiu" />);
  expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeVisible();
});
```

- [ ] **Step 2: Escrever teste estrutural vermelho para mobile**

```tsx
it('mantém apenas a lista de mensagens como área rolável', () => {
  render(<Conversa mensagens={mensagens} enviando={false} aoEnviar={vi.fn()} />);
  expect(screen.getByTestId('conversa-shell')).toHaveAttribute('data-layout', 'viewport');
  expect(screen.getAllByTestId('area-rolavel')).toHaveLength(1);
  expect(screen.getByTestId('compositor')).toHaveAttribute('data-safe-area', 'bottom');
});
```

Run: `npm run test -w frontend -- Conversa.test.tsx Responsividade.test.tsx`

Expected: FAIL porque os componentes e atributos não existem.

- [ ] **Step 3: Implementar shell e contexto desktop**

`.dv-conversation` usa `height: calc(100dvh - var(--dv-header-height))`, grid `18rem minmax(0,1fr)` em `min-width: 64rem`, `min-height: 0` em todos os ancestrais flex/grid e `overflow: hidden` no shell.

- [ ] **Step 4: Implementar mobile 100dvh**

Em até `63.999rem`, esconder `ContextoConversa`, usar uma coluna, `height: calc(100dvh - var(--dv-header-mobile))`, `padding-bottom: env(safe-area-inset-bottom)`. Somente `.dv-messages` recebe `overflow-y: auto`; chips recebem `overflow-x: auto` e não quebram linha.

- [ ] **Step 5: Implementar mensagens, voz e compositor**

Não imitar WhatsApp. Bot usa superfície branca com marcador `Direito Vivo`; usuário usa `--dv-care-dark`. Renderizar conteúdo com `white-space: pre-wrap`. Mostrar botão de voz somente se `speechSynthesis` existir. Textarea cresce até `8rem`, contador 2000, botão 44px e bloqueio durante envio.

- [ ] **Step 6: Implementar reenvio real no App**

Guardar `historicoFalho?: MensagemChat[]`. No catch, manter histórico e erro. `aoTentarNovamente` chama `processarTriagem(historicoFalho)`; ao ter sucesso, limpar `historicoFalho`.

- [ ] **Step 7: Verificar e commit**

Run: `npm run test -w frontend -- Conversa.test.tsx Responsividade.test.tsx ConsentimentoDemo.test.tsx && npm run typecheck -w frontend && npm run build -w frontend`

```bash
git add frontend/src/App.tsx frontend/src/componentes/conversa frontend/src/estilos/conversa.css frontend/tests/Conversa.test.tsx frontend/tests/Responsividade.test.tsx
git add -u frontend/src/componentes/Chat.tsx frontend/tests/Chat.test.tsx
git commit -m "feat(frontend): reconstruir conversa responsiva"
```

---

### Tarefa 8: Resultado, urgência e consentimento

**Files:**
- Create: `frontend/src/componentes/resultado/Resultado.tsx`
- Create: `frontend/src/componentes/resultado/Urgencia.tsx`
- Create: `frontend/tests/Resultado.test.tsx`
- Modify: `frontend/src/componentes/ConsentimentoDemo.tsx`
- Modify: `frontend/tests/ConsentimentoDemo.test.tsx`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/estilos/paginas.css`
- Delete after green: `frontend/src/componentes/LinhaDaVida.tsx`
- Delete after green: `frontend/src/componentes/PainelUrgencia.tsx`
- Delete after green: `frontend/tests/LinhaDaVida.test.tsx`
- Delete after green: `frontend/tests/PainelUrgencia.test.tsx`

**Interfaces:**
- Consumes: `RespostaTriagem` existente, dados do catálogo e callbacks de reinício/navegação.
- Produces: `Resultado({ resposta, aoRecomecar, aoVerDireitos })`, `Urgencia({ resposta, aoSair })`.

- [ ] **Step 1: Escrever testes vermelhos do resultado acionável**

```tsx
it('organiza possibilidade, pendências, documentos, canal e fonte', () => {
  render(<Resultado resposta={respostaOrientacao} aoRecomecar={vi.fn()} aoVerDireitos={vi.fn()} />);
  expect(screen.getByRole('heading', { name: 'O que pode se aplicar' })).toBeVisible();
  expect(screen.getByRole('heading', { name: 'O que confirmar' })).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Documentos para preparar' })).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Próximo passo' })).toBeVisible();
  expect(screen.getByText(/revisado em/i)).toBeVisible();
});

it('mostra canais urgentes antes de ações secundárias', () => {
  render(<Urgencia resposta={respostaUrgencia} aoSair={vi.fn()} />);
  const texto = screen.getByRole('region', { name: 'Orientação urgente' }).textContent ?? '';
  expect(texto.indexOf('192')).toBeLessThan(texto.indexOf('Sair da orientação'));
});
```

- [ ] **Step 2: Executar e confirmar falha**

Run: `npm run test -w frontend -- Resultado.test.tsx`

- [ ] **Step 3: Implementar resultado e urgência**

Resolver ids retornados pela API contra `CATALOGO_DIREITOS`; nunca inventar ficha quando id não existe. Situação `compativel` usa texto `Parece compatível`; `precisa_confirmar` usa `Vale confirmar`. Urgência não usa animação e apresenta telefone/canal em links `tel:` quando aplicável.

- [ ] **Step 4: Encurtar consentimento sem enfraquecer conteúdo**

Manter quatro itens literais: não enviar identificadores/contato; processamento por IA; orientação não garante concessão; confirmar no canal oficial. Botões: `Entendi e quero continuar` e `Voltar sem enviar`.

- [ ] **Step 5: Integrar, remover antigos e verificar**

Run: `npm run test -w frontend -- Resultado.test.tsx ConsentimentoDemo.test.tsx && npm run typecheck -w frontend && npm run build -w frontend`

```bash
git add frontend/src/App.tsx frontend/src/componentes/resultado frontend/src/componentes/ConsentimentoDemo.tsx frontend/src/estilos/paginas.css frontend/tests/Resultado.test.tsx frontend/tests/ConsentimentoDemo.test.tsx
git add -u frontend/src/componentes/LinhaDaVida.tsx frontend/src/componentes/PainelUrgencia.tsx frontend/tests/LinhaDaVida.test.tsx frontend/tests/PainelUrgencia.test.tsx
git commit -m "feat(frontend): reorganizar resultado e urgencia"
```

---

### Tarefa 9: Remoção de legado, documentação e gates locais

**Files:**
- Modify: `frontend/README.md`
- Modify: `README.md`
- Delete: `frontend/src/estilos.css`
- Delete unused: `frontend/public/assets/hero-familia-servico-publico.png`
- Delete unused: `frontend/public/assets/secao-catalogo-direitos.png`
- Delete unused: `frontend/public/assets/secao-cenarios-vida.png`
- Delete unused: `frontend/public/assets/secao-chat-triagem.png`

**Interfaces:**
- Produces: repositório sem referências a componentes, classes ou imagens antigas.

- [ ] **Step 1: Confirmar que o novo código não referencia legado**

Run:

```powershell
rg -n "GovHeader|GovFooter|MarcaDireitoVivo|TelaInicial|CenariosVida|Portifolio|\bChat\b|LinhaDaVida|PainelUrgencia|gov-panel|wa-chat|home-hero|secao-cenarios-vida|hero-familia" frontend/src frontend/tests
```

Expected: nenhuma ocorrência em código ativo; nomes de migração em documentação antiga podem permanecer fora de `frontend/src` e `frontend/tests`.

- [ ] **Step 2: Remover CSS e imagens não usados**

Antes de remover, executar `rg` por cada caminho e confirmar zero consumidores. Usar `git rm` somente nos cinco arquivos listados.

- [ ] **Step 3: Atualizar documentação**

Documentar navegação `Início / Situações / Direitos / Conversar`, 12 situações, 7 itens revisados, execução local, consentimento, ausência de cadastro e breakpoints validados. Remover descrições de “chat estilo mensageiro” e “cara de portal”.

- [ ] **Step 4: Executar todos os gates**

Run: `npm test`

Expected: todas as suítes passam, incluindo no mínimo 105 testes existentes mais os novos.

Run: `npm run typecheck`

Expected: zero erros.

Run: `npm run build`

Expected: build Vite concluído e nenhuma referência a assets removidos.

Run: `npm audit --omit=dev`

Expected: 0 vulnerabilidades de produção conhecidas.

- [ ] **Step 5: Commit**

```bash
git add README.md frontend/README.md
git add -u frontend/src/estilos.css frontend/public/assets
git commit -m "docs(frontend): finalizar nova experiencia"
```

---

### Tarefa 10: Validação responsiva real e Preview pública

**Files:**
- Modify only if a verified defect is found: relevant file under `frontend/src/`
- Test only if a defect is found: corresponding file under `frontend/tests/`

**Interfaces:**
- Consumes: Preview `direito-vivo-web`, API Preview atual e `VITE_API_URL` já configurada.
- Produces: evidência separada para automação local, browser, integração remota e itens ainda manuais.

- [ ] **Step 1: Executar servidor local e abrir a interface**

Run: `npm run dev -w frontend -- --host 127.0.0.1`

Verificar home, situações, direitos, consentimento, conversa e resultado sem usar dados pessoais.

- [ ] **Step 2: Testar viewports definidos**

Usar navegador automatizado com larguras `360`, `390`, `768`, `1024` e `1440`. Em cada uma, verificar:

```js
({
  overflowHorizontal: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  heading: document.querySelector('h1')?.textContent,
  visibleDialogs: document.querySelectorAll('[role="dialog"]').length,
})
```

Expected: `overflowHorizontal: false`; heading presente; dialogs somente quando acionados.

- [ ] **Step 3: Verificar o chat em 360 e 1440**

Em 360px: header e compositor visíveis, uma única área de rolagem, chips horizontais, textarea e envio sem corte. Em 1440px: coluna contextual + conversa; histórico e compositor dentro da altura da viewport.

- [ ] **Step 4: Verificar acessibilidade prática**

Navegar por teclado pelas quatro abas, CTA, filtros, busca, cards e consentimento. Confirmar foco visível; acionar `prefers-reduced-motion`; aumentar fonte/zoom a 200%; inspecionar console para erros.

- [ ] **Step 5: Publicar somente Preview do frontend**

Run: `vercel deploy --target preview --yes` dentro de `frontend/`.

Expected: deployment `target: preview`, `status: Ready`; não executar `--prod`.

- [ ] **Step 6: Validar integração pública**

Confirmar:

- site anônimo retorna HTTP 200 sem SSO;
- bundle contém a URL da API Preview esperada;
- preflight da origem do site recebe `Access-Control-Allow-Origin` exato;
- origem externa não recebe permissão CORS;
- triagem sem consentimento retorna 403;
- triagem consentida de demonstração retorna 200;
- rate limit permanece presente.

- [ ] **Step 7: Corrigir defeitos pelo ciclo vermelho-verde**

Para cada defeito observado: escrever teste que reproduz, confirmar falha, implementar correção mínima, repetir suíte relevante e criar commit `fix(frontend): <comportamento corrigido>`. Não agrupar defeitos independentes.

- [ ] **Step 8: Registrar resultado final**

Run: `git status --short` e `git log -12 --oneline`.

Expected: árvore limpa e sequência de commits coerente. Relatar separadamente: testes automatizados aprovados, validação remota aprovada, validação visual aprovada e qualquer teste físico/manual ainda pendente.
