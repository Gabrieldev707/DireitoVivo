# Chat acessível e central de confiança do Direito Vivo

**Data:** 2026-08-13  
**Status:** aprovado em conversa; aguardando revisão desta especificação  
**Escopo:** frontend, conteúdo institucional e metadados de marca; sem alterar API, RAG, banco ou provedor de IA

## 1. Objetivo

Transformar a acessibilidade em parte do uso real do Direito Vivo, especialmente na conversa, e completar os elementos institucionais necessários para uma demonstração pública confiável. O bloco também padroniza a marca e reconstrói o rodapé.

A entrega deve permitir que uma pessoa com baixa visão, cegueira, limitação motora, deficiência auditiva, dificuldade cognitiva, baixa alfabetização digital ou conexão limitada consiga:

1. entender o que o serviço faz e o que não faz;
2. configurar a experiência sem abandonar a tarefa;
3. conversar por texto, escolhas guiadas ou voz quando tecnicamente disponível;
4. perceber novas mensagens, erros e progresso com tecnologia assistiva;
5. encontrar informações verificáveis sobre acessibilidade, privacidade e limites do projeto.

Não haverá uma versão segregada “para pessoas com deficiência”. Os mesmos fluxos terão adaptações progressivas.

## 2. Princípios

- **Acessibilidade na tarefa:** a página institucional explica; os controles que resolvem a barreira ficam no chat.
- **Texto continua soberano:** áudio nunca será a única forma de receber ou enviar informação.
- **Uma pergunta por vez:** o modo guiado reduz carga cognitiva sem remover a entrada livre.
- **Sem promessa de conformidade:** o projeto será testado contra critérios relevantes, mas não exibirá selo WCAG/eMAG nem alegará certificação sem auditoria independente.
- **Transparência verificável:** páginas institucionais descrevem apenas o comportamento confirmado no código e na infraestrutura.
- **Identidade própria:** nenhum componente deve sugerir que o Direito Vivo pertence ao governo ou a um órgão público.
- **Progressive enhancement:** voz e síntese aparecem apenas em navegadores compatíveis; a ausência delas não bloqueia a conversa.

## 3. Arquitetura de informação

### 3.1 Navegação principal

Permanece curta: `Início`, `Situações`, `Direitos` e `Conversar`. As páginas institucionais não entram como novas abas de primeiro nível.

### 3.2 Central de confiança

Quatro rotas por hash serão adicionadas:

- `#acessibilidade` — **Acessibilidade e como usar**;
- `#privacidade` — **Privacidade e dados**;
- `#termos` — **Termos e limites**;
- `#sobre` — **Sobre o Direito Vivo**.

Elas serão acessíveis pelo rodapé, pelo menu móvel e por links contextuais do consentimento e da conversa. Voltar/avançar do navegador continuará funcionando. Cada rota terá `h1`, título do documento atualizado, foco inicial no conteúdo principal e link de retorno claro.

### 3.3 Sem quinta página de contato

Não será criada uma página vazia de contato. Relatos de barreira poderão apontar para o repositório do projeto, com aviso explícito para não publicar dados pessoais. Um canal privado de privacidade só será exibido quando o responsável fornecer e autorizar um endereço real. Até lá, a página deve declarar honestamente que a demonstração não oferece atendimento individual nem recebe solicitações com dados pessoais.

## 4. Página “Acessibilidade e como usar”

A página terá conteúdo curto e acionável:

1. **Começar agora:** abrir o painel de preferências ou iniciar conversa guiada.
2. **Recursos disponíveis:** tamanho de texto, contraste, destaque de links, redução de movimento, leitura das mensagens, navegação por teclado e respostas guiadas.
3. **Como usar sem mouse:** ordem de navegação, Enter/Espaço, Escape para fechar diálogos e link “Ir para o conteúdo”. Não serão criados atalhos numéricos globais que possam conflitar com tecnologia assistiva.
4. **Leitores de tela:** landmarks, nomes de controles, anúncio de novas mensagens e erros.
5. **Voz:** compatibilidade variável, permissão do microfone, revisão obrigatória antes de enviar e possível processamento externo pelo navegador.
6. **Limitações conhecidas:** reconhecimento de voz não universal; leitura depende das vozes instaladas; validação manual com tecnologias assistivas ainda necessária.
7. **Relatar uma barreira:** link para o repositório sem coleta de dados pessoais.

O painel global de acessibilidade continuará disponível nessa página e no restante da aplicação.

## 5. Página “Privacidade e dados”

O texto refletirá o estado atual confirmado:

