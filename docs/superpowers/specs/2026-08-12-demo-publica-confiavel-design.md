# Direito Vivo — Demo Pública Confiável

**Data:** 12 de agosto de 2026  
**Status:** arquitetura aprovada para especificação  
**Objetivo:** transformar o MVP local em uma demonstração pública profissional para portfólio, com respostas mais verificáveis, funções úteis e limites claros de privacidade e uso.

## 1. Escopo e posicionamento

O Direito Vivo será publicado como **demonstração de portfólio**, e não como serviço jurídico, assistencial ou governamental em produção. O link público permitirá testar cenários fictícios e, após aceite explícito, escrever um relato livre sem dados pessoais.

A interface deve comunicar, antes da primeira chamada de IA:

- que a demonstração não substitui confirmação em canal oficial nem atendimento profissional;
- que o relato é enviado a um provedor externo de inteligência artificial;
- que nomes, documentos, endereço, telefone e outros dados pessoais não devem ser informados;
- que o projeto não mantém histórico de conversa em banco;
- que situações urgentes devem usar os canais oficiais exibidos imediatamente.

As expressões “100% anônima”, “sigilosa” e equivalentes não serão usadas. A comunicação adotará a formulação verificável: **“O Direito Vivo não cria conta nem salva o histórico desta conversa em seu banco; o texto é processado por um provedor externo de IA.”**

## 2. Modos de execução

O sistema terá um modo explícito, definido por configuração:

- `demo`: único modo autorizado para hospedagem pública nesta etapa;
- `desenvolvimento`: execução local e testes;
- `producao`: bloqueado enquanto não houver provedor e governança aprovados para uso real.

Em `demo`, a API deve recusar a triagem quando o cliente não enviar o aceite de demonstração. O aceite não será persistido: ele acompanha cada requisição como um booleano. A API também limitará conversa, tamanho do texto e frequência de uso.

O frontend exibirá de forma permanente um selo “Demonstração de portfólio”. O `robots.txt` e os metadados não devem apresentar o projeto como canal oficial.

## 3. Arquitetura de decisão

O motor será dividido em unidades isoladas e testáveis:

1. **Proteção de entrada** — identifica e mascara padrões óbvios de CPF, telefone, e-mail e CEP antes de qualquer chamada externa. O texto original permanece apenas na memória da requisição e não é registrado.
2. **Classificador determinístico de urgência** — reconhece sinais explícitos de perigo imediato, violência, ideação suicida, fome sem acesso imediato e falta de abrigo. Em perigo imediato, encerra a triagem da IA e retorna canais seguros por regras fixas.
3. **Recuperação de conhecimento** — busca itens com embeddings e falha de maneira visível quando a base não estiver semanticamente pronta. O fallback para todos os itens será permitido somente em desenvolvimento, nunca na demo pública.
4. **Coleta de fatos** — a LLM faz uma pergunta por vez e produz fatos estruturados, sem decidir sozinha a elegibilidade.
5. **Pré-avaliação de critérios** — compara fatos conhecidos com critérios estruturados da ficha e separa `compativel`, `precisa_confirmar` e `nao_compativel`.
6. **Composição da orientação** — a LLM explica apenas itens permitidos, usando os fatos e fontes fornecidos.
7. **Validação de saída** — rejeita IDs inexistentes, fontes ausentes, afirmações garantidas, formato inválido e recomendações sem próxima ação.
8. **Apresentação** — o frontend renderiza cartões e listas a partir de JSON validado, sem interpretar Markdown arbitrário.

```text
Relato
  → proteção de dados
  → urgência determinística
  → busca semântica
  → coleta de fatos
  → avaliação transparente
  → explicação pela LLM
  → validação final
  → plano de ação com fontes
```

## 4. Contrato da triagem

A resposta da API deixará de ser texto livre e usará uma união discriminada.

### Pergunta

