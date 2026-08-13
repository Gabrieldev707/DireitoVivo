# Central de confiança, marca e rodapé — Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar quatro páginas institucionais verificáveis, unificar a marca e substituir o rodapé atual por uma área profissional de navegação e confiança.

**Architecture:** A aplicação continua sendo uma SPA orientada por hash. As páginas institucionais usam um layout editorial compartilhado, enquanto `Marca` fornece todas as variantes do símbolo e do nome; `Rodape` usa links com URL real para navegação e permanece fora do shell de conversa.

**Tech Stack:** React 19, TypeScript 5.6, CSS, Vite 6, Vitest 4, Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-13-chat-acessivel-confianca-institucional.md`

## Global Constraints

- Não alterar API, RAG, banco, prompt nem provedor de IA.
- Não alegar conformidade WCAG/eMAG nem usar selo de certificação.
- Não usar “100% anônimo”, “sigiloso” ou vínculo governamental.
- Não inventar contato privado, parceria, depoimento ou número de impacto.
- O chat de altura integral continua sem rodapé visual.
- As páginas devem descrever somente comportamentos confirmados no repositório.
- Links externos usam `target="_blank" rel="noreferrer"`; navegação interna usa hashes canônicos.
- Manter compatibilidade com `#catalogo`, `#cenarios` e `#chat`.
- Cada tarefa segue teste vermelho, implementação mínima, teste verde e commit próprio.

---

## File Structure

```text
frontend/public/
  favicon.svg                         # símbolo de percurso, sem texto
  marca-social.svg                    # marca + descrição curta para compartilhamento
frontend/src/
  componentes/
    institucional/
      LayoutInstitucional.tsx         # cabeçalho editorial e índice local
      PaginaAcessibilidade.tsx        # recursos, teclado, voz e limitações
      PaginaPrivacidade.tsx           # comportamento verificado de dados
      PaginaTermos.tsx                # limites e independência
      PaginaSobre.tsx                 # método, arquitetura e estágio
    layout/
      Marca.tsx                       # única implementação visual da marca
      Rodape.tsx                      # navegação, confiança e limites
  dados/
    confianca.ts                      # URLs oficiais e data editorial compartilhada
  estilos/
    institucional.css                # layout das quatro páginas
frontend/tests/
  Institucional.test.tsx
  MarcaRodape.test.tsx
  Navegacao.test.tsx
```

## Task 1: Rotas institucionais e contrato de navegação

**Files:**
- Modify: `frontend/src/tipos.ts`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/componentes/layout/Cabecalho.tsx`
- Modify: `frontend/tests/Navegacao.test.tsx`

**Interfaces:**
- Produces: `AbaInstitucional = 'acessibilidade' | 'privacidade' | 'termos' | 'sobre'`.
- Produces: `AbaNavegacao` incluindo `AbaInstitucional`.
- Produces: hashes canônicos de mesmo nome.
- Consumes: callback existente `aoMudarAba(aba: AbaNavegacao): void`.

- [ ] **Step 1: Escrever testes vermelhos para os hashes institucionais**

Adicionar a `Navegacao.test.tsx`:

```tsx
it.each([
  ['#acessibilidade', 'acessibilidade'],
  ['#privacidade', 'privacidade'],
  ['#termos', 'termos'],
  ['#sobre', 'sobre'],
])('abre a página institucional %s', (hash, view) => {
  window.location.hash = hash;
  render(<App />);
  expect(screen.getByRole('main')).toHaveAttribute('data-view', view);
});

