# Redesign healthtech do frontend do Direito Vivo

**Data:** 2026-08-13  
**Status:** aprovado em conversa  
**Escopo:** somente `frontend/`; API, RAG, banco e controles de segurança permanecem inalterados

## 1. Objetivo

Reconstruir a experiência visual do Direito Vivo como um produto digital de tecnologia aplicada ao cuidado. A referência de sensação é a clareza de produto da K Health combinada com princípios de acessibilidade de serviços de saúde, sem copiar marca, componentes ou textos de terceiros.

O novo frontend deve transmitir três atributos em poucos segundos:

1. é simples relatar uma situação;
2. a IA organiza possibilidades, não concede direitos;
3. a orientação termina em canais públicos verificáveis.

A experiência deve ter uma cara inequivocamente brasileira pelo vocabulário, pelas situações de vida, pela diversidade humana e pelas rotas reais de atendimento (CRAS, SUS, INSS, CAPS e Defensoria). Não usar bandeira, mapa, globo, brasão, verde-amarelo ornamental ou qualquer recurso que sugira vínculo institucional.

## 2. Problemas que o redesign resolve

- A interface atual mistura portal institucional, catálogo, landing page e chat sem hierarquia clara.
- O excesso de seções, caixas, cores e imagens genéricas reduz a confiança.
- O símbolo atual parece um globo e não comunica o produto.
- A home repete mensagens e demora a levar o visitante à ação principal.
- O chat é um card de desktop adaptado, em vez de uma experiência responsiva de conversa.
- Os sete cenários atuais são amplos demais e misturam conteúdo publicado com possibilidades ainda em revisão.
- O catálogo apresenta muito texto antes de o visitante entender o próximo passo.

## 3. Direção visual

### 3.1 Conceito: cuidado orientado

A interface representa uma rota de cuidado: a pessoa relata um momento de vida, o produto faz perguntas curtas e a saída organiza o próximo passo. O elemento visual característico será uma linha de percurso que conecta situação, confirmação e canal oficial. Essa linha aparecerá com contenção na home, nas situações e no resultado.

Não haverá fotografias geradas, mockups rasterizados, globo, brasão ou elementos que imitem uma identidade governamental. A personalidade virá da tipografia, composição, microinterações e iconografia vetorial simples.

O calor brasileiro aparecerá em formas orgânicas discretas, cantos generosos, tons de barro usados como sinal, textos que soam naturais em português e exemplos de vida reconhecíveis. A referência healthtech organiza a interface; ela não deve apagar a origem cultural do produto nem produzir uma cópia fria de um aplicativo estrangeiro.

### 3.2 Paleta

- `--ink: #102A2E` — texto e superfícies de alta confiança;
- `--care: #087A70` — ação principal;
- `--care-dark: #075B55` — contraste e estados ativos;
- `--mint: #DDF4EA` — superfícies de acolhimento;
- `--clinical: #3568F0` — informação e tecnologia;
- `--signal: #F06F5F` — alertas e urgência, nunca decoração;
- `--canvas: #F7FAF8` e `--paper: #FFFFFF` — fundos;
- escala neutra baseada em azul-esverdeado, sem cinzas excessivamente frios.

Todos os pares relevantes devem atingir WCAG AA. Alto contraste continuará disponível sem depender apenas de inversão de cores.

### 3.3 Tipografia

- `Manrope Variable`: títulos, botões e corpo, por sua leitura clara e geometria humana;
- `IBM Plex Mono`: etiquetas curtas, status e metadados, usada com moderação.

As fontes serão empacotadas no build por dependência local, evitando chamadas externas em tempo de navegação. A escala terá menos variações e pesos; textos longos manterão largura legível.

### 3.4 Marca

O símbolo em forma de globo será removido. A marca será um wordmark tipográfico `Direito Vivo`, acompanhado por um pequeno sinal de percurso construído em CSS/SVG. O sinal não será usado sozinho como selo institucional.

## 4. Arquitetura de navegação

A navegação principal terá quatro destinos:

- **Início**
- **Situações**
- **Direitos**
- **Conversar**

`Resultado` continua sendo um estado do fluxo e não uma aba. O termo `Cenários` será substituído por `Situações`, mais natural para o público.

No desktop, o cabeçalho será compacto e fixo, com CTA `Começar conversa`. No celular, a navegação será reduzida a marca, CTA e menu acessível; durante o chat, o cabeçalho institucional não competirá com a conversa.

