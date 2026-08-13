import { useState } from 'react';
import type { MensagemChat } from '../../tipos';
import { Icone } from '../compartilhados/Icone';

interface PropriedadesMensagem {
  mensagem: MensagemChat;
}

export function Mensagem({ mensagem }: PropriedadesMensagem) {
  const [falando, setFalando] = useState(false);
  const podeOuvir = typeof window !== 'undefined' && 'speechSynthesis' in window;

  function ouvir() {
    if (!podeOuvir) return;
    if (falando) {
      window.speechSynthesis.cancel();
      setFalando(false);
      return;
    }
    window.speechSynthesis.cancel();
    const fala = new SpeechSynthesisUtterance(mensagem.conteudo);
    fala.lang = 'pt-BR';
    fala.onend = () => setFalando(false);
    fala.onerror = () => setFalando(false);
    setFalando(true);
    window.speechSynthesis.speak(fala);
  }

  return (
    <div className={`dv-message dv-message--${mensagem.papel}`}>
      <div className="dv-message__label">{mensagem.papel === 'assistente' ? 'Direito Vivo' : 'Você'}</div>
      <div className="dv-message__bubble">
        <p>{mensagem.conteudo}</p>
        {mensagem.papel === 'assistente' && podeOuvir && (
          <button type="button" onClick={ouvir} aria-label={falando ? 'Parar leitura' : 'Ouvir mensagem'}>
            <Icone nome="ouvir" tamanho={16} /> {falando ? 'Parar' : 'Ouvir'}
          </button>
        )}
      </div>
    </div>
  );
}
