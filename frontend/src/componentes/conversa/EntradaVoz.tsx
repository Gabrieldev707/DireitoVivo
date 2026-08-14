import { useRef, useState } from 'react';
import { criarReconhecimentoVoz, obterConstrutorReconhecimento, type ReconhecimentoVozNativo } from '../../acessibilidade/reconhecimentoVoz';

interface PropriedadesEntradaVoz {
  desabilitada?: boolean;
  aoTranscrever: (texto: string) => void;
}

export function EntradaVoz({ desabilitada = false, aoTranscrever }: PropriedadesEntradaVoz) {
  const [consentimentoAberto, setConsentimentoAberto] = useState(false);
  const [consentiu, setConsentiu] = useState(false);
  const [ouvindo, setOuvindo] = useState(false);
  const [erro, setErro] = useState<string>();
  const reconhecimento = useRef<ReconhecimentoVozNativo | undefined>(undefined);

  if (!obterConstrutorReconhecimento()) return null;

  function iniciar() {
    const instancia = criarReconhecimentoVoz();
    if (!instancia) return;
    reconhecimento.current = instancia;
    setErro(undefined);
    instancia.onresult = (evento) => {
      const texto = evento.results[0]?.[0]?.transcript?.trim();
      if (texto) aoTranscrever(texto);
    };
    instancia.onerror = (evento) => {
      const mensagens: Record<string, string> = {
        'not-allowed': 'A permissão do microfone foi negada. Você pode continuar digitando ou liberar o acesso nas configurações do navegador.',
        'no-speech': 'Nenhuma fala foi identificada. Você pode tentar de novo ou continuar digitando.',
        'audio-capture': 'O navegador não encontrou um microfone disponível. Você pode continuar digitando.',
        network: 'A entrada por voz ficou sem conexão. Você pode tentar de novo ou continuar digitando.',
      };
      setErro(mensagens[evento.error ?? ''] ?? 'Não foi possível entender. Você pode tentar de novo ou continuar digitando.');
      setOuvindo(false);
    };
    instancia.onend = () => setOuvindo(false);
    setOuvindo(true);
    instancia.start();
  }

  function solicitarInicio() {
    if (consentiu) iniciar();
    else setConsentimentoAberto(true);
  }

  function parar() {
    reconhecimento.current?.abort();
    setOuvindo(false);
  }

  return (
    <>
      <button
        className="dv-voice-button"
        type="button"
        disabled={desabilitada}
        aria-pressed={ouvindo}
        aria-label={ouvindo ? 'Parar entrada por voz' : 'Falar em vez de digitar'}
        onClick={ouvindo ? parar : solicitarInicio}
      >
        <span aria-hidden="true">●</span>
        <span>{ouvindo ? 'Parar' : 'Falar'}</span>
      </button>
      {erro && <p className="dv-voice-error" role="status">{erro}</p>}
      {consentimentoAberto && (
        <div className="dv-dialog-backdrop" role="presentation">
          <section className="dv-dialog" role="dialog" aria-modal="true" aria-labelledby="voz-titulo">
            <p className="dv-dialog__eyebrow">Recurso opcional</p>
            <h2 id="voz-titulo">Usar entrada por voz</h2>
            <p>
              O áudio pode ser processado por um serviço externo do navegador ou do aparelho. O Direito Vivo
              não grava nem envia um arquivo de áudio ao próprio servidor.
            </p>
            <p>Não fale nome completo, CPF, RG, endereço, telefone ou e-mail.</p>
            <a href="#privacidade">Entenda como cuidamos dos seus dados</a>
            <div className="dv-dialog__actions">
              <button type="button" className="button button--primary" onClick={() => { setConsentiu(true); setConsentimentoAberto(false); iniciar(); }}>
                Entendi, usar voz
              </button>
              <button type="button" className="button button--secondary" onClick={() => setConsentimentoAberto(false)}>
                Continuar digitando
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
