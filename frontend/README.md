# Frontend do Direito Vivo

Interface React + Vite da demonstração pública. A experiência é mobile-first, sem cadastro e organizada em quatro áreas:

1. **Início** — proposta direta, seis situações prioritárias e a rota `Conte → Confirme → Procure`.
2. **Situações** — 12 pontos de partida filtráveis, incluindo renda, cuidado, saúde, urgência e orientação geral.
3. **Direitos** — catálogo pesquisável com somente os 7 conteúdos publicáveis e suas fontes oficiais.
4. **Conversar** — orientação por IA com consentimento explícito, histórico somente na memória da aba e reenvio após falha.

A central de confiança complementa essas áreas em quatro rotas: `#acessibilidade`, `#privacidade`, `#termos` e `#sobre`.

O resultado separa possibilidade, critérios pendentes, documentos e próximo passo. Risco imediato abre uma tela própria com canais acionáveis antes de qualquer ação secundária.

## Privacidade e limites

- Sem login, cookie de sessão, analytics ou persistência da conversa.
- O aceite da demonstração vive somente no estado React.
- A interface orienta a não enviar nome, CPF, RG, endereço, telefone ou e-mail.
- O texto é processado por um provedor de IA e passa pelo mascaramento disponível no motor antes da chamada externa.
- A resposta não garante concessão; requisitos e prazos devem ser confirmados na fonte oficial.
- As preferências de acessibilidade são salvas no navegador; mensagens, áudio e transcrições não entram nesse armazenamento.

## Acessibilidade da conversa

- Modo guiado com respostas `Sim`, `Não`, `Não sei` e alternativa permanente de texto livre.
- Confirmação opcional antes de enviar texto e confirmação obrigatória para transcrição de voz.
- Leitura de respostas com velocidade lenta, normal ou rápida e leitura facilitada do resultado.
- Entrada por voz somente quando o navegador oferece Web Speech Recognition. O navegador ou o sistema pode usar serviço externo para reconhecer a fala; o Direito Vivo não grava nem envia arquivo de áudio ao próprio servidor.
- Histórico com semântica de log, estados de processamento anunciáveis e alvos interativos de pelo menos 44 px.

Compatibilidade e qualidade da Web Speech API variam por navegador, sistema, idioma, permissão e conexão. Digitação e respostas guiadas continuam disponíveis quando voz não existe ou falha.

## Executar localmente

```bash
npm run api:dev     # terminal 1 — http://localhost:3333
npm run front:dev   # terminal 2 — http://localhost:5173
```

## Gates

```bash
npm run test -w frontend
npm run typecheck -w frontend
npm run build -w frontend
```

A verificação automatizada de 13/08/2026 registrou **61 testes de frontend**. A inspeção visual cobriu 360×800, 390×844, 768×1024 e 1440×950 sem rolagem horizontal; a conversa usa `100dvh`, mantém somente o histórico como área vertical rolável e considera a área segura inferior do dispositivo.

Validação manual com NVDA, VoiceOver e TalkBack em dispositivos reais ainda não foi executada. Os testes automatizados e a inspeção de navegador não devem ser apresentados como certificação WCAG ou eMAG.
