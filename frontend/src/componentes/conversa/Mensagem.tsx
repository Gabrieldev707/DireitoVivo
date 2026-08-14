import { useState } from 'react';
import type { MensagemChat } from '../../tipos';
import { Icone } from '../compartilhados/Icone';
import { sintetizadorDeVoz } from '../../acessibilidade/sinteseVoz';
import type { VelocidadeLeitura } from '../../acessibilidade/preferencias';

interface PropriedadesMensagem {
  mensagem: MensagemChat;
  velocidadeLeitura?: VelocidadeLeitura;
}

export function Mensagem({ mensagem, velocidadeLeitura = 'normal' }: PropriedadesMensagem) {
  const [falando, setFalando] = useState(false);
  const podeOuvir = sintetizadorDeVoz.disponivel();

  function ouvir() {
    if (!podeOuvir) return;
    if (falando) {
      sintetizadorDeVoz.parar();
      setFalando(false);
      return;
    }
    setFalando(true);
    sintetizadorDeVoz.ouvir(mensagem.conteudo, velocidadeLeitura, {
      aoTerminar: () => setFalando(false),
      aoFalhar: () => setFalando(false),
    });
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