O aviso `Projeto independente` permanecerá visível, mas como informação de confiança discreta, não como uma segunda barra de navegação.

## 5. Páginas e componentes

### 5.1 Início

A home terá cinco blocos com funções distintas:

1. **Hero:** promessa direta, explicação curta e CTA principal. Ao lado, uma demonstração nativa da rota `conte → confirme → procure`, sem imagem decorativa.
2. **Barra de confiança:** `sem cadastro`, `evite dados pessoais`, `fontes oficiais`, `demonstração`.
3. **Entradas por situação:** seis situações prioritárias e link para ver todas.
4. **Como funciona:** três passos reais do serviço, sem estatísticas decorativas.
5. **Direitos verificados:** amostra dos sete itens publicados com acesso ao catálogo.

O conteúdo institucional longo sairá da home e será condensado no rodapé e no consentimento.

### 5.2 Situações

Serão exibidas 12 situações:

1. Perdi o emprego com carteira assinada;
2. Minha renda caiu e a casa precisa de apoio;
3. Tenho 65 anos ou mais e pouca renda;
4. Sou PCD ou cuido de uma pessoa com deficiência;
5. Uma criança da família tem deficiência ou autismo;
6. Estou doente e não consigo trabalhar;
7. Sofri acidente e preciso me afastar;
8. Preciso de remédios de uso contínuo;
9. Estou em sofrimento emocional ou crise de saúde mental;
10. Preciso de ajuda com álcool ou outras drogas;
11. Há violência, ameaça ou risco imediato;
12. Não sei qual serviço procurar.

As situações 1–10 se conectam somente aos sete conteúdos publicáveis ou a perguntas de triagem. A situação 11 abre primeiro a orientação determinística de emergência; não promete benefício ainda não publicado. A situação 12 inicia triagem geral.

Os dados sairão do componente grande e ficarão em `src/dados/situacoes.ts`. Cada item terá categoria, resumo, nível de prioridade, termo inicial de conversa e referências de conteúdo publicável. Haverá filtros por `Renda e trabalho`, `Cuidado e deficiência`, `Saúde` e `Urgência`.

### 5.3 Direitos

O catálogo continuará exibindo apenas os sete itens publicáveis. Terá:

- busca por nome e necessidade;
- filtros de categoria;
- contador honesto de resultados;
- cards compactos com resumo, canal, revisão e CTA;
- painel ou expansão para critérios, documentos, passos e fontes;
- estado vazio com orientação para conversar com a IA.

Nenhum item `revisao_pendente` ou `rascunho` será mostrado como disponível.

### 5.4 Conversa

O chat será reconstruído como uma experiência de aplicativo.

**Desktop:**

- ocupa a altura útil da viewport;
- coluna lateral de aproximadamente 18rem com contexto, privacidade e progresso;
- coluna principal para mensagens;
- cabeçalho, histórico, sugestões e compositor com limites de altura claros.

**Celular:**

- ocupa `100dvh` descontando apenas as áreas seguras;
- não herda margens ou largura máxima das páginas editoriais;
- cabeçalho e compositor permanecem fixos dentro do shell;
- apenas a lista de mensagens rola;
- chips são horizontais e roláveis;
- textarea cresce até quatro linhas;
- botão de envio tem alvo mínimo de 44px;
- teclado virtual, `env(safe-area-inset-bottom)` e mensagens longas não quebram o layout.

As bolhas deixarão de imitar WhatsApp. O bot usará blocos de orientação claros e o usuário terá bolha de alto contraste. Leitura em voz alta, limpar conversa, erro recuperável e contador permanecem.

### 5.5 Resultado e urgência

O resultado será uma rota de ação composta por:

1. resumo da situação;
2. possibilidades encontradas;
3. o que já parece compatível e o que ainda precisa ser confirmado;
4. documentos para preparar;
5. canal oficial e próximo passo;
6. fontes e data de revisão;
7. CTA para refazer ou explorar o catálogo.

Urgência usará uma tela própria de alto contraste, sem animação e sem obrigar a continuar a conversa.

### 5.6 Consentimento

O consentimento continuará sendo obrigatório antes do primeiro envio. O modal será encurtado, com quatro pontos verificáveis:

- não enviar CPF, RG, endereço ou contato;
- texto processado por provedor de IA;
- orientação não garante concessão;
- confirmação deve ocorrer no canal oficial.

Cancelar não envia dados nem altera o histórico.

## 6. Arquitetura do frontend

