# Direito Vivo — repaginação e acesso à ajuda

**Data:** 29 de setembro de 2026
**Status:** proposta para revisão
**Objetivo:** tornar a demonstração do Direito Vivo clara, acolhedora e utilizável por pessoas que chegam com um problema concreto, sem saber o nome de um benefício.

## 1. Base e limites do projeto

Esta proposta parte do [brief](../../brief-projeto-direitos-invisiveis.md), do [SDD do MVP](../../sdd-direito-vivo.md) e da [especificação da demonstração pública](2026-08-12-demo-publica-confiavel-design.md). A última estabelece a comunicação de privacidade e o posicionamento de demonstração; esta especificação detalha a experiência visual e de ajuda, sem substituir o contrato de segurança ainda não implementado.

O produto atual tem React/Vite, catálogo gerado a partir de `db/seed/itens.json`, oito categorias, 30 fichas, cenários guiados, chat que envia `POST /api/triagem` e resultado priorizado. Não há autenticação nem fluxo de localização. A conversa fica em memória no frontend, mas o texto é enviado à API e processado por provedor externo. As preferências de contraste são salvas em `localStorage`.

O site continua sendo um **projeto independente e uma demonstração**, sem solicitação de benefício, decisão de elegibilidade ou vínculo governamental. Conteúdo federal existente pode ser apresentado como orientação; regras locais exigem confirmação no órgão competente. Nenhuma nova integração governamental, coleta de documento, geolocalização, conta ou canal de envio entra neste trabalho. O processamento de texto pelo provedor externo já existente deve ficar explícito.

## 2. Achados da auditoria

| Área | Estado observado | Correção proposta |
| --- | --- | --- |
| Página inicial | Muitos blocos repetem os mesmos três caminhos; a ajuda urgente aparece tardiamente | Começar por necessidade, urgência e busca; reduzir conteúdo repetido |
| Identidade | Faixa tricolor, nomes internos `Gov*` e comentários que chamam o cabeçalho de oficial; texto visível também diz que o projeto é independente | Dar identidade própria e manter aviso de independência junto à marca |
| Privacidade | Textos prometem “100% anônima”, “sigilosa” e “nada sai do navegador” | Explicar o envio ao provedor externo com texto verificável, antes do primeiro envio |
| Consentimento | `frontend/src/api.ts` envia apenas `mensagens`; a API não exige aceite | Aplicar o contrato de demo previsto na especificação anterior: aceite explícito e validação no servidor antes de chamar o motor |
| Navegação | `App.tsx` troca abas e usa `replaceState`; o botão Voltar do chat usa `history.back()` | Fazer URL, voltar/avançar e estado da tela concordarem, sem incluir relato ou resultado na URL |
| Catálogo | Busca e filtros existem; a ficha sobreposta não declara diálogo nem gerencia foco | Melhorar descoberta, filtro e diálogo acessível, preservando as 30 fichas |
| Movimento | Globo e pulsos contínuos somam movimento decorativo; há suporte parcial a movimento reduzido | Remover loops decorativos e usar transições curtas apenas em respostas a ações |
| Ajuda | Canais ficam espalhados entre início, cenários, resultado e rodapé | Criar uma entrada de ajuda persistente, com urgência, situações e dúvidas práticas |
| Testes | Frontend: 17 testes em 3 arquivos passaram nesta auditoria | Ampliar cobertura dos novos fluxos e verificar visualmente desktop e celular |

Os 17 testes demonstram apenas o comportamento já coberto. Eles não certificam conteúdo jurídico, acessibilidade completa, API ao vivo ou segurança da demonstração.

## 3. Direção de experiência

A entrada principal é **“Encontre ajuda para sua situação”**. Duas alternativas ficam igualmente localizáveis: procurar um direito pelo nome e iniciar a conversa guiada. “Preciso de ajuda agora” aparece no topo e leva a canais humanos sem passar pela IA.

Referências de estrutura: o NHS separa informação, serviços e ajuda urgente; o 1177 oferece busca e descoberta de atendimento; o Service-Public organiza informações por evento de vida e ajuda próxima. O Direito Vivo adotará esses princípios de orientação, com identidade brasileira própria e sem imitar marca institucional.

