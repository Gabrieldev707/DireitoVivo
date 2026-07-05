# Brief do Projeto — "Direito Vivo" ou "Meu Direito" (nome em decisão final)

> Assistente de IA que faz triagem de benefícios, direitos e serviços públicos que a pessoa provavelmente tem acesso mas não sabe que existe — com foco especial em quem tá em situação de vulnerabilidade.

**Escopo geográfico: Brasil todo.** Itens federais entram completos; itens que variam por estado/município entram como "existe, procure sua prefeitura/órgão estadual" no MVP (mapeamento das 27 unidades fica pra Fase 2).

---

## MVP COMPLETO (resumo executivo)

### O que entra na Fase 1 (MVP das férias)
1. Chat web (não WhatsApp — API oficial fica pra fase 2)
2. Triagem 100% anônima — **sem coletar CPF, RG ou nome**
3. ~14-20 itens curados (lista completa na seção 4), cobrindo Brasil inteiro
4. Categorização por situação de vida (não por nome de programa)
5. Cada item com ficha completa: critério, documentos, canal de solicitação, passo a passo, fonte legal
6. Disclaimer/termos de uso visíveis desde o início
7. **Nova funcionalidade: "linha de vida" (priorização)** — em vez de listar todos os direitos encontrados de uma vez, o sistema ordena por urgência/facilidade e sugere "comece por aqui, depois vá pro próximo". Resolve o problema de sobrecarga de informação em quem já tá vulnerável.

### O que fica pra Fase 2 (pós-MVP)
1. WhatsApp como canal adicional (via API oficial)
2. Validação real via CPF/documento — só com convênio institucional (governo/CRAS), com segurança completa pra dado sensível
3. Aprofundar itens estaduais/municipais (as 27 unidades federativas mapeadas individualmente)
4. Alerta comunitário de risco (clima/enchente/onda de calor) — mesmo motor de IA + dados públicos, eixo diferente
5. Loop de retorno — follow-up pra saber se a pessoa conseguiu acessar o benefício
6. Possível parceria com CRAS/prefeitura/extensão universitária estadual pra distribuição real

---

## 1. Motivação / Tese central

Não é "mais um app de consulta de Bolsa Família". A dor real que o projeto ataca é:
**direito que existe, tá na lei, tá disponível — mas a pessoa não tem visibilidade de que pode acessar.**

Grande parte do público provável do app é gente vulnerável (baixa renda, baixa escolaridade, PCD, saúde mental fragilizada, situação de violência doméstica, etc). Isso muda decisões de design, linguagem e segurança do produto inteiro — não é só "mais um usuário genérico".

---

## 2. Decisões já fechadas

| Tema | Decisão |
|---|---|
| Canal de entrada (MVP) | **Site** (chat web). WhatsApp fica pra fase 2, quando já tiver produto validado pra facilitar aprovação de API oficial. |
| Dado sensível (CPF/RG) | **MVP não coleta nem armazena CPF, RG ou nome.** Triagem 100% anônima, baseada em autodeclaração (idade, renda, situação familiar, profissão etc). Validação oficial via documento fica pra fase 2, com convênio institucional. |
| Escopo de itens | ~14-20 itens no MVP (ver seção 4), cobrindo tanto benefícios "famosos" quanto "escondidos". |
| Categorização | Por **situação de vida**, não por nome de programa — porque é assim que o usuário vulnerável pensa (ver seção 3). |
| Fase 2 (futuro) | Explorar também a ideia de "alerta comunitário" (clima/risco via dados públicos) usando o mesmo motor de IA + dados públicos. Possível gancho pro projeto de extensão universitária com o governo estadual da Paraíba. |

---

## 3. Estrutura de categorização (por situação de vida)

- 👶 Família / criança
- 👴 Idoso
- ♿ PCD
- 🧠 Saúde mental
- 💼 Trabalho / acidente / segurança do trabalho
- 🏠 Situação de rua / extrema pobreza
- 🚨 Violência doméstica
- 💰 Dívida / crédito

O usuário descreve a vida dele em linguagem natural; o sistema navega pelas categorias por trás, sem exigir que ele saiba o "nome oficial" do que precisa.

---

## 4. Lista de itens do MVP (rascunho)

### Duas naturezas de item (importante pro schema):
- **Benefício**: tem requerimento formal, critério de elegibilidade, resultado tangível (dinheiro, isenção, documento).
- **Serviço/rede de apoio**: não tem requerimento — é "existe, é grátis, vai lá" (ex: CAPS, Casa da Mulher Brasileira).

### Benefícios/auxílios conhecidos
- Bolsa Família
- BPC/LOAS (idoso **e** PCD — deixar claro que não é só idoso)
- Seguro-Desemprego
- Auxílio-Doença / Auxílio por Incapacidade Temporária
- Farmácia Popular
- Pé-de-Meia

### Menos visíveis / "joia escondida"
- Seguro-Defeso (pescador artesanal)
- Auxílio-Reclusão
- Pensão por Morte Rural (trabalhador sem carteira assinada)
- Isenção IPI/ICMS na compra de carro pra PCD
- Tarifa Social de Água/Energia
- Restituição de Imposto de Renda retido/não sacada
- Meia-entrada e Passe Livre interestadual pra PCD
- Saque-Aniversário FGTS (vs. saque-rescisão)
- Novo Desenrola Brasil (renegociação de dívida — MP de 2026, sucessor do Desenrola/Descomplica Brasil)