```json
{
  "tipo": "pergunta",
  "mensagem": "Qual é a renda aproximada da casa?",
  "campo": "renda_familiar",
  "progresso": { "respondidos": 2, "total": 5 },
  "aviso_dados_mascarados": false
}
```

### Urgência

```json
{
  "tipo": "urgencia",
  "mensagem": "Se existe perigo agora, procure ajuda imediatamente.",
  "nivel": "imediato",
  "canais": [
    { "nome": "Polícia Militar", "numero": "190", "quando_usar": "Perigo ou agressão acontecendo agora" }
  ]
}
```

### Orientação

```json
{
  "tipo": "orientacao",
  "resumo": "Encontrei dois caminhos que vale confirmar.",
  "confianca": "media",
  "itens": [
    {
      "id": "bolsa-familia",
      "situacao": "precisa_confirmar",
      "motivo": "A renda informada pode estar dentro do critério.",
      "criterios_confirmados": [],
      "criterios_pendentes": ["Confirmar renda por pessoa"],
      "proximos_passos": [],
      "documentos": [],
      "fontes": []
    }
  ],
  "alertas": []
}
```

### Sem correspondência

```json
{
  "tipo": "sem_match",
  "mensagem": "Não encontrei uma correspondência segura na base atual.",
  "proximos_passos": ["Procure o CRAS ou a Defensoria Pública para uma análise individual."]
}
```

O termo `resultado` será substituído por `orientacao` para evitar aparência de decisão definitiva. A confiança descreve a completude dos dados e evidências, não uma probabilidade matemática inventada.

## 5. Base de conhecimento profissional

Cada ficha passará a ter, além dos campos existentes:

- `resumo_simples`;
- `criterios_estruturados` com identificador, descrição e tipo de confirmação;
- `excecoes_e_alertas`;
- `fontes_oficiais`, cada uma com título, URL, órgão e data de acesso;
- `vigencia_inicio` e `vigencia_fim`, quando aplicáveis;
- `status_conteudo`: `rascunho`, `revisao_pendente`, `publicavel` ou `expirado`;
- `revisado_por`: identificador editorial, sem alegar revisão jurídica inexistente;
- `revisao_prevista_em`;
- `versao_conteudo`.

Somente itens `publicavel`, dentro da vigência e com ao menos uma fonte oficial acessível poderão ser recomendados na demo.

Será criado um auditor local que falha quando encontrar:

- URL ausente ou fora de domínio oficial permitido;
- revisão vencida;
- programa temporário sem vigência;
- embedding ausente ou incompatível;
- diferença entre seed, banco e catálogo gerado;
- afirmações absolutas proibidas;
- campos essenciais vazios.

O conteúdo atual não receberá selo de “revisado juridicamente”. A implementação corrige erros oficiais comprovados, adiciona fontes e marca como pendente o que exigir especialista humano.

## 6. Funções da demonstração

### 6.1 Cenários fictícios guiados

A tela inicial oferecerá pelo menos cinco perfis sintéticos. Ao escolher um, o usuário vê os fatos fictícios antes de iniciar e pode acompanhar como a triagem chega à orientação. Nenhum perfil conterá nome, documento ou endereço.

### 6.2 Plano de ação priorizado

Cada orientação será convertida em três horizontes:

- `agora`: segurança ou preparação essencial;
- `proximo_passo`: primeiro contato oficial;
- `depois`: acompanhamento e alternativas.

As ações serão derivadas das fichas, não inventadas livremente pela LLM.

### 6.3 Checklist de documentos

O usuário poderá marcar documentos no navegador. O estado será mantido apenas em memória; recarregar ou usar “limpar conversa” apaga as marcações. A interface distinguirá documento recomendado de documento obrigatório e mostrará quando a falta dele não deve impedir atendimento inicial.

### 6.4 Verificador transparente de elegibilidade

Cada item mostrará:

- o que parece compatível;
- o que ainda precisa ser confirmado;
- o que pode impedir o direito;
- onde obter confirmação oficial.

