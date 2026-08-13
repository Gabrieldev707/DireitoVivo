# SDD — Direito Vivo (MVP)

> Spec-Driven Development doc para implementação via Claude Code.
> Este documento é a fonte de verdade do escopo do MVP. Qualquer ambiguidade de implementação deve ser resolvida consultando este documento antes de assumir.

---

## 1. Visão do produto

**Nome:** Direito Vivo
**Missão:** Fazer triagem conversacional de benefícios, direitos e serviços públicos brasileiros que o usuário provavelmente tem acesso mas não sabe que existe — priorizando visibilidade pra quem está em situação de vulnerabilidade (baixa renda, PCD, saúde mental fragilizada, violência doméstica, situação de rua).

**Não-objetivos do MVP (explicitamente fora de escopo):**
- Não valida identidade via CPF/RG/documento
- Não integra com sistemas oficiais (CadÚnico, Meu INSS, etc) — apenas orienta o usuário a acessá-los
- Não é WhatsApp — canal único é chat web
- Não cobre exaustivamente regras estaduais/municipais (apenas federais + indicação genérica pra estaduais)
- Não é aconselhamento jurídico — é triagem orientativa

---

## 2. Requisitos funcionais

### RF01 — Chat de triagem anônimo
- Interface de chat web, sem exigir login, cadastro, nome, CPF ou qualquer dado identificável
- Sistema coleta apenas: idade aproximada, faixa de renda, composição familiar, situação de trabalho, situação de saúde/deficiência, situação de moradia — tudo autodeclarado e não persistido com identificação
- Conversa em linguagem natural e acolhedora, sem jargão jurídico

### RF02 — Motor de triagem via RAG
- LLM (Claude) faz perguntas incrementais pra entender a situação do usuário
- Cruza respostas com a base de conhecimento curada (ver seção 4) via RAG
- Nunca afirma "você VAI receber" — sempre "você provavelmente tem direito a X, confirme em [canal oficial]"
- Se não houver match de nenhum item, retornar mensagem honesta, sem forçar sugestão

### RF03 — Categorização por situação de vida
Categorias fixas (não por nome de benefício):
- Família / criança
- Idoso
- PCD
- Saúde mental
- Trabalho / acidente / segurança do trabalho
- Situação de rua / extrema pobreza
- Violência doméstica
- Dívida / crédito

### RF04 — Resultado com "linha de vida" (priorização)
- Após a triagem, o sistema não lista todos os direitos encontrados de forma solta
- Ordena por critério de **urgência + facilidade de acesso** (ex: o que resolve mais rápido e trava menos coisa primeiro)
- Apresenta como sequência: "Comece por aqui → depois isso → depois isso"
- Critério de ordenação inicial (heurística simples, sem ML): prioridade manual por item no campo `prioridade_base` (1 = mais urgente/fácil, 5 = menos urgente/mais complexo), ajustável por contexto do usuário (ex: se envolve risco de vida/violência, sempre vai pro topo independente do campo)

### RF05 — Ficha detalhada por item
Cada direito/serviço retornado deve exibir:
- Nome popular
- Categoria de vida
- Natureza: `beneficio` ou `servico`
- Critérios de elegibilidade (linguagem simples)
- Documentos necessários
- Canal de solicitação (app, site, presencial — ver seção 4.1)
- Passo a passo de como pedir (guiado, tipo "abre o app X → toca em Y → busca Z")
- Fonte legal (lei/norma)
- Data da última revisão da informação

### RF06 — Disclaimer e termos de uso
- Exibido de forma clara antes de iniciar a triagem (não escondido em rodapé)
- Texto mínimo: "Esta é uma triagem informativa e não substitui aconselhamento jurídico ou confirmação oficial. Sempre confirme as informações no canal oficial indicado."

### RF07 — Acessibilidade de linguagem
- Frases curtas, sem juridiquês
- Considerar leitura em voz alta (text-to-speech) como stretch goal do MVP, não bloqueante

---

## 3. Requisitos não-funcionais

