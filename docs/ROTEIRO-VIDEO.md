# Roteiro do vídeo demo — LinkedIn

Duração alvo: **60 a 90 segundos**. No LinkedIn a maioria assiste sem som e
desiste nos primeiros 3 segundos, então: legenda embutida, primeiro quadro já
mostrando o produto, e o número forte logo no começo.

## Antes de gravar (checklist)

```bash
# 1. Supabase acorda? (o free tier pausa por inatividade)
npm run rag:testes          # se os 3 perfis passam, backend está de pé

# 2. Servidores
npm run api:dev             # terminal 1
npm run front:dev           # terminal 2

# 3. Navegador
#    - janela em 1280x800 (não gravar tela ultrawide, corta no feed)
#    - zoom em 100%
#    - aba anônima, sem extensões que poluam a tela
#    - tema claro (a paleta creme/verde rende melhor comprimida)
```

Grave **duas ou três tomadas seguidas** enquanto a cota está fresca. O free tier
do Gemini dá 5 requisições por minuto: se travar no meio, espere um minuto em
vez de repetir na hora.

## Sequência de gravação

| # | Tela | O que fazer | Duração |
|---|---|---|---|
| 1 | Home | Abrir já rolado no hero. Deixar parado 2s. | 3s |
| 2 | Chat | Clicar em "Iniciar triagem anônima". Mostrar o banner de anonimato. | 4s |
| 3 | Chat | Digitar o relato (abaixo). Enviar. **Mostrar o "digitando…"** — é o que faz parecer conversa de verdade. | 12s |
| 4 | Chat | Deixar a IA perguntar e responder mais 1–2 vezes. Cortar as esperas na edição. | 15s |
| 5 | Resultado | Linha de vida montada. Rolar devagar pelos itens numerados. | 10s |
| 6 | Resultado | Expandir a ficha do item 1: documentos, onde pedir, passo a passo. | 12s |
| 7 | Catálogo | Clicar em "Direitos 30". Mostrar a busca e filtrar por categoria. | 8s |
| 8 | Final | Voltar à home, parar no aviso "Projeto independente". | 3s |

### Fala de entrada (colar no chat)

```
Sou mãe solteira, dois filhos de 3 e 6 anos. Fui demitida sem justa causa faz
dois meses, trabalhava de carteira assinada uns 2 anos. Hoje só uns 400 reais
de bico, moro de aluguel só eu e as crianças, e todo mundo com saúde boa.
```

Esse relato cobre os quatro pontos que o prompt exige, então a triagem fecha
rápido — bom para vídeo. Se quiser mostrar a IA **perguntando**, mande só a
primeira frase e responda o resto conforme ela pedir.

## O que narrar (ou legendar)

Ordem de impacto, não ordem cronológica:

1. **O problema, em uma frase.** "Milhões de brasileiros não recebem benefícios
   que já são deles por lei — porque ninguém explicou que existem."
2. **O que é.** "Uma triagem por conversa. Sem cadastro, sem CPF, sem login."
3. **A decisão técnica que diferencia.** "Nada é armazenado: a API é stateless,
   o histórico vive só na aba, e o log não registra o corpo da requisição.
   Privacidade não é banner, é arquitetura."
4. **O resultado.** "No fim ela recebe uma ordem: comece por aqui, depois isso —
   com documentos, canal e passo a passo de cada um."
5. **Honestidade.** "É orientação, não decisão. Projeto independente, sem
   vínculo com o governo."

## O que NÃO dizer

- Não chame de "oficial", "gov" ou "parceria com o governo" — não é, e o
  produto agora declara isso na tela.
- Não prometa que a pessoa "vai receber" nada. O próprio prompt proíbe isso.
- Não invente número de usuário. O projeto não foi lançado.

## Texto do post (rascunho)

> Passei as últimas semanas construindo o **Direito Vivo**: uma triagem
> conversacional que descobre benefícios e direitos públicos que a pessoa
> provavelmente tem — e não sabe que existem.
>
> A parte que mais me interessou não foi a IA. Foi decidir **não coletar nada**.
> Sem login, sem CPF, sem cadastro. A API é stateless, o histórico morre quando
> a aba fecha, e o log não registra o corpo da requisição — porque relato de
> triagem + IP + timestamp permite reidentificar alguém. Tem teste automatizado
> garantindo que o CPF não vaza pro log.
>
> Stack: React + Vite no front, Fastify na API, motor RAG com Gemini e busca
> semântica em pgvector. 60 testes automatizados. Provider de LLM abstraído por
> interface — trocar Gemini por Claude é criar um arquivo.
>
> Detalhe que eu não esperava: a IA fechava a triagem cedo demais, entregando
> 1 benefício quando havia 4. A correção não foi no modelo, foi no critério de
> parada — quatro perguntas que precisam estar respondidas antes de concluir.
> Um perfil saltou de 2 para 6 direitos encontrados.
>
> Projeto independente, código aberto, sem vínculo com o governo.
> [link do repositório]

Ajuste o tom para o teu — o rascunho evita adjetivo de mais e mantém um detalhe
técnico concreto, que costuma render mais comentário do que superlativo.
