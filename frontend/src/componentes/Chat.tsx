import { useEffect, useRef, useState } from 'react';
import type { MensagemChat } from '../tipos';

interface PropriedadesChat {
  mensagens: MensagemChat[];
  enviando: boolean;
  erro?: string;
  aoEnviar: (texto: string) => void;
}

const SUGESTOES_RESPOSTA = [
  'Estou desempregado e sem renda familiar',
  'Trabalho sem carteira assinada',
  'Moro com filhos pequenos e preciso de apoio',
  'Cuido de pessoa idosa ou PCD',
  'Preciso de tratamento ou remédio pelo SUS',
  'Tenho dívidas que comprometem minha casa',
  'Quero entender BPC/LOAS e Bolsa Família',
  'Não sei exatamente por onde começar',
];

const GARANTIAS_CHAT = [
  'Não informe CPF, RG, nome completo ou endereço.',
  'A conversa fica no navegador enquanto a aba está aberta.',
  'A resposta é triagem informativa e precisa ser confirmada no canal oficial.',
];

const PASSOS_TRIAGEM = ['Situação', 'Critérios', 'Direitos', 'Canais'];

export function Chat({ mensagens, enviando, erro, aoEnviar }: PropriedadesChat) {
  const [texto, setTexto] = useState('');
  const [falandoIndice, setFalandoIndice] = useState<number | null>(null);
  const listaMensagens = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elemento = listaMensagens.current;
    if (!elemento) return;
    elemento.scrollTo({ top: elemento.scrollHeight, behavior: 'smooth' });
  }, [mensagens.length, enviando]);

  function enviar() {
    const limpo = texto.trim();
    if (!limpo || enviando) return;
    aoEnviar(limpo);
    setTexto('');
  }

  function enviarSugestao(sugestao: string) {
    if (enviando) return;
    aoEnviar(sugestao);
  }

  function alternarVoz(conteudo: string, indice: number) {
    if (!('speechSynthesis' in window)) {
      alert('Seu navegador não possui suporte para leitura em voz alta.');
      return;
    }

    if (falandoIndice === indice) {
      window.speechSynthesis.cancel();
      setFalandoIndice(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(conteudo);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    utterance.onend = () => setFalandoIndice(null);
    utterance.onerror = () => setFalandoIndice(null);

    setFalandoIndice(indice);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <section aria-label="Conversa de triagem de direitos" className="grid grid-cols-1 gap-6 animate-fade-in pb-8 lg:grid-cols-[21rem_1fr]">
      <aside className="chat-guide-panel">
        <div className="gov-ribbon" aria-hidden="true" />
        <div className="p-5">
          <div className="chat-signal" aria-hidden="true">
            <span className="chat-signal__ring" />
            <span className="chat-signal__core">
              <svg className="h-8 w-8 text-[#FFCD07]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 12l2 2 4-4m5.5-4.5A11.8 11.8 0 0 1 12 3 11.8 11.8 0 0 1 3.5 5.5 12 12 0 0 0 3 9c0 5.4 3.7 10 9 11.3 5.3-1.3 9-5.9 9-11.3 0-1.2-.2-2.3-.5-3.5z" />
              </svg>
            </span>
          </div>

          <div className="mt-5">
            <div className="gov-kicker text-white">
              <span className="h-2 w-2 rounded-full bg-[#FFCD07]" />
              Triagem anônima
            </div>
            <h2 className="mt-2 text-xl font-black text-white">Atendimento digital de cidadania</h2>
            <p className="mt-2 text-sm leading-relaxed text-blue-100">
              Responda como contaria para um atendente público. A IA faz perguntas para organizar direitos possíveis e próximos canais.
            </p>
          </div>

          <ol className="mt-5 grid grid-cols-2 gap-2">
            {PASSOS_TRIAGEM.map((passo, indice) => (
              <li key={passo} className="rounded border border-white/12 bg-white/8 p-3 text-xs text-white">
                <span className="block text-lg font-black text-[#FFCD07]">{indice + 1}</span>
                <span className="font-bold">{passo}</span>
              </li>
            ))}
          </ol>

          <div className="mt-5 space-y-2">
            {GARANTIAS_CHAT.map((garantia) => (
              <div key={garantia} className="flex gap-2 rounded border border-emerald-300/25 bg-emerald-300/10 p-3 text-xs font-semibold leading-relaxed text-emerald-50">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#6ee787]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 13l4 4L19 7" />
                </svg>
                <span>{garantia}</span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-xs font-black uppercase tracking-wide text-blue-100">
              Começar por uma situação
            </h3>
            <div className="mt-3 flex flex-col gap-2">
              {SUGESTOES_RESPOSTA.map((sugestao) => (
                <button
                  key={sugestao}
                  type="button"
                  onClick={() => enviarSugestao(sugestao)}
                  disabled={enviando}
                  className="suggestion-button"
                >
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#FFCD07]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M12 6v12m6-6H6" />
                  </svg>
                  <span>{sugestao}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <div className="chat-shell flex min-h-[44rem] flex-col overflow-hidden">
        <div className="border-b border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-[#1351B4] text-white">
                <svg className="h-7 w-7 text-[#FFCD07]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black text-[#071D41]">Chat de triagem</h2>
                  <span className="online-pill">
                    <span className="h-2 w-2 rounded-full bg-[#168821]" />
                    Online
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  Conte o essencial. A IA pergunta o necessário e monta uma rota de direitos.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold leading-relaxed text-blue-950">
              Modo anônimo ativo · sem CPF ou RG
            </div>
          </div>
        </div>

        <div
          ref={listaMensagens}
          className="chat-messages flex-1 space-y-5 overflow-y-auto p-4 md:p-6"
          aria-live="polite"
        >
          {mensagens.map((mensagem, indice) => {
            const ehUsuario = mensagem.papel === 'usuario';

            return (
              <div key={indice} className={`flex gap-3 ${ehUsuario ? 'justify-end' : 'justify-start'}`}>
                {!ehUsuario && (
                  <div className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[#1351B4] text-white shadow-sm">
                    <svg className="h-5 w-5 text-[#FFCD07]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 12l2 2 4-4m5.5-4.5A11.8 11.8 0 0 1 12 3 11.8 11.8 0 0 1 3.5 5.5 12 12 0 0 0 3 9c0 5.4 3.7 10 9 11.3 5.3-1.3 9-5.9 9-11.3 0-1.2-.2-2.3-.5-3.5z" />
                    </svg>
                  </div>
                )}

                <div className={`max-w-[92%] sm:max-w-[78%] ${ehUsuario ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
                  <span className="px-1 text-xs font-black text-slate-500">
                    {ehUsuario ? 'Você' : 'Direito Vivo'}
                  </span>
                  <div className={`message-bubble ${ehUsuario ? 'message-bubble--user' : 'message-bubble--assistant'}`}>
                    {mensagem.conteudo}
                  </div>

                  {!ehUsuario && (
                    <button
                      type="button"
                      onClick={() => alternarVoz(mensagem.conteudo, indice)}
                      className={`listen-button ${falandoIndice === indice ? 'listen-button--active' : ''}`}
                      title="Ouvir resposta em voz alta"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.54 8.46a5 5 0 0 1 0 7.08m2.82-9.9a9 9 0 0 1 0 12.72M5.59 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1.59l4.7-4.7C10.92 3.66 12 4.11 12 5v14c0 .89-1.08 1.34-1.71.71L5.59 15z" />
                      </svg>
                      {falandoIndice === indice ? 'Parar leitura' : 'Ouvir'}
                    </button>
                  )}
                </div>

                {ehUsuario && (
                  <div className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center rounded bg-white text-[#1351B4] ring-1 ring-slate-200">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}

          {enviando && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[#1351B4] text-white">
                <svg className="h-5 w-5 animate-spin text-[#FFCD07]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 0 1 4 12H0c0 3.04 1.14 5.82 3 7.94l3-2.65z" />
                </svg>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm">
                Analisando direitos, critérios e canais públicos compatíveis...
              </div>
            </div>
          )}

          {erro && (
            <div role="alert" className="rounded-lg border-2 border-red-300 bg-red-50 p-4 text-red-950">
              <p className="text-sm font-black">Ocorreu um erro na consulta</p>
              <p className="mt-1 text-xs leading-relaxed">{erro}</p>
            </div>
          )}
        </div>

        <form
          onSubmit={(evento) => {
            evento.preventDefault();
            enviar();
          }}
          className="border-t border-slate-200 bg-white p-4"
        >
          <label htmlFor="entrada-chat" className="sr-only">
            Escreva sua resposta para a triagem
          </label>
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
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
              rows={3}
              maxLength={2000}
              placeholder="Ex.: estou desempregado, moro com 3 pessoas, tenho uma criança pequena e pago aluguel..."
              className="min-h-24 flex-1 resize-none rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-base leading-relaxed text-slate-900 transition placeholder:text-slate-400 focus:border-[#1351B4] focus:outline-none focus:ring-4 focus:ring-[#1351B4]/10"
            />
            <button
              type="submit"
              disabled={enviando || texto.trim() === ''}
              className="btn-gov-primary min-h-12 px-6 py-3 disabled:opacity-45"
              title="Enviar mensagem"
            >
              Enviar
              <svg className="h-5 w-5 text-[#FFCD07]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-500">
            Pressione Enter para enviar ou Shift+Enter para quebrar linha.
          </p>
        </form>
      </div>
    </section>
  );
}
