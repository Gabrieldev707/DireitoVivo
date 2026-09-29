# Auditoria local — repaginação e acesso à ajuda

**Data:** 29 de setembro de 2026  
**Base:** `docs/superpowers/specs/2026-09-29-repaginacao-e-ajuda-design.md`  
**Estado:** implementação local verificada; publicação e revisão jurídica humana pendentes.

## O que mudou

- A entrada começa por busca, situações e ajuda urgente. A marca declara que o projeto é independente; textos absolutos de anonimato e sigilo saíram da interface e dos metadados.
- A navegação usa hashes coerentes, aceita os três hashes antigos e preserva a conversa ao trocar de tela. Relato e resultado não entram na URL.
- A página de ajuda separa perigo imediato (190/192), orientação e denúncia (180/100) e assistência social (CRAS). Cada canal tem fonte e data de consulta no módulo tipado.
- O primeiro envio da conversa exige explicação, prévia do texto e aceite explícito. API e cliente recusam envio sem `aceite_demo: true`.
- O catálogo continua com 30 fichas geradas do seed. Busca ignora acentos, e a ficha tem diálogo, Escape, foco contido e retorno ao acionador.
- A interface usa azul profundo, verde de ação, espaços de leitura e transições curtas. Foram retirados os loops decorativos do globo e o aspecto de mensageiro do chat. Não foram usadas imagens do acervo atual por falta de licença registrada.
- O resultado apresenta a ordem como orientação e compartilha apenas nomes das fichas, sem o relato.

## Evidências

| Verificação | Resultado |
| --- | --- |
| `npm test` | Passou: 28 testes RAG, 17 API, 33 frontend; total 78. |
| `npm run typecheck` | Passou nos três workspaces. |
| `npm run build` | Passou para o frontend. |
| `git diff --check` | Passou. |
| Navegador local | Inspeção visual em 360 px, 768 px e desktop; sem rolagem horizontal em 360 px, inclusive com fonte ampliada a 140%. |
| Fluxos no navegador | Ajuda, `#catalogo`, `#cenarios`, voltar, busca sem acento, diálogo com Escape e foco restaurado, prévia de cenário cancelada, alto contraste e conversa/resultado sintéticos. |
| Chamada de IA | Nenhuma chamada real. O resultado visual veio de um servidor HTTP local falso, que exigiu `aceite_demo: true`. |

A revisão visual foi feita no Chrome local. As capturas foram inspecionadas durante a sessão, sem arquivo de screenshot persistido. A impressão tem regra CSS para ocultar navegação e ações; não houve conferência de PDF impresso. Leitura por leitor de tela, dispositivo físico e auditoria WCAG completa também não foram realizados.

## Fontes e conteúdo

Os canais de ajuda foram conferidos em páginas oficiais: [Anatel para números de emergência](https://www.gov.br/anatel/pt-br/regulado/acompanhamento-e-controle/servicos-de-utilidade-publica-e-de-emergencia-tridigitos), [Ministério da Saúde para SAMU 192](https://www.gov.br/saude/pt-br/composicao/saes/samu-192), [Ministério das Mulheres para Ligue 180](https://www.gov.br/mulheres/pt-br/ligue180), [serviço de denúncia de direitos humanos](https://www.gov.br/pt-br/servicos/denunciar-violacao-de-direitos-humanos) e [serviço de Cadastro Único/CRAS](https://www.gov.br/pt-br/servicos/inscrever-se-no-cadastro-unico-para-programas-sociais-do-governo-federal). Data de verificação registrada no código: 2026-09-29. Não se apresentou CRAS como emergência.

Uma divergência material foi encontrada na ficha “Novo Desenrola Brasil”: o seed de julho descrevia adesão e passos como atuais. O [Congresso Nacional registra que a MP 1.355/2026 teve o prazo de vigência encerrado](https://www.congressonacional.leg.br/pt_BR/materias/medidas-provisorias/-/mpv/173846). O seed foi corrigido para declarar esse estado e orientar a confirmação no [Ministério da Fazenda](https://www.gov.br/fazenda/pt-br/acesso-a-informacao/acoes-e-programas/novo-desenrola-brasil/legislacao/legislacao) antes de qualquer adesão; o catálogo foi regenerado com 30 fichas. A correção não atesta quais modalidades estão abertas hoje.

As outras 29 fichas não passaram por validação jurídica individual nesta etapa. Critérios, prazos, valores, abrangência e canais de solicitação podem mudar; uma revisão humana por fonte oficial é necessária antes de apresentar o catálogo como informação confiável ao público.

## Limites para publicação

Esta entrega é local. Não houve deploy, uso de credenciais, chamada ao provedor externo, alteração remota do banco ou validação jurídica humana. Antes de uma demonstração pública, revisar as 30 fichas, política de dados e retenção do provedor/API, links, leitor de tela, zoom, impressão e fluxo com API real em ambiente controlado.