```text
Cabeçalho: Direito Vivo + projeto independente | Direitos | Situações | Ajuda | Conversa
Alerta discreto: Precisa de ajuda agora? Abrir canais de urgência

Encontre um caminho para a sua situação
[O que está acontecendo? __________________] [Buscar direitos]
[Família e renda] [Trabalho] [Saúde] [Violência] ...

Como prefere continuar?
[Ver orientações por situação] [Pesquisar as 30 fichas] [Conversa guiada]

Como funciona | Privacidade e limites | Fontes e revisão
Rodapé com canais oficiais, independência e aviso informativo
```

No celular, a busca e os caminhos principais aparecem antes de imagens e explicações longas. O cabeçalho não depende de rolagem horizontal para expor Ajuda. A primeira dobra deve oferecer ao menos uma ação útil sem exigir leitura do texto institucional inteiro.

## 4. Sistema visual e movimento

- **Cores:** azul profundo `#173B52` para estrutura e confiança; azul claro `#EAF2F5` para áreas de orientação; verde `#176B5B` para ações; amarelo `#F3C85A` apenas para foco e atenção; branco `#FFFFFF` para leitura; texto `#173044`.
- **Tipografia:** uma família sem serifa legível, com preferência por fonte local ou pilha de sistema para não depender de serviço externo. Escala clara para títulos, subtítulos, corpo e texto auxiliar; corpo de pelo menos 16 px e largura de leitura controlada.
- **Composição:** superfícies amplas e leves, divisórias que agrupam informação e uma única fotografia documental em destaque. Cartões aparecem quando representam escolhas, não como recipiente padrão de todo texto. Evitar faixa tricolor e símbolos que possam sugerir marca federal.
- **Fotografia:** retratar orientação e autonomia, sem explorar sofrimento nem sugerir que pessoas fotografadas receberam um benefício. Auditar direitos de uso dos arquivos atuais antes de mantê-los. Nova imagem só entra com origem e licença registradas.
- **Movimento:** sem globo girando, pulsos contínuos ou entrada animada de todas as seções. Filtros, detalhes e aviso de confirmação podem ter transições breves. `prefers-reduced-motion` elimina movimento não essencial, inclusive rolagem suave do chat.
- **Acessibilidade:** contraste suficiente, foco visível, controles de toque de pelo menos 44 px, texto redimensionável, rótulos explícitos, ordem de leitura e navegação por teclado. Alto contraste e leitura em voz alta existentes serão mantidos e reavaliados.

## 5. Arquitetura da informação e componentes

O frontend mantém o estado de navegação em `App.tsx`, mas passa a reconhecer explicitamente `inicio`, `direitos`, `situacoes`, `ajuda` e `conversa`. O resultado continua transitório, sem URL compartilhável contendo relato. URLs antigas `#catalogo`, `#cenarios` e `#chat` recebem mapeamento compatível. `hashchange`/histórico sincronizam a tela; mudar de página não limpa a conversa. “Limpar conversa” limpa apenas estado da conversa e do resultado.

Os componentes terão responsabilidades separadas:

1. **Cabeçalho e rodapé:** navegação, marca independente, acessibilidade e canais permanentes.
2. **Início:** busca inicial, situações principais, três caminhos de uso e explicação curta do serviço.
3. **Ajuda:** canais imediatos, onde procurar apoio, perguntas frequentes sobre uso, privacidade, documentos e limites; links oficiais com nome e finalidade. Esta área funciona sem API.
4. **Situações:** reaproveita os oito grupos e os cenários já existentes, sem enviar a história fictícia ao provedor automaticamente. Mostra o contexto ao usuário e exige a etapa de aceite antes do envio.
5. **Direitos:** usa `CATALOGO_DIREITOS`, filtros e termos populares. Busca normaliza acentos; resultados e ausência de resultados explicam o que fazer. A ficha é um diálogo acessível com Escape, foco inicial, contenção de foco e retorno ao acionador.
6. **Conversa e resultado:** preservam o formato de resposta atual até a evolução prevista para a demo, ajustam linguagem e estados de espera/erro, mostram a referência legal disponível e deixam claro que a ordem é orientação, não decisão. Compartilhar nunca inclui relato pessoal automaticamente.

Dados estáticos de ajuda ficam em um único módulo tipado, com `titulo`, `quando_usar`, `acao`, `url_oficial`, `fonte` e `verificado_em`. O catálogo continua gerado do seed; a ajuda não copia critérios de elegibilidade nem cria uma segunda fonte de verdade jurídica.

## 6. Ajuda e privacidade