- **Privacidade por design**: nenhuma tabela do banco deve ter campos de CPF, RG ou nome completo do usuário no MVP. Se precisar de sessão, usar identificador anônimo (UUID de sessão, sem PII).
- **Sem dado sensível em log**: logs de aplicação não devem registrar respostas de triagem completas com timestamp + IP combinados (risco de reidentificação).
- **Base de conhecimento versionada**: cada item da base tem campo de última atualização; deve ser fácil auditar quando algo foi revisado.
- **Disponibilidade**: MVP não precisa de SLA alto, é validação de conceito — mas deploy deve ser estável o suficiente pra demo (Vercel/Railway conforme stack já usado).

---

## 4. Base de conhecimento (schema)

### 4.1 — Schema de cada item

```typescript
interface DireitoItem {
  id: string;
  nome_popular: string;
  categoria_vida: 'familia_crianca' | 'idoso' | 'pcd' | 'saude_mental' |
                  'trabalho_acidente' | 'situacao_rua' | 'violencia_domestica' | 'divida_credito';
  natureza: 'beneficio' | 'servico';
  criterios_elegibilidade: string; // linguagem simples
  documentos_necessarios: string[];
  canal_solicitacao: {
    tipo: 'app_meu_inss' | 'app_cadunico' | 'app_pe_de_meia' | 'app_fgts' |
          'site_especifico' | 'presencial' | 'telefone';
    detalhe: string; // ex: "Meu INSS", "CRAS mais próximo", "Disque 180"
  };
  passo_a_passo: string[]; // sequência de ações
  fonte_legal: string; // ex: "Lei 8.742/93, art. 20"
  prioridade_base: 1 | 2 | 3 | 4 | 5; // 1 = mais urgente/fácil
  ultima_revisao: string; // ISO date
  abrangencia: 'federal' | 'estadual_variavel';
}
```

### 4.2 — Lista de itens a popular no MVP (~20 itens)

**Benefícios/auxílios conhecidos:**
1. Bolsa Família — `familia_crianca` — federal
2. BPC/LOAS idoso — `idoso` — federal
3. BPC/LOAS PCD — `pcd` — federal
4. Seguro-Desemprego — `trabalho_acidente` — federal
5. Auxílio-Doença / Incapacidade Temporária — `trabalho_acidente` — federal
6. Farmácia Popular — `familia_crianca` (ou categoria geral de saúde) — federal
7. Pé-de-Meia — `familia_crianca` — federal

**Menos visíveis:**
8. Seguro-Defeso — `trabalho_acidente` — federal
9. Auxílio-Reclusão — `familia_crianca` — federal
10. Pensão por Morte Rural — `idoso` / `familia_crianca` — federal
11. Isenção IPI/ICMS carro PCD — `pcd` — federal (ICMS varia por estado, sinalizar)
12. Tarifa Social de Água/Energia — `situacao_rua` (ou categoria geral) — federal/estadual_variavel
13. Restituição de IR não sacada — categoria geral — federal
14. Meia-entrada / Passe Livre PCD — `pcd` — estadual_variavel
15. Saque-Aniversário FGTS — categoria geral — federal
16. Novo Desenrola Brasil — `divida_credito` — federal

**Saúde mental:**
17. CAPS — `saude_mental` — servico — federal (rede SUS)
18. Auxílio-Doença por transtorno mental — `saude_mental` — federal
19. Estabilidade após licença psiquiátrica — `saude_mental` — federal

**PCD adicional:**
20. Vaga reservada em emprego (Lei de Cotas) — `pcd` — federal
21. Prioridade em fila INSS/CadÚnico — `pcd` — federal

**Trabalho:**
22. Estabilidade após acidente de trabalho — `trabalho_acidente` — federal
23. CAT — `trabalho_acidente` — federal
24. Adicional de insalubridade/periculosidade — `trabalho_acidente` — federal
25. Auxílio-Acidente — `trabalho_acidente` — federal

**Violência doméstica:**
26. Bolsa Família prioridade mulher em violência — `violencia_domestica` — federal
27. Medida protetiva (Lei Maria da Penha) — `violencia_domestica` — federal
28. Casa da Mulher Brasileira — `violencia_domestica` — servico — federal

**Situação de rua:**
29. CadÚnico sem endereço fixo — `situacao_rua` — federal
30. Documentação civil gratuita — `situacao_rua` — federal

> Nota: a lista final pode ser reduzida pra ~20 itens mais robustos em vez de 30 rasos — priorizar qualidade da curadoria sobre quantidade. Decisão de corte fica com Gabriel durante a implementação.