- não exige cadastro, nome, CPF ou login;
- o histórico permanece no estado da aba e não é persistido no banco da aplicação;
- cada requisição envia ao servidor o histórico necessário para o turno;
- padrões reconhecíveis de CPF, telefone, e-mail e CEP são mascarados antes da chamada ao provedor de IA;
- mascaramento reduz exposição, mas não garante anonimização completa;
- o texto protegido é processado pelo provedor externo configurado, atualmente Gemini na demonstração;
- logs de requisição estão desativados e erros não devem registrar o corpo da conversa;
- o aceite acompanha a requisição e não é guardado como perfil de usuário;
- conteúdo público de direitos pode ser consultado no banco, mas não existe tabela de conversa ou perfil;
- fechar/recarregar a aba ou limpar a conversa elimina o histórico mantido pelo frontend.

A página não afirmará “100% anônimo”, “sigiloso” ou “LGPD compliant”. Também não inventará prazo de retenção do provedor externo. Em vez disso, ligará para a documentação oficial aplicável do provedor e distinguirá claramente armazenamento da aplicação de processamento por terceiro.

## 6. Página “Termos e limites”

Deve tornar ostensivo que:

- o Direito Vivo é projeto independente e não representa órgão governamental;
- trata-se de demonstração informativa;
- a IA organiza possibilidades, não decide concessão;
- não substitui orientação jurídica, médica, assistencial ou atendimento de emergência;
- critérios, prazos e canais precisam ser confirmados nas fontes oficiais;
- conteúdo pode ficar desatualizado, por isso cada direito exibe data de revisão;
- uso em emergência direciona para canais específicos e não deve atrasar busca por ajuda;
- o usuário não deve enviar dados pessoais de terceiros.

O consentimento poderá abrir esta página sem perder o estado do diálogo.

## 7. Página “Sobre o Direito Vivo”

Conteúdo proposto:

- problema social enfrentado: dificuldade de descobrir portas de entrada para direitos e serviços;
- método: situação relatada, triagem, conteúdo curado e confirmação oficial;
- escopo público atual: 12 situações e 7 conteúdos publicáveis;
- revisão editorial: fonte oficial, vigência e data de revisão;
- arquitetura em linguagem acessível: React, Fastify, RAG, Gemini e Supabase;
- controles de segurança que podem ser comprovados;
- limitações e estágio de demonstração;
- link para o repositório GitHub.

Não serão usados números de impacto, depoimentos ou parcerias não comprovadas.

## 8. Acessibilidade integrada ao chat

### 8.1 Barra de ferramentas

O cabeçalho interno da conversa terá o botão `Acessibilidade da conversa`. Ele abrirá um painel com:

- **Modo guiado:** ativo/inativo;
- **Leitura facilitada:** reorganiza visualmente respostas estruturadas em resumo e passos, sem pedir nova geração à IA;
- **Ouvir respostas automaticamente:** desativado por padrão;
- **Velocidade de leitura:** lenta, normal ou rápida;
- **Botões maiores:** amplia ações da conversa sem alterar todo o site;
- **Confirmar antes de enviar:** ativado automaticamente para entrada por voz e opcional para texto;
- atalho `Abrir ajustes gerais` para tamanho, contraste, links e movimento.

Preferências não sensíveis serão salvas no `localStorage` junto ao sistema atual. Conteúdo da conversa e transcrições de voz não serão salvos.

### 8.2 Modo guiado

O chat continua aceitando texto livre, porém o modo guiado apresenta uma pergunta curta e um conjunto contextual de respostas:

- `Sim`;
- `Não`;
- `Não sei`;
- `Quero explicar com minhas palavras`.

Quando a pergunta não for binária, opções específicas poderão substituir as três primeiras. Sempre existirá a saída de texto livre. Selecionar uma opção preenche uma etapa de confirmação; não envia silenciosamente quando `Confirmar antes de enviar` estiver ativo.

O progresso será apresentado como `Entender`, `Organizar` e `Onde confirmar`. É orientação de percurso, não percentual nem promessa de número fixo de perguntas.

### 8.3 Leitura facilitada

O controle `Ver em passos` aparecerá quando a resposta já possuir estrutura verificável, como orientação, resultado ou urgência. Ele alternará localmente entre a apresentação completa e uma organização em `Resumo`, `O que confirmar` e `Próximo passo`. Não haverá nova chamada à IA nem tentativa insegura de reescrever texto livre no navegador.

A apresentação facilitada deve:

- preservar integralmente nomes oficiais, números de telefone, alertas e links;
- mostrar uma ideia por item;
- manter condições de elegibilidade e pendências;
- permitir retornar à versão completa;
- usar os campos estruturados que já vieram da API, sem inferir informação.