A organização proposta é:

```text
frontend/src/
  App.tsx
  api.ts
  componentes/
    layout/
      Cabecalho.tsx
      Rodape.tsx
      Marca.tsx
    inicio/
      Inicio.tsx
      DemonstracaoRota.tsx
    situacoes/
      Situacoes.tsx
      CartaoSituacao.tsx
      FiltrosSituacoes.tsx
    direitos/
      Direitos.tsx
      CartaoDireito.tsx
      DetalhesDireito.tsx
    conversa/
      Conversa.tsx
      Mensagem.tsx
      Compositor.tsx
      ContextoConversa.tsx
    resultado/
      Resultado.tsx
      Urgencia.tsx
    compartilhados/
      Icone.tsx
      Selo.tsx
      EstadoVazio.tsx
  dados/
    catalogoDireitos.ts
    situacoes.ts
  estilos/
    tokens.css
    base.css
    componentes.css
    paginas.css
    conversa.css
```

`App.tsx` continuará responsável pelo estado do fluxo, mas deixará de carregar detalhes visuais. Componentes receberão callbacks e dados tipados. O hash atual será preservado por compatibilidade com links existentes; `#cenarios` redirecionará internamente para `#situacoes`.

## 7. Estados e tratamento de erros

- Requisição em andamento mostra digitação e bloqueia envio duplicado.
- Erro de rede preserva a mensagem digitada e oferece `Tentar novamente`.
- HTTP 429 explica o tempo de espera em linguagem simples.
- Resultado sem correspondência direciona para o canal público geral, sem preencher a tela com cards vazios.
- Navegador sem síntese de voz simplesmente não mostra o controle de áudio.
- Conteúdo longo quebra palavras e nunca cria rolagem horizontal na página.

## 8. Acessibilidade e responsividade

- HTML semântico, landmarks e link de pular conteúdo;
- foco visível e ordem de tabulação previsível;
- nomes acessíveis para controles somente com ícone;
- `aria-live` para novas mensagens e erros;
- suporte a `prefers-reduced-motion`;
- contraste WCAG AA;
- alvos de toque com no mínimo 44px;
- nenhuma informação transmitida apenas por cor;
- validação nos breakpoints 360, 390, 768, 1024 e 1440px;
- zoom de texto a 200% sem perda de ação essencial.

## 9. Testes e critérios de aceitação

O trabalho será guiado por testes de comportamento antes das alterações correspondentes.

Critérios obrigatórios:

- 12 situações renderizadas e filtráveis;
- toda situação inicia a conversa correta;
- apenas sete direitos publicáveis aparecem;
- busca e filtros do catálogo funcionam;
- consentimento bloqueia qualquer envio anterior ao aceite;
- envio por Enter e quebra por Shift+Enter permanecem;
- erro permite nova tentativa sem perder a mensagem;
- chat usa um único contêiner rolável no mobile;
- navegação por hash e compatibilidade com `#cenarios` permanecem;
- urgência exibe canais antes de qualquer CTA secundário;
- nenhuma referência ao globo ou às imagens antigas permanece na interface;
- `npm test`, `npm run typecheck` e `npm run build` passam;
- inspeção visual em viewport móvel, tablet e desktop não apresenta sobreposição, corte ou rolagem horizontal;
- Preview final preserva CORS, consentimento, rate limit e integração real com a API.

## 10. Sequência de commits

1. `test(frontend): definir contratos da nova experiencia`
2. `refactor(frontend): criar fundacao visual healthtech`
3. `feat(frontend): reconstruir inicio e navegacao`
4. `feat(frontend): ampliar situacoes orientadas`
5. `feat(frontend): refazer catalogo de direitos`
6. `feat(frontend): reconstruir conversa responsiva`
7. `feat(frontend): reorganizar resultado e urgencia`
8. `test(frontend): validar experiencia responsiva`
9. `docs(frontend): atualizar guia da interface`

Cada commit deve deixar testes e tipagem do frontend passando. A Preview pública só será atualizada depois que todos os gates locais estiverem verdes.

## 11. Fora de escopo

- liberar os 22 itens em revisão editorial;
- mudar prompts, modelos, embeddings ou regras do RAG;
- alterar schema, RLS ou dados do Supabase;
- mudar limites ou proteções da API;
- criar login, conta de usuário ou persistência da conversa;
- copiar elementos de marca da K Health, NHS ou gov.br;
- gerar novas fotografias ou imagens rasterizadas.
