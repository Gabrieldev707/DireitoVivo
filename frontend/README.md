# Frontend do Direito Vivo

Demonstração independente em React, Vite e Tailwind. O site oferece orientação sobre direitos e serviços brasileiros; não recebe pedidos, não decide elegibilidade e não representa um órgão público.

## Caminhos de uso

- `#inicio`: busca inicial, oito assuntos e três caminhos de entrada.
- `#direitos`: 30 fichas geradas de `db/seed/itens.json`, com busca por termos populares, filtros e ficha acessível.
- `#situacoes`: cenários guiados. Abrir uma prévia não envia o texto à IA.
- `#ajuda`: canais humanos, urgência e dúvidas. Funciona sem API.
- `#conversa`: demonstração guiada. O primeiro envio exige aviso e aceite explícito.

Os hashes antigos `#catalogo`, `#cenarios` e `#chat` ainda abrem as telas equivalentes. A URL não inclui relato nem resultado. Voltar e avançar seguem o histórico; a conversa permanece em memória ao navegar.

## Privacidade e limites

Não há conta nem histórico de conversa salvo no banco do Direito Vivo. O texto enviado na conversa passa pela API e é processado por um provedor externo de IA. A interface orienta a não informar nome, CPF, endereço, telefone ou outros dados pessoais. Catálogo, situações e ajuda não exigem aceite. A resposta é apenas informativa e deve ser confirmada no canal competente.

O alto contraste é salvo em `localStorage`. A conversa e o resultado ficam apenas em memória durante a sessão. A API rejeita triagens sem `aceite_demo: true`; isso não substitui a revisão de privacidade e segurança antes de uma publicação.

## Desenvolvimento local

Na raiz do repositório:

```bash
npm install
npm run api:dev
npm run front:dev
```

O frontend abre em `http://localhost:5173/`; o Vite encaminha `/api` para `http://localhost:3333`. Rodar apenas o frontend permite consultar catálogo e ajuda, mas a conversa precisa da API. Não use relatos reais em ambiente de desenvolvimento.

```bash
npm test
npm run typecheck
npm run build
npm run db:catalogo
```

`db:catalogo` regenera `frontend/src/dados/catalogoDireitos.ts` a partir do seed. O texto dos canais humanos fica em `src/dados/canaisAjuda.ts` com fonte e data de verificação. O relatório [da auditoria](../docs/auditorias/2026-09-29-repaginacao-e-ajuda.md) registra testes, revisão visual e limites.
