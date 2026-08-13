import type { MensagemChat, RespostaTriagem } from './tipos';

export function montarUrlApi(caminho: string): string {
  const origem = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, '') ?? '';
  const rota = caminho.startsWith('/') ? caminho : `/${caminho}`;
  return `${origem}${rota}`;
}

export async function enviarTriagem(
  mensagens: MensagemChat[],
  aceiteDemo: boolean,
): Promise<RespostaTriagem> {
  const resposta = await fetch(montarUrlApi('/api/triagem'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mensagens, aceite_demo: aceiteDemo }),
  });
  if (!resposta.ok) {
    const corpo = (await resposta.json().catch(() => null)) as { erro?: string } | null;
    throw new Error(corpo?.erro ?? 'Não consegui falar com o servidor. Tente de novo.');
  }
  return (await resposta.json()) as RespostaTriagem;
}