### Saúde mental / psicossocial
- CAPS (Centro de Atenção Psicossocial) — serviço, não benefício
- Auxílio-Doença por transtorno mental (INSS reconhece, mas exige laudo — processo pouco explicado)
- Licença médica psiquiátrica e estabilidade no emprego

### PCD (expandido)
- BPC pra PCD (reforçar que não é só idoso)
- Vaga reservada em emprego (Lei de Cotas 8.213/91)
- Passe Livre + acompanhante gratuito em transporte interestadual
- Isenção IPTU/IPVA pra PCD (varia por município/estado)
- Prioridade em fila de INSS/CadÚnico

### Trabalho / segurança do trabalhador
- Estabilidade após acidente de trabalho (12 meses garantidos por lei)
- CAT — Comunicação de Acidente de Trabalho (direito de exigir emissão)
- Adicional de insalubridade/periculosidade
- Auxílio-Acidente (INSS, diferente do auxílio-doença)

### Violência doméstica
- Bolsa Família com prioridade pra mulher em situação de violência
- Medida protetiva (Lei Maria da Penha)
- Casa da Mulher Brasileira / rede de acolhimento — serviço, não benefício

### Situação de rua / extrema vulnerabilidade
- CadÚnico sem endereço fixo (usando endereço de referência tipo CRAS)
- Documentação civil gratuita (2ª via de RG/certidão)

---

## 5. Canal de solicitação por item (schema já mapeado)

| Canal | Itens |
|---|---|
| **App Meu INSS** | BPC/LOAS, Auxílio-Doença, Auxílio-Acidente, Auxílio-Reclusão, Pensão por Morte, histórico de CAT |
| **App CadÚnico (Caixa)** | Bolsa Família, cadastro geral |
| **App Pé-de-Meia (Caixa/MEC)** | Pé-de-Meia |
| **App FGTS (Caixa)** | Saque-Aniversário |
| **Simulador site Min. da Fazenda** | Novo Desenrola Brasil |
| **Presencial (farmácia credenciada)** | Farmácia Popular |
| **Presencial (unidade de saúde)** | CAPS |
| **Presencial / disque 180** | Casa da Mulher Brasileira, medida protetiva |
| **Varia por estado/prefeitura** | Passe Livre PCD, meia-entrada, isenção IPTU/IPVA |

Ideia forte: o app não só diz "você tem direito a X", mas ensina o caminho dentro do app oficial (ex: "abre o Meu INSS → Novo Pedido → busca 'Auxílio por Incapacidade' → anexa laudo").

---

## 6. Pontos de qualidade / confiança do produto

1. **Fonte legal citada** — cada item referencia a lei/norma (ex: "Lei 8.742/93, art. X"). Aumenta confiança e reduz risco de responsabilidade.
2. **Atualização da base** — processo (mesmo manual no MVP) de revisão periódica. Regras mudam (ex: Desenrola → Novo Desenrola em maio/2026).
3. **Linguagem acessível** — frases curtas, sem juridiquês. Considerar opção de áudio pra baixa alfabetização.
4. **Disclaimer claro** — é triagem orientativa, não parecer jurídico nem garantia de aprovação.
5. **Loop de retorno** — follow-up simples pra saber se o usuário conseguiu acessar o benefício, validando a eficácia da triagem.

---

## 7. Arquitetura técnica (rascunho, a refinar)

- **Frontend**: Chat web (React — stack já dominado)
- **Backend**: Node/FastAPI
- **IA**: Claude/Gemini fazendo triagem conversacional via RAG sobre a base de conhecimento curada
- **Banco de dados**: Supabase
- **Base de conhecimento**: estrutura por item = `{categoria_vida, nome, natureza (benefício/serviço), criterios_elegibilidade, documentos_necessarios, canal_solicitacao, passo_a_passo, fonte_legal, ultima_atualizacao}`

---

## 8. Em aberto (próximos alinhamentos)

- [ ] Nome definitivo: **Direito Vivo** vs **Meu Direito** (favorito sugerido: Direito Vivo, por ser mais autoral e carregar a tese do projeto)
- [ ] Ficha completa de cada item (critério + documentos + passo a passo + fonte legal)
- [ ] Desenho do fluxo de conversa da triagem (como perguntar sem parecer interrogatório)
- [ ] Desenho da "linha de vida" — lógica de priorização (o que conta como "mais urgente/fácil")
- [ ] Estratégia de manutenção/atualização da base de dados (revisão a cada 2-3 meses)
- [ ] Validar se algo parecido já existe no Brasil (evitar reinventar a roda)
- [x] ~~Escopo geográfico~~ — decidido: Brasil todo
- [x] ~~Segurança de dado sensível~~ — decidido: MVP não coleta CPF/RG, triagem anônima
- [x] ~~Canal de entrada~~ — decidido: site no MVP, WhatsApp na fase 2
