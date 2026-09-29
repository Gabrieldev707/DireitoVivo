import { useEffect, useRef, useState } from 'react';
import type { MensagemChat } from '../tipos';

interface PropriedadesChat {
  mensagens: MensagemChat[];
  enviando: boolean;
  erro?: string;
  aoEnviar: (texto: string) => void;
  aoLimpar?: () => void;
  aoVoltar?: () => void;
  aoVerAjuda?: () => void;
  aoVerCatalogo?: () => void;
}

const SUGESTOES_RESPOSTA = [
  'Estou desempregado(a)',
  'Trabalho sem carteira',
  'Tenho filhos pequenos',
  'Cuido de idoso ou PCD',
  'Preciso do SUS',
  'Estou endividado(a)',
  'BPC / Bolsa Família',
  'Não sei por onde começar',
];

function IconeEnviar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.4 20.4L21 12 3.4 3.6l-.001 6.518L15 12 3.399 13.882l.001 6.518z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconeVoltar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconeAltoFalante() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M11 5L6 9H2v6h4l5 4V5z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path
        d="M15.5 8.5a5 5 0 010 7"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconeAviso() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 9v4m0 3h.01M4.72 19h14.56c1.44 0 2.34-1.55 1.62-2.8L13.62 4.2a1.88 1.88 0 00-3.24 0L3.1 16.2c-.72 1.25.18 2.8 1.62 2.8z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconeLimpar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M6 6l1 14a2 2 0 002 2h6a2 2 0 002-2l1-14"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Chat({ mensagens, enviando, erro, aoEnviar, aoLimpar, aoVoltar, aoVerAjuda, aoVerCatalogo }: PropriedadesChat) {
  const [texto, setTexto] = useState('');
  const [falandoIndice, setFalandoIndice] = useState<number | null>(null);
  const listaMensagens = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const elemento = listaMensagens.current;
    if (!elemento) return;
    const reduzido = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    elemento.scrollTo({ top: elemento.scrollHeight, behavior: reduzido ? 'auto' : 'smooth' });
  }, [mensagens.length, enviando]);

  // Textarea cresce até 4 linhas.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [texto]);

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
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
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

  const podeLimpar = mensagens.length > 1 && !enviando;

  return (
    <section aria-label="Conversa de triagem de direitos" className="pb-6">
      <h1 className="sr-only">Conversa guiada</h1>
      <div className="wa-chat" role="region">
        <header className="wa-chat__header">
          <button
            type="button"
            onClick={() => aoVoltar?.()}
            className="wa-chat__action md:hidden"
            aria-label="Voltar"
          >
            <IconeVoltar />
          </button>
          <div className="wa-chat__avatar" aria-hidden="true">DV</div>
          <div className="wa-chat__identity">
            <strong>Direito Vivo</strong>
            <span>{enviando ? 'digitando…' : 'Demonstração de orientação'}</span>
          </div>
          <div className="wa-chat__actions">
            {aoLimpar && (
              <button
                type="button"
                onClick={aoLimpar}
                disabled={!podeLimpar}
                className="wa-chat__action"
                aria-label="Limpar conversa"
                title="Limpar conversa"
                style={{ opacity: podeLimpar ? 1 : 0.45 }}
              >
                <IconeLimpar />
              </button>
            )}
          </div>
        </header>

        <div
          ref={listaMensagens}
          className="wa-chat__messages"
          aria-live="polite"
          aria-relevant="additions"
        >
          <div className="wa-chat__banner" role="note">
            <IconeAviso />
            <span>
              Não informe CPF, RG, nome completo ou endereço. O relato é processado por um
              provedor externo de IA. A resposta é orientativa — confirme no canal oficial.
            </span>
          </div>

          {mensagens.map((mensagem, indice) => {
            const ehUsuario = mensagem.papel === 'usuario';

            return (
              <div
                key={indice}
                className={`wa-row ${ehUsuario ? 'wa-row--user' : 'wa-row--bot'}`}
              >
                <div className={`wa-bubble ${ehUsuario ? 'wa-bubble--user' : 'wa-bubble--bot'}`}>
                  {mensagem.conteudo}
                  <span className="wa-bubble__tools">
                    {!ehUsuario && (
                      <button
                        type="button"
                        onClick={() => alternarVoz(mensagem.conteudo, indice)}
                        className={`wa-listen ${falandoIndice === indice ? 'wa-listen--ativo' : ''}`}
                        aria-label={falandoIndice === indice ? 'Parar leitura' : 'Ouvir mensagem'}
                        title={falandoIndice === indice ? 'Parar leitura' : 'Ouvir'}
                      >
                        <IconeAltoFalante />
                      </button>
                    )}
                  </span>
                </div>
              </div>
            );
          })}

          {enviando && (
            <div className="wa-row wa-row--bot">
              <div className="wa-bubble wa-bubble--bot" aria-label="Direito Vivo está digitando">
                <div className="wa-typing" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}

          {erro && (
            <div role="alert" className="wa-error">
              <p>Não consegui completar essa etapa. {erro}. Você pode tentar novamente ou consultar orientações sem IA.</p>
              <div className="mt-2 flex flex-wrap gap-3">
                <button type="button" onClick={aoVerCatalogo} className="underline">Ver catálogo</button>
                <button type="button" onClick={aoVerAjuda} className="underline">Ver ajuda humana</button>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="wa-quickchips" aria-label="Sugestões rápidas">
            {SUGESTOES_RESPOSTA.map((sugestao) => (
              <button
                key={sugestao}
                type="button"
                onClick={() => enviarSugestao(sugestao)}
                disabled={enviando}
                className="wa-quickchip"
              >
                {sugestao}
              </button>
            ))}
          </div>

          <form
            className="wa-composer"
            onSubmit={(evento) => {
              evento.preventDefault();
              enviar();
            }}
          >
            <label htmlFor="entrada-chat" className="sr-only">
              Escreva sua resposta
            </label>
            <div className="wa-composer__field">
              <textarea
                id="entrada-chat"
                ref={textareaRef}
                value={texto}
                onChange={(evento) => setTexto(evento.target.value)}
                onKeyDown={(evento) => {
                  if (evento.key === 'Enter' && !evento.shiftKey) {
                    evento.preventDefault();
                    enviar();
                  }
                }}
                rows={1}
                maxLength={2000}
                placeholder="Escreva sua mensagem"
                aria-label="Escreva sua resposta"
              />
            </div>
            <button
              type="submit"
              disabled={enviando || texto.trim() === ''}
              className="wa-composer__send"
              aria-label="Enviar mensagem"
              title="Enviar (Enter)"
            >
              <IconeEnviar />
            </button>
          </form>
          <span className="wa-composer__hint">
            Enter envia · Shift+Enter quebra linha · {texto.length}/2000
          </span>
        </div>
      </div>
    </section>
  );
}
