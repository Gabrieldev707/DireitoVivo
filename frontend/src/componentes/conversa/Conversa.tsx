import { useEffect, useRef } from 'react';
import type { MensagemChat } from '../../tipos';
import { ContextoConversa } from './ContextoConversa';
import { Mensagem } from './Mensagem';
import { Compositor } from './Compositor';
import { Marca } from '../layout/Marca';

interface PropriedadesConversa {
  mensagens: MensagemChat[];
  enviando: boolean;
  erro?: string;
  aoEnviar: (texto: string) => void;
  aoLimpar?: () => void;
  aoTentarNovamente?: () => void;
}

export function Conversa({ mensagens, enviando, erro, aoEnviar, aoLimpar, aoTentarNovamente }: PropriedadesConversa) {
  const historico = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elemento = historico.current;
    if (elemento) elemento.scrollTo({ top: elemento.scrollHeight, behavior: 'smooth' });
  }, [mensagens.length, enviando, erro]);

  return (
    <section className="dv-conversation" data-testid="conversa-shell" data-layout="viewport" aria-label="Conversa de orientação">
      <ContextoConversa aoLimpar={aoLimpar} podeLimpar={mensagens.length > 1 && !enviando} />
      <div className="dv-conversation__main">
        <header className="dv-conversation__heading">
          <div className="dv-conversation__agent"><span className="dv-conversation__avatar"><Marca variante="simbolo" clara /></span><div><strong>Direito Vivo</strong><span>{enviando ? 'Organizando uma resposta…' : 'Assistente de orientação'}</span></div></div>
          <span className="dv-conversation__privacy"><span aria-hidden="true">●</span> conversa ativa</span>
        </header>
        <div className="dv-messages" ref={historico} data-testid="area-rolavel" aria-live="polite" aria-relevant="additions">
          <details className="dv-conversation__mobile-guide">
            <summary>Como esta conversa ajuda</summary>
            <p>Você conta o que aconteceu. A orientação organiza possibilidades, documentos e canais como CRAS, SUS, INSS ou Defensoria.</p>
          </details>
          <div className="dv-messages__notice"><strong>Sua privacidade vem primeiro.</strong><span>Não informe nome completo, CPF, RG, endereço, telefone ou e-mail.</span></div>
          {mensagens.map((mensagem, indice) => <Mensagem key={`${mensagem.papel}-${indice}`} mensagem={mensagem} />)}
          {enviando && <div className="dv-message dv-message--assistente"><div className="dv-message__label">Direito Vivo</div><div className="dv-message__typing" aria-label="Direito Vivo está digitando"><span /><span /><span /></div></div>}
          {erro && <div className="dv-conversation__error" role="alert"><strong>Não foi possível concluir.</strong><span>{erro}</span>{aoTentarNovamente && <button type="button" onClick={aoTentarNovamente}>Tentar novamente</button>}</div>}
        </div>
        <Compositor enviando={enviando} aoEnviar={aoEnviar} />
      </div>
    </section>
  );
}