---

## 5. Arquitetura técnica

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│  Frontend   │─────▶│   Backend    │─────▶│  LLM (Claude)    │
│  React/Vite │      │  Node/Fastify│      │  via API         │
│  Chat UI    │◀─────│  ou FastAPI  │◀─────│  + RAG           │
└─────────────┘      └──────┬───────┘      └─────────────────┘
                             │
                             ▼
                     ┌───────────────┐
                     │   Supabase    │
                     │  (base de     │
                     │  conhecimento)│
                     └───────────────┘
```

**Stack sugerida (alinhada ao stack já dominado):**
- Frontend: React + Vite + Tailwind
- Backend: Node.js + Fastify (ou FastAPI se preferir Python pro RAG)
- Banco: Supabase (Postgres) — tabela `direitos_itens` seguindo schema da seção 4.1
- RAG: embeddings da base de conhecimento (pgvector no Supabase, ou solução simples de similarity search) + **Google Gemini API (tier free) pra geração conversacional e embeddings** — modelo padrão do MVP por questão de custo. Trocar para Claude API é um upgrade de fase futura, quando houver crédito disponível; a lógica de prompt/RAG deve ser desacoplada do provedor pra facilitar essa troca depois (não hardcode chamadas específicas do SDK do Gemini no meio da lógica de negócio — isolar numa camada de abstração tipo `llmProvider.ts`)
- Deploy: Vercel (frontend) + Railway (backend), conforme stack já usado em outros projetos

---

## 6. Fluxo de conversa (esqueleto)

1. Tela inicial: disclaimer + botão "Começar"
2. Sistema pergunta de forma acolhedora e incremental (não todas de uma vez): situação de trabalho, moradia, saúde, família
3. A cada resposta, o sistema pode já ir refinando candidatos internamente (não precisa expor isso ao usuário)
4. Ao final, apresenta resultado como "linha de vida": item 1 (mais urgente/fácil) → item 2 → item 3...
5. Cada item expansível pra mostrar ficha completa (RF05)
6. Encerramento com reforço do disclaimer e sugestão de fontes oficiais pra confirmar

---

## 7. Critérios de aceite do MVP

- [ ] Usuário completa uma triagem do início ao fim sem precisar informar CPF/RG/nome
- [ ] Sistema retorna pelo menos 1 item relevante pra pelo menos 3 perfis de teste diferentes (ex: mãe solo desempregada; idoso com deficiência; trabalhador informal acidentado)
- [ ] Cada item retornado exibe ficha completa conforme RF05
- [ ] Resultado é apresentado em ordem de prioridade, não lista solta
- [ ] Disclaimer aparece antes do início da triagem
- [ ] Base de conhecimento tem no mínimo 20 itens carregados e revisáveis

---

## 8. Notas de implementação para o Claude Code

- Comece pelo schema do banco (Supabase) e populamento da base de conhecimento — é a fundação de tudo.
- Depois, monte o motor de triagem (backend + RAG) e teste via script/CLI antes de plugar frontend.
- Frontend por último, reaproveitando padrões de UI já usados em projetos anteriores do usuário (ver stack React/Tailwind já em uso).
- Não implementar nenhuma feature de Fase 2 (WhatsApp, validação por CPF, alerta comunitário) — está fora de escopo deste SDD.
- Em caso de dúvida sobre incluir ou não um dado sensível, a resposta padrão é: não incluir.
- **LLM padrão do MVP: Gemini API (tier free)**, não Claude API — ver seção 5. Abstrair a camada de LLM pra facilitar troca de provider no futuro.
- **Estruturação obrigatória do projeto:**
  - Organizar em módulos claros (ex: `/db`, `/rag`, `/backend`, `/frontend`), sem lógica misturada em arquivos únicos gigantes
  - Documentar cada módulo com um README curto explicando responsabilidade e como rodar
  - Nomear variáveis, funções e arquivos em português ou inglês de forma consistente (escolher um e manter em todo o projeto, não misturar)
  - Commits pequenos e descritivos, seguindo o padrão que o usuário já usa em outros projetos (ex: Conventional Commits)
  - Antes de considerar uma etapa concluída, rodar testes básicos manuais (ou automatizados, se o tempo permitir) confirmando que os critérios de aceite da seção 7 estão sendo atendidos progressivamente
