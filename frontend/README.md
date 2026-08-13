# Frontend do Direito Vivo

Interface React + Vite da demonstração pública. A experiência é mobile-first, sem cadastro e organizada em quatro áreas:

1. **Início** — proposta direta, seis situações prioritárias e a rota `Conte → Confirme → Procure`.
2. **Situações** — 12 pontos de partida filtráveis, incluindo renda, cuidado, saúde, urgência e orientação geral.
3. **Direitos** — catálogo pesquisável com somente os 7 conteúdos publicáveis e suas fontes oficiais.
4. **Conversar** — orientação por IA com consentimento explícito, histórico somente na memória da aba e reenvio após falha.

O resultado separa possibilidade, critérios pendentes, documentos e próximo passo. Risco imediato abre uma tela própria com canais acionáveis antes de qualquer ação secundária.

## Privacidade e limites

- Sem login, cookie de sessão, analytics ou persistência da conversa.
- O aceite da demonstração vive somente no estado React.
- A interface orienta a não enviar nome, CPF, RG, endereço, telefone ou e-mail.
- O texto é processado por um provedor de IA e passa pelo mascaramento disponível no motor antes da chamada externa.
- A resposta não garante concessão; requisitos e prazos devem ser confirmados na fonte oficial.

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

A validação responsiva cobre 360, 390, 768, 1024 e 1440 px. A conversa usa `100dvh`, mantém somente o histórico como área vertical rolável e considera a área segura inferior do dispositivo.