O sistema nunca mostrará “aprovado”, “garantido” ou percentual de chance sem base estatística validada.

### 6.5 Localizador de canais oficiais

Na primeira versão, o localizador não armazenará geolocalização nem fará busca por endereço. Ele exibirá canais nacionais e links oficiais de busca por unidade local. Quando município e UF forem necessários, a pessoa os informa opcionalmente e os dados ficam apenas na requisição atual.

### 6.6 Lembretes locais e exportação

O usuário poderá baixar um resumo sem dados pessoais e criar arquivo de calendário para uma ação escolhida. Nada será enviado por e-mail, WhatsApp ou serviço externo nesta etapa.

### 6.7 Explicação acessível

Cada orientação oferecerá três apresentações do mesmo dado estruturado:

- resumo curto;
- detalhes;
- leitura em voz alta pelo recurso nativo do navegador.

Não haverá uma segunda chamada à LLM apenas para simplificar texto.

### 6.8 Painel editorial local

Um comando de auditoria gerará relatório para o mantenedor com itens vencidos, fontes incompletas, embeddings ausentes e divergências de conteúdo. Não haverá painel administrativo público nem autenticação nesta fase.

## 7. LLM e provedores

A abstração `ProvedorLLM` será preservada. Gemini continuará como padrão da demonstração. OpenRouter poderá ser adicionado posteriormente como segundo adaptador, mas não será condição para publicar.

Regras comuns a qualquer provedor:

- temperatura baixa e contrato JSON;
- nenhum acesso direto ao banco;
- somente candidatos e fontes fornecidos pelo motor;
- tempo máximo total por requisição;
- mensagens técnicas sem conteúdo do usuário nos logs;
- chave apenas no servidor;
- configuração explícita do modelo, sem roteamento silencioso entre modelos;
- modo de demonstração identificado no prompt de sistema.

O provedor não será usado para embeddings em cada turno quando uma alternativa local determinística atender à recuperação. Na primeira entrega, mantém-se o embedding de consulta atual, mas o monitor de prontidão impedirá fallback silencioso.

## 8. Segurança e privacidade

Controles obrigatórios:

- consentimento de demo em cada requisição;
- mascaramento de padrões de PII antes do provedor;
- urgência processada antes da LLM;
- CORS restrito ao domínio da demo e previews autorizados;
- `trustProxy` configurado para o ambiente de hospedagem;
- rate limiting adequado a função serverless, complementado pelos limites da plataforma;
- salt obrigatório fora do desenvolvimento;
- headers de segurança e CSP;
- limites de tamanho, turnos e tempo;
- nenhuma tabela de conversas, feedback textual ou perfis pessoais;
- nenhuma chave secreta no bundle do frontend;
- logs sem prompts e respostas.

Feedback, se adicionado, será somente estruturado (`util`, `nao_util`, código de motivo) e não conterá texto livre.

## 9. Supabase

O Supabase continuará armazenando somente a base pública de direitos. A evolução seguirá migrations versionadas.

Antes da demo:

- revogar `INSERT`, `UPDATE` e `DELETE` de `anon` e `authenticated`;
- manter RLS de leitura pública apenas para conteúdo publicável;
- restringir execução da RPC aos papéis necessários;
- limitar `limite` e `limiar` dentro da função;
- verificar `security invoker` e `search_path` explícito;
- gerar embeddings para 100% dos itens publicáveis;
- executar advisors e consultas de permissão após a migration.

Nenhuma migration será aplicada ao projeto remoto antes de passar localmente por revisão, testes de contrato e consulta de verificação.

## 10. Hospedagem

A arquitetura alvo é:

```text
GitHub → Vercel Hobby
           ├── frontend React/Vite
           └── API Fastify em Vercel Function
                        ├── Gemini API
                        └── Supabase
```

O projeto será importado como portfólio pessoal e não comercial. A implantação usará ambientes separados:

