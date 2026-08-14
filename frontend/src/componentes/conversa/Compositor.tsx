import { useEffect, useRef, useState } from 'react';
import { Icone } from '../compartilhados/Icone';
import { usePreferenciasAcessibilidade } from '../../acessibilidade/PreferenciasProvider';
import { ConfirmacaoEnvio } from './ConfirmacaoEnvio';
import { EntradaVoz } from './EntradaVoz';

interface PropriedadesCompositor {
  enviando: boolean;
  aoEnviar: (texto: string) => void;
}

const SUGESTOES = ['Perdi meu emprego', 'Minha renda caiu', 'Preciso de remédios', 'Não sei por onde começar'];

export function Compositor({ enviando, aoEnviar }: PropriedadesCompositor) {
  const [texto, setTexto] = useState('');
  const [pendente,setPendente]=useState<string>();
  const [origemPendente,setOrigemPendente]=useState<'texto'|'voz'>('texto');
  const {preferencias}=usePreferenciasAcessibilidade();
  const entrada = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!entrada.current) return;
    entrada.current.style.height = 'auto';
    entrada.current.style.height = `${Math.min(entrada.current.scrollHeight, 128)}px`;
  }, [texto]);

  function enviar(valor = texto) {
    const limpo = valor.trim();
    if (!limpo || enviando) return;
    if(preferencias.confirmarEnvio){setOrigemPendente('texto');setPendente(limpo);return;}
    aoEnviar(limpo); setTexto('');
  }

  function receberVoz(valor: string) {
    setTexto(valor);
    setOrigemPendente('voz');
    setPendente(valor);
  }

  return (
    <div className="dv-composer" data-testid="compositor" data-safe-area="bottom">
      <div className="dv-composer__suggestions" aria-label="Sugestões de resposta">
        {SUGESTOES.map((sugestao) => <button type="button" key={sugestao} disabled={enviando} onClick={() => enviar(sugestao)}>{sugestao}</button>)}
      </div>
      <form onSubmit={(evento) => { evento.preventDefault(); enviar(); }}>
        <EntradaVoz desabilitada={enviando} aoTranscrever={receberVoz} />
        <label className="sr-only" htmlFor="entrada-conversa">Escreva sua resposta</label>
        <textarea
          ref={entrada}
          id="entrada-conversa"
          aria-label="Escreva sua resposta"
          rows={1}
          maxLength={2000}
          value={texto}
          placeholder="Conte com suas palavras"
          onChange={(evento) => setTexto(evento.target.value)}
          onKeyDown={(evento) => {
            if (evento.key === 'Enter' && !evento.shiftKey) {
              evento.preventDefault();
              enviar();
            }
          }}
        />
        <button type="submit" aria-label="Enviar mensagem" disabled={enviando || !texto.trim()}>
          <Icone nome="enviar" />
        </button>
      </form>
      <span className="dv-composer__hint">Enter envia · Shift+Enter quebra linha · {texto.length}/2000</span>
      {pendente&&<ConfirmacaoEnvio texto={pendente} origem={origemPendente} aoConfirmar={()=>{aoEnviar(pendente);setPendente(undefined);setTexto('')}} aoEditar={()=>{setPendente(undefined);queueMicrotask(()=>entrada.current?.focus())}} aoCancelar={()=>setPendente(undefined)}/>}
    </div>
  );
}
