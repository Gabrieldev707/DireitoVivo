import type { MensagemChat, RespostaTriagem } from './tipos';

export async function enviarTriagem(mensagens: MensagemChat[]): Promise<RespostaTriagem> {
  const resposta = await fetch('/api/triagem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mensagens }),
  });
  if (!resposta.ok) {
    const corpo = (await resposta.json().catch(() => null)) as { erro?: string } | null;
    throw new Error(corpo?.erro ?? 'Não consegui falar com o servidor. Tente de novo.');
  }
  return (await resposta.json()) as RespostaTriagem;
}