- `preview`: testes com cenário sintético e chaves próprias;
- `production`: a URL pública da demo, com `MODO_APLICACAO=demo`;
- `development`: `.env` local ignorado pelo Git.

Variáveis secretas serão configuradas no painel da Vercel. O repositório manterá apenas `.env.example` sem valores. O deploy público ocorrerá somente após preview validado e poderá ser revertido para a implantação anterior.

## 11. Experiência visual

A identidade atual será preservada, com ajustes focados em clareza:

- selo de demonstração no cabeçalho;
- modal de consentimento curto antes do chat;
- cenários fictícios em destaque;
- indicador de progresso da triagem;
- cartões de orientação com critérios, pendências, ações e fontes;
- controles de toque com pelo menos 44 px;
- imagens otimizadas;
- linguagem menos institucional e parágrafos menores;
- estado claro para demora, indisponibilidade e limite de uso.

A interface não imitará o gov.br nem usará “oficial” para descrever o Direito Vivo. Logos, cores e textos que possam sugerir vínculo governamental serão revistos.

## 12. Qualidade e avaliação

As alterações seguirão testes antes da implementação. O conjunto mínimo terá:

- testes unitários de PII, urgência, critérios, validação e vigência;
- testes de contrato API/frontend;
- testes de busca que falham sem embeddings;
- casos de emergência sem chamada à LLM;
- casos adversariais de prompt injection e IDs inventados;
- testes dos cinco ou mais cenários sintéticos;
- testes E2E do consentimento, chat, orientação e limpeza;
- typecheck, lint, build e auditoria de dependências;
- verificação desktop e mobile da preview.

A avaliação da LLM medirá, por cenário:

- cobertura dos itens esperados;
- itens indevidos;
- perguntas repetidas;
- alegações garantidas;
- fontes ausentes;
- estabilidade entre execuções;
- latência e falhas do provedor.

O script deverá terminar com código diferente de zero quando um limite obrigatório falhar. Métricas descritivas não serão apresentadas como aprovação automática.

## 13. Sequência de entrega

### Fase 1 — Núcleo confiável

1. Modo demo e comunicação de privacidade.
2. Proteção de entrada e urgência determinística.
3. Novo contrato estruturado e validador.
4. Governança e correção inicial do conteúdo.
5. Prontidão dos embeddings e segurança Supabase.

### Fase 2 — Funções de valor

1. Cenários sintéticos guiados.
2. Plano de ação.
3. Checklist de documentos.
4. Elegibilidade transparente.
5. Canais oficiais.
6. Lembretes/exportação.
7. Explicação acessível.
8. Auditor editorial local.

### Fase 3 — Qualidade e apresentação

1. Avaliação reproduzível da LLM.
2. Lint, CI e auditoria de dependências.
3. Otimização visual e acessibilidade.
4. Documentação técnica e limitações.

### Fase 4 — Publicação controlada

1. Integração da branch no GitHub.
2. Preview Vercel.
3. Testes E2E, segurança e mobile na URL real.
4. Promoção para URL pública.
5. Roteiro, vídeo e texto do LinkedIn.

## 14. Critérios de aceite

A demo estará pronta para receber link público somente quando:

- não houver promessa absoluta de anonimato, sigilo ou elegibilidade;
- urgências explícitas não chamarem a LLM;
- PII reconhecível for mascarada antes do provedor;
- todos os itens recomendáveis estiverem publicáveis, vigentes, com fonte oficial e embedding;
- resposta inválida ou sem fonte for rejeitada;
- os cenários sintéticos passarem pelos limites registrados;
- o comando canônico de testes, typecheck, lint e build passar sem serialização manual especial;
- não houver vulnerabilidade alta conhecida em dependência de produção;
- a preview Vercel passar por validação desktop e mobile;
- as limitações da demonstração estiverem visíveis antes do primeiro envio.

Validação jurídica humana, uso com dados reais e operação como serviço público ficam explicitamente fora do aceite desta demonstração.