Perguntas conversacionais já seguirão o contrato atual de uma pergunta por vez. Uma reformulação semântica por IA exigiria mudança de prompt e avaliação própria, portanto permanece fora deste bloco.

### 8.4 Leitura em voz alta

O controle existente será padronizado e ampliado:

- somente uma mensagem pode ser lida por vez;
- `Ouvir`, `Pausar/Continuar` quando suportado e `Parar` têm estados anunciados;
- trocar de rota, limpar conversa ou iniciar outra leitura cancela a fala anterior;
- leitura automática, quando ativada, começa apenas para novas mensagens do assistente;
- alertas urgentes não dependem da leitura automática.

### 8.5 Entrada por voz

Será implementada como recurso experimental e opcional:

1. botão `Falar` aparece apenas com API compatível;
2. antes do primeiro uso, uma explicação informa que o navegador pode usar serviço externo de reconhecimento;
3. a pessoa concede permissão diretamente ao navegador;
4. a transcrição aparece no campo de texto;
5. a pessoa revisa e confirma; nunca há envio automático;
6. `Cancelar` descarta a transcrição local;
7. erros de permissão, ausência de fala e indisponibilidade têm mensagem textual.

O Direito Vivo não gravará arquivo de áudio. Como a API de reconhecimento possui suporte desigual e pode depender de rede, digitação e botões guiados permanecem sempre disponíveis.

### 8.6 Semântica, foco e anúncios

- histórico com semântica de log e atualizações `polite`;
- estado “organizando resposta” anunciado como `status`, sem repetir todo o histórico;
- urgência e erro crítico usam anúncio assertivo de forma restrita;
- após envio, foco permanece no compositor; a nova resposta é anunciada sem deslocamento forçado;
- abrir painel ou confirmação move foco para o título/primeiro controle; fechar devolve foco ao acionador;
- nenhuma rolagem suave ocorre com preferência de movimento reduzido;
- ações possuem alvo mínimo de 44 × 44 CSS px;
- zoom de 200% e texto em 125% não escondem compositor, confirmação ou botão de saída.

## 9. Marca unificada

`Marca` será a única fonte visual da identidade. Ela suportará variantes tipadas:

- `completa`: símbolo, “Direito Vivo” e selo opcional de demonstração;
- `compacta`: símbolo e nome;
- `simbolo`: apenas o sinal, sempre com nome acessível quando informativo;
- `clara`: cores para fundo escuro.

O símbolo do percurso será reutilizado no cabeçalho, chat, rodapé, favicon e imagem social. O avatar textual `DV` será removido. SVGs duplicados ou logos improvisadas não permanecerão nos componentes.

A imagem social poderá combinar a marca com uma frase curta, mas não usará brasão, selo governamental ou fotografia de pessoa como se fosse identidade institucional.

## 10. Novo rodapé

O rodapé terá fundo verde profundo e quatro áreas:

1. **Marca e propósito:** marca clara, descrição curta e selo `Projeto independente`;
2. **Explorar:** Início, Situações, Direitos e Conversar;
3. **Confiança:** Acessibilidade, Privacidade, Termos e Sobre;
4. **Limites:** não representa órgão público, não substitui atendimento oficial e data da última revisão do catálogo.

Na faixa inferior: link do GitHub, ano do projeto e ação discreta `Começar conversa`. Links serão elementos `a` quando houver destino; botões ficam reservados a ações internas sem URL.

No chat de altura integral, o rodapé visual não será renderizado. Os mesmos destinos estarão no menu global e no painel lateral/móvel da conversa, evitando um segundo contêiner de rolagem.

## 11. Componentes e estado

Estrutura prevista:

```text
frontend/src/
  componentes/
    institucional/
      PaginaAcessibilidade.tsx
      PaginaPrivacidade.tsx
      PaginaTermos.tsx
      PaginaSobre.tsx
      LayoutInstitucional.tsx
    conversa/
      AcessibilidadeConversa.tsx
      ConfirmacaoEnvio.tsx
      EntradaVoz.tsx
      ProgressoConversa.tsx
      RespostasGuiadas.tsx
      Mensagem.tsx
      Compositor.tsx
    layout/
      Marca.tsx
      Rodape.tsx
  acessibilidade/
    preferencias.ts
    sinteseVoz.ts
    reconhecimentoVoz.ts
  estilos/
    institucional.css
```

As preferências sairão do estado privado do painel atual para um provedor React compartilhado. O provedor expõe preferências globais e de conversa; os adaptadores de voz isolam APIs do navegador e podem ser simulados em testes.