O acesso “Preciso de ajuda agora” diferencia **perigo imediato** de **orientação e denúncia**. Para o Brasil, a primeira versão pode apresentar 190 para intervenção policial imediata, 192 para urgência médica, 180 para orientação/denúncia de violência contra mulher, 100 para violações de direitos humanos e indicação de CRAS para assistência social não emergencial. Fontes iniciais: [Ligue 180](https://www.gov.br/mulheres/pt-br/ligue180), [SAMU 192](https://www.gov.br/saude/pt-br/composicao/saes/samu-192), [Disque 100](https://www.gov.br/mdh/pt-br/assuntos/noticias/2026/defeso-eleitoral/agosto/disque-100-a-denuncia-pode-ser-anonima-tire-suas-principais-duvidas/) e [Cadastro Único/CRAS](https://www.gov.br/pt-br/servicos/inscrever-se-no-cadastro-unico-para-programas-sociais-do-governo-federal). Texto, horários e links serão conferidos novamente na implementação. Não apresentar CRAS ou Defensoria como substituto de emergência.

Antes da primeira chamada de IA, a pessoa vê uma explicação curta: o Direito Vivo não cria conta nem salva o histórico em seu banco; o relato enviado é processado por um provedor externo; não deve incluir nome, CPF, endereço, telefone ou outros dados pessoais; e a resposta é orientativa. O aceite deve ser explícito e acompanhar a requisição. A API precisa rejeitar requisições sem aceite no modo demo, conforme a especificação anterior. A página de ajuda e o catálogo permanecem disponíveis sem aceite.

O fluxo de cenários não deve enviar conteúdo ao provedor por um clique que parece apenas navegar. A pessoa vê o texto que será enviado, confirma que quer iniciar a demonstração e pode voltar sem chamada. Erros de rede, limite e indisponibilidade mostram uma saída útil: consultar o catálogo e os canais humanos.

## 7. Fluxos de referência

- **Pessoa sem nome do direito:** início → escolhe uma situação → lê caminhos e canais → abre ficha ou decide iniciar conversa → vê explicação/aceite → conversa → resultado priorizado.
- **Pessoa que sabe o nome:** busca → resultados filtrados → ficha completa → fonte e próximo passo → conversa opcional.
- **Pessoa em perigo:** acesso “Preciso de ajuda agora” → canal imediato adequado e opção de sair para contato humano; a IA não é etapa obrigatória.
- **Pessoa que não aceita a IA:** fecha explicação → continua em situações, catálogo e ajuda sem perder navegação.
- **Falha da IA:** mensagem específica e recuperável; não afirmar que houve avaliação ou que existe direito confirmado.

## 8. Testes e critérios de aceite

1. Entrada principal, ajuda e canais estão visíveis e acionáveis por teclado em 360 px, tablet e desktop.
2. Toda chamada ao provedor no modo demo exige aceite explícito; cenários não fazem envio implícito. Teste de API prova rejeição sem aceite e ausência de chamada ao motor.
3. Nenhuma promessa absoluta de anonimato, sigilo, aprovação ou vínculo oficial permanece na interface, incluindo compartilhamento e textos alternativos.
4. Busca por termo popular e sem acento encontra ficha; filtro combinado, resultado vazio e limpeza funcionam.
5. Ficha do catálogo anuncia diálogo, move e devolve foco, prende Tab e fecha por Escape.
6. Hashes antigos, voltar/avançar e recarga chegam à tela esperada sem expor relato na URL.
7. Aviso urgente é anterior à triagem, usa canais oficiais verificados e não classifica CRAS como emergência.
8. Movimento reduzido elimina loops e rolagem suave; navegação, leitura em voz alta e alto contraste continuam utilizáveis.
9. Frontend tests, typecheck e build passam; verificação manual cobre teclado, celular, desktop e impressão do resultado. Testes automatizados não substituem revisão humana de conteúdo jurídico.

## 9. Sequência proposta

1. Corrigir posicionamento, texto de privacidade e aceite real do modo demo, antes de convidar pessoas a usar a IA.
2. Reorganizar navegação, início e ajuda, reutilizando catálogo e cenários.
3. Aplicar identidade visual e movimento contido nos fluxos existentes.
4. Corrigir busca, diálogo, teclado, estados de erro e responsividade.
5. Conferir links e conteúdo de ajuda em fontes oficiais; executar testes e revisão visual.

Publicação, chamadas reais ao provedor, alterações remotas de banco e validação jurídica humana são decisões separadas. A conclusão desta etapa será uma experiência local verificável, com limitações descritas honestamente.
