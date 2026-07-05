import { useEffect, useRef, useState } from 'react';
import type { MensagemChat } from '../tipos';

interface PropriedadesChat {
  mensagens: MensagemChat[];
  enviando: boolean;
  erro?: string;
  aoEnviar: (texto: string) => void;
}

export function Chat({ mensagens, enviando, erro, aoEnviar }: PropriedadesChat) {
  const [texto, setTexto] = useState('');
  const fimDaLista = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fimDaLista.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens.length, enviando]);

  function enviar() {
    const limpo = texto.trim();
    if (!limpo || enviando) return;
    aoEnviar(limpo);
    setTexto('');
  }

  return (
    <section aria-label="Conversa de triagem" className="flex flex-col gap-4">
      <div className="space-y-3" aria-live="polite">
        {mensagens.map((mensagem, indice) => (
          <div
            key={indice}
            className={mensagem.papel === 'usuario' ? 'flex justify-end' : 'flex justify-start'}
          >
            <p
              className={
                'max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 leading-relaxed shadow-sm ' +
                (mensagem.papel === 'usuario'
                  ? 'rounded-br-md bg-emerald-700 text-white'
                  : 'rounded-bl-md bg-white text-stone-800 ring-1 ring-stone-200')
              }
            >
              {mensagem.conteudo}
            </p>
          </div>
        ))}

        {enviando && (
          <p className="w-fit rounded-2xl rounded-bl-md bg-white px-4 py-3 text-stone-500 ring-1 ring-stone-200">
            escrevendo<span className="animate-pulse">...</span>
          </p>
        )}
        {erro && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            {erro}
          </p>
        )}
        <div ref={fimDaLista} />
      </div>

      <form
        onSubmit={(evento) => {
          evento.preventDefault();
          enviar();
        }}
        className="sticky bottom-4 flex items-end gap-2 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-stone-200"
      >
        <label htmlFor="entrada-chat" className="sr-only">
          Escreva sua resposta
        </label>
        <textarea
          id="entrada-chat"
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
          onKeyDown={(evento) => {
            if (evento.key === 'Enter' && !evento.shiftKey) {
              evento.preventDefault();
              enviar();
            }
          }}
          rows={2}
          maxLength={2000}
          placeholder="Escreva aqui com suas palavras..."
          className="min-h-[3rem] flex-1 resize-none rounded-xl border-0 bg-transparent px-3 py-2 text-base leading-relaxed focus:outline-none"
        />
        <button
          type="submit"
          disabled={enviando || texto.trim() === ''}
          className="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white transition enabled:hover:bg-emerald-800 disabled:opacity-40 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
        >
          Enviar
        </button>
      </form>
    </section>
  );
}