`AbaNavegacao` incorporará as quatro rotas institucionais. A camada HTTP existente permanece igual. O modo guiado usa as mensagens e respostas atuais; mudanças futuras no contrato da IA não fazem parte deste bloco.

## 12. Falhas e alternativas

- navegador sem síntese: controles de leitura não aparecem;
- voz incompatível: botão não aparece e texto/botões continuam disponíveis;
- microfone negado: explicação textual, link para tentar novamente e foco devolvido ao compositor;
- reconhecimento interrompido: transcrição parcial não é enviada;
- simplificação indisponível: mantém original e anuncia a falha;
- `localStorage` bloqueado: preferências funcionam durante a aba, sem prometer persistência;
- link institucional inválido: testes impedem publicação de hash sem página correspondente;
- conteúdo institucional não deve bloquear o acesso ao chat.

## 13. Segurança e privacidade

- nenhuma captura ou upload de arquivo de áudio;
- nenhuma transcrição enviada antes da confirmação explícita;
- nenhum dado da conversa no `localStorage`;
- páginas institucionais não terão formulários de coleta;
- link para issue pública alerta para não incluir dados pessoais;
- documentação de privacidade será derivada de comportamento verificado, não de intenção futura;
- adicionar outro provedor de IA ou telemetria exige revisão da página de privacidade antes de deploy.

## 14. Testes e validação

### Automatizados

- rotas institucionais, títulos, landmarks e voltar/avançar;
- links reais do rodapé e ausência de botões usados como links;
- mesma `Marca` nas variantes e ausência do avatar `DV`;
- persistência e restauração de preferências;
- modo guiado sempre conserva alternativa de texto livre;
- confirmação antes de envio por voz;
- voz ausente não quebra o compositor;
- síntese cancela fala anterior e ao sair da rota;
- foco retorna ao acionador após fechar painéis;
- anúncio de carregamento, resposta e erro sem duplicação;
- nenhum histórico/transcrição no armazenamento local;
- compatibilidade das rotas antigas;
- testes de regressão existentes.

### Verificação visual e manual

- 360, 390, 768, 1024 e 1440 px;
- texto normal, 125% e zoom do navegador em 200%;
- alto contraste do sistema e painel interno;
- somente teclado;
- `prefers-reduced-motion`;
- leitor de tela NVDA no Windows para percurso mínimo: abrir chat, aceitar consentimento, enviar resposta guiada, ouvir nova mensagem e alcançar resultado;
- VoiceOver/TalkBack ficam declarados como validação pendente se não houver dispositivo real;
- reconhecimento de voz em Chrome/Edge compatível, com permissão aceita, negada e indisponível;
- console sem erros e nenhuma rolagem horizontal.

Testes automáticos não serão apresentados como prova de conformidade completa.

## 15. Critérios de aceitação

- quatro páginas institucionais completas e navegáveis;
- rodapé profissional, responsivo e com identidade própria;
- uma única marca em todos os contextos visuais;
- chat utilizável por texto e escolhas guiadas sem mouse;
- leitura controlável e entrada por voz opcional com revisão;
- configurações globais e do chat persistem sem armazenar conversa;
- privacidade descreve exatamente o processamento atual;
- nenhum selo ou afirmação não comprovada de conformidade;
- testes, typecheck, build e auditoria de dependências passam;
- validações manuais realizadas são separadas das pendentes.

## 16. Sequência de implementação e commits

1. `docs(frontend): especificar chat acessivel e central de confianca`
2. `test(frontend): definir contratos institucionais e de marca`
3. `feat(frontend): padronizar marca e reconstruir rodape`
4. `feat(frontend): criar central de confianca`
5. `test(frontend): definir contratos do chat acessivel`
6. `feat(frontend): compartilhar preferencias de acessibilidade`
7. `feat(frontend): adicionar conversa guiada e linguagem simples`
8. `feat(frontend): adicionar controles de leitura e voz`
9. `test(frontend): validar teclado foco e responsividade`
10. `docs: atualizar privacidade acessibilidade e evidencias`

Cada commit de código deve manter testes e tipagem verdes. Deploy ocorrerá somente após validação local e aprovação visual.

## 17. Fora de escopo

- cadastro, conta ou perfil de acessibilidade no servidor;
- armazenamento de conversas, áudio ou transcrições;
- atendimento humano ou canal privado não fornecido;
- Libras por avatar gerado ou tradução automática sem validação humana;
- alegação de certificação WCAG/eMAG;
- telemetria comportamental;
- troca de Gemini por OpenRouter;
- mudanças no prompt, RAG, schema ou contrato HTTP;
- suporte garantido a reconhecimento de voz em todos os navegadores.