it('mantém as páginas institucionais fora da navegação principal', () => {
  render(<Cabecalho abaAtiva="sobre" aoMudarAba={vi.fn()} />);
  const principal = screen.getByRole('navigation', { name: 'Principal' });
  expect(within(principal).queryByRole('button', { name: 'Sobre' })).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Executar o teste e confirmar a falha**

Run: `npm run test -w frontend -- Navegacao.test.tsx`

Expected: FAIL porque os tipos e hashes institucionais ainda não existem.

- [ ] **Step 3: Ampliar os tipos e o mapeamento de hash**

Em `tipos.ts`:

```ts
export type AbaInstitucional = 'acessibilidade' | 'privacidade' | 'termos' | 'sobre';
export type AbaNavegacao = 'inicio' | 'catalogo' | 'cenarios' | 'chat' | 'resultado' | AbaInstitucional;
```

Em `App.tsx`, reconhecer os quatro hashes em `obterAbaPorHash` e acrescentá-los a `VISAO_CANONICA`. Não renderizar conteúdo provisório vazio: até Task 4, usar uma região temporária acessível com `h1` igual ao nome da página, removida na mesma sequência antes do commit da Task 4.

Em `Cabecalho.tsx`, manter `ABAS` apenas com os quatro destinos principais. Tratar rota institucional como nenhuma aba principal ativa.

- [ ] **Step 4: Executar navegação e tipagem**

Run: `npm run test -w frontend -- Navegacao.test.tsx && npm run typecheck -w frontend`

Expected: todos os testes do arquivo passam; TypeScript termina com código 0.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/tipos.ts frontend/src/App.tsx frontend/src/componentes/layout/Cabecalho.tsx frontend/tests/Navegacao.test.tsx
git commit -m "test(frontend): definir rotas institucionais"
```

## Task 2: Marca única e ativos de navegador

**Files:**
- Create: `frontend/public/favicon.svg`
- Create: `frontend/public/marca-social.svg`
- Create: `frontend/tests/MarcaRodape.test.tsx`
- Modify: `frontend/src/componentes/layout/Marca.tsx`
- Modify: `frontend/src/componentes/conversa/Conversa.tsx`
- Modify: `frontend/src/estilos/componentes.css`
- Modify: `frontend/src/estilos/conversa.css`
- Modify: `frontend/index.html`

**Interfaces:**
- Produces: `type VarianteMarca = 'completa' | 'compacta' | 'simbolo'`.
- Produces: `Marca({ variante?: VarianteMarca, clara?: boolean, demonstracao?: boolean })`.
- Consumes: o mesmo desenho SVG de percurso nos ativos estáticos e no componente.

- [ ] **Step 1: Escrever testes vermelhos da marca**

Criar `MarcaRodape.test.tsx`:

```tsx
it('oferece variantes com o mesmo nome acessível', () => {
  const { rerender } = render(<Marca variante="completa" />);
  expect(screen.getByText('Direito Vivo')).toBeVisible();
  rerender(<Marca variante="simbolo" />);
  expect(screen.getByLabelText('Direito Vivo')).toBeVisible();
});

it('usa Marca no agente da conversa e remove o avatar textual', () => {
  render(<Conversa mensagens={[{ papel: 'assistente', conteudo: 'Olá' }]} enviando={false} aoEnviar={vi.fn()} />);
  expect(screen.getByLabelText('Direito Vivo')).toBeInTheDocument();
  expect(screen.queryByText(/^DV$/)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Confirmar o vermelho**

Run: `npm run test -w frontend -- MarcaRodape.test.tsx`

Expected: FAIL pela ausência da prop `variante` e presença de `DV`.

- [ ] **Step 3: Refatorar `Marca` como fonte única**

Implementar assinatura:

```tsx
export type VarianteMarca = 'completa' | 'compacta' | 'simbolo';

interface PropriedadesMarca {
  variante?: VarianteMarca;
  clara?: boolean;
  demonstracao?: boolean;
}
```

O componente deve usar um único SVG, adicionar `aria-label="Direito Vivo"` apenas na variante `simbolo`, exibir o nome nas demais e exibir o selo somente quando `demonstracao` for verdadeiro. Substituir o avatar `DV` em `Conversa` por `<Marca variante="simbolo" clara />`.

- [ ] **Step 4: Criar ativos e atualizar metadados**

Criar `favicon.svg` com o mesmo `viewBox` e caminhos do símbolo. Criar `marca-social.svg` em 1200×630 com fundo verde profundo, símbolo, nome, “Orientação de direitos em linguagem simples” e “Projeto independente”. Em `index.html`, apontar favicon e `og:image` para esses arquivos locais.

- [ ] **Step 5: Testar e construir**

Run: `npm run test -w frontend -- MarcaRodape.test.tsx Conversa.test.tsx && npm run build -w frontend`

Expected: testes passam; build inclui os SVGs sem erros.

- [ ] **Step 6: Commit**

```bash
git add frontend/public/favicon.svg frontend/public/marca-social.svg frontend/index.html frontend/src/componentes/layout/Marca.tsx frontend/src/componentes/conversa/Conversa.tsx frontend/src/estilos/componentes.css frontend/src/estilos/conversa.css frontend/tests/MarcaRodape.test.tsx
git commit -m "feat(frontend): padronizar marca do Direito Vivo"
```

## Task 3: Rodapé profissional e semântica de links

**Files:**
- Modify: `frontend/src/componentes/layout/Rodape.tsx`
- Modify: `frontend/src/estilos/componentes.css`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/tests/MarcaRodape.test.tsx`

**Interfaces:**
- Consumes: `aoMudarAba(aba: AbaNavegacao): void` apenas para o CTA programático, se necessário.
- Produces: links `href="#inicio"`, `#situacoes`, `#direitos`, `#conversa`, `#acessibilidade`, `#privacidade`, `#termos` e `#sobre`.

- [ ] **Step 1: Acrescentar contrato vermelho do rodapé**

```tsx
it('organiza exploração, confiança e limites com links reais', () => {
  render(<Rodape aoMudarAba={vi.fn()} />);
  expect(screen.getByRole('contentinfo')).toBeVisible();
  expect(screen.getByRole('navigation', { name: 'Explorar' })).toBeVisible();
  expect(screen.getByRole('navigation', { name: 'Confiança' })).toBeVisible();
  expect(screen.getByRole('link', { name: 'Privacidade e dados' })).toHaveAttribute('href', '#privacidade');
  expect(screen.getByText(/não representa órgão governamental/i)).toBeVisible();
  expect(screen.getAllByLabelText('Direito Vivo')).not.toHaveLength(0);
});
```

- [ ] **Step 2: Confirmar falha**

Run: `npm run test -w frontend -- MarcaRodape.test.tsx`

Expected: FAIL porque o rodapé atual usa botões e não possui as regiões.

- [ ] **Step 3: Implementar estrutura e estilos**

Usar `<Marca variante="completa" clara demonstracao />`, dois `<nav>` nomeados, seção de limites e faixa inferior. O link do GitHub será `https://github.com/Gabrieldev707/DireitoVivo`. A revisão do catálogo deve ser calculada a partir do maior `ultima_revisao` de `CATALOGO_DIREITOS`, formatada em português, sem data manual duplicada.

O CTA `Começar conversa` usa `href="#conversa"`; o mecanismo de `hashchange` existente abrirá o consentimento. Manter `{abaAtiva !== 'chat' && <Rodape />}` em `App.tsx`, incluindo resultado e páginas institucionais.

- [ ] **Step 4: Testar responsividade estrutural**

Run: `npm run test -w frontend -- MarcaRodape.test.tsx Navegacao.test.tsx`

Expected: PASS sem regressão de hash.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/componentes/layout/Rodape.tsx frontend/src/estilos/componentes.css frontend/src/App.tsx frontend/tests/MarcaRodape.test.tsx
git commit -m "feat(frontend): reconstruir rodape institucional"
```

## Task 4: Quatro páginas da central de confiança

**Files:**
- Create: `frontend/src/dados/confianca.ts`
- Create: `frontend/src/componentes/institucional/LayoutInstitucional.tsx`
- Create: `frontend/src/componentes/institucional/PaginaAcessibilidade.tsx`
- Create: `frontend/src/componentes/institucional/PaginaPrivacidade.tsx`
- Create: `frontend/src/componentes/institucional/PaginaTermos.tsx`
- Create: `frontend/src/componentes/institucional/PaginaSobre.tsx`
- Create: `frontend/src/estilos/institucional.css`
- Create: `frontend/tests/Institucional.test.tsx`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/main.tsx`

**Interfaces:**
- Produces: `LINKS_CONFIANCA` com eMAG, WAI-ARIA, política de privacidade do Gemini e GitHub.
- Produces: quatro componentes sem props, exceto `PaginaAcessibilidade({ aoAbrirPreferencias, aoIniciarGuiado })`.
- Consumes: navegação por hash e `PainelAcessibilidade` já existente.

- [ ] **Step 1: Escrever testes vermelhos de conteúdo verificável**

```tsx
it.each([
  ['#acessibilidade', /Acessibilidade e como usar/i],
  ['#privacidade', /Privacidade e dados/i],
  ['#termos', /Termos e limites/i],
  ['#sobre', /Sobre o Direito Vivo/i],
])('renderiza %s com um título único', (hash, titulo) => {
  window.location.hash = hash;
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: titulo })).toBeVisible();
});

it('não promete anonimato absoluto ou vínculo oficial', () => {
  window.location.hash = '#privacidade';
  render(<App />);
  expect(screen.getByText(/histórico permanece nesta aba/i)).toBeVisible();
  expect(document.body).not.toHaveTextContent(/100% anônim|site oficial do governo/i);
});
```

- [ ] **Step 2: Confirmar falha**

Run: `npm run test -w frontend -- Institucional.test.tsx`

Expected: FAIL porque as páginas ainda não existem.

- [ ] **Step 3: Implementar layout compartilhado**

`LayoutInstitucional` recebe:

```ts
interface PropriedadesLayoutInstitucional {
  etiqueta: string;
  titulo: string;
  resumo: string;
  filhos: ReactNode;
}
```

Renderizar breadcrumb para `#inicio`, hero editorial, índice de seções e conteúdo com largura de leitura. Focar o `<h1 tabIndex={-1}>` quando o componente montar e atualizar `document.title`; restaurar o título-base ao desmontar.

- [ ] **Step 4: Implementar conteúdo das quatro páginas**

Copiar os fatos e limites das seções 4–7 da especificação. Em Privacidade, incluir explicitamente: estado da aba, histórico por requisição, mascaramento de CPF/telefone/e-mail/CEP, Gemini, logs sem corpo e ausência de tabela de conversa. Em Termos, incluir independência, ausência de decisão e emergência. Em Sobre, listar 12 situações, 7 conteúdos e stack sem métricas promocionais. Em Acessibilidade, incluir recursos, teclado, leitores, voz, limitações e link para relatar barreira sem PII.

- [ ] **Step 5: Integrar rotas e remover conteúdo temporário**

Importar os quatro componentes em `App.tsx`; renderizar pelo valor de `abaAtiva`. Importar `institucional.css` em `main.tsx`. A ação “Iniciar conversa guiada” será um link `#conversa` com `sessionStorage.setItem('direito-vivo-iniciar-guiado','true')`; o plano do chat consumirá e apagará esse sinal.

- [ ] **Step 6: Testar páginas e aplicação**

Run: `npm run test -w frontend -- Institucional.test.tsx Navegacao.test.tsx MarcaRodape.test.tsx && npm run typecheck -w frontend`

Expected: PASS e nenhum conteúdo institucional temporário.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/dados/confianca.ts frontend/src/componentes/institucional frontend/src/estilos/institucional.css frontend/src/App.tsx frontend/src/main.tsx frontend/tests/Institucional.test.tsx
git commit -m "feat(frontend): criar central de confianca"
```

## Task 5: Validação final, documentação e evidências do bloco

**Files:**
- Modify: `README.md`
- Modify: `frontend/README.md`
- Test: all frontend tests

**Interfaces:**
- Consumes: todos os componentes e rotas do plano.
- Produces: documentação com comportamento atual e contagem real de testes.

- [ ] **Step 1: Executar gates completos**

Run: `npm run test -w frontend -- --reporter=verbose`

Expected: 0 arquivos e 0 testes falhando.

Run: `npm run typecheck && npm run build && npm audit --omit=dev`

Expected: três comandos com código 0; auditoria com 0 vulnerabilidades de produção.

- [ ] **Step 2: Verificar texto proibido e links**

Run: `rg -n "100% anônim|sigilos[ao]|Oficial Gov.br|Rodapé Oficial|Cabeçalho Oficial|avatar.*DV" frontend/src frontend/index.html`

Expected: nenhum resultado. Ocorrências educativas dentro de testes que verificam ausência devem ser avaliadas, não removidas automaticamente.

- [ ] **Step 3: Verificar visualmente**

Iniciar `npm run dev -w frontend -- --host 127.0.0.1`. Inspecionar Início, as quatro páginas e rodapé em 360×800, 768×1024 e 1440×950. Confirmar: sem rolagem horizontal, foco visível, contraste legível, marca idêntica, rodapé empilhado no celular e ausência do rodapé no chat.

- [ ] **Step 4: Atualizar documentação com evidência real**

Documentar as novas rotas, o caráter independente e os limites de privacidade. Atualizar a contagem de testes somente a partir da saída fresca do Step 1. Não declarar validação NVDA neste bloco; ela pertence ao plano do chat.

- [ ] **Step 5: Commit**

```bash
git add README.md frontend/README.md
git commit -m "docs: documentar central de confianca"
```

- [ ] **Step 6: Conferir árvore e histórico**

Run: `git diff --check && git status --short && git log -6 --oneline`

Expected: `git diff --check` sem saída, árvore limpa e commits do bloco em ordem.
