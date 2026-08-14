import { useEffect, useRef } from 'react';
import type { MensagemChat } from '../../tipos';
import { ContextoConversa } from './ContextoConversa';
import { Mensagem } from './Mensagem';
import { Compositor } from './Compositor';
import { Marca } from '../layout/Marca';
import { usePreferenciasAcessibilidade } from '../../acessibilidade/PreferenciasProvider';
import { AcessibilidadeConversa } from './AcessibilidadeConversa';
import { RespostasGuiadas } from './RespostasGuiadas';
import { sintetizadorDeVoz } from '../../acessibilidade/sinteseVoz';

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
  const {preferencias,atualizar}=usePreferenciasAcessibilidade();
  const respostas=mensagens.filter(m=>m.papel==='usuario').length;
  const quantidadeAnterior = useRef(mensagens.length);

  useEffect(() => {
    const elemento = historico.current;
    if (elemento) elemento.scrollTo({ top: elemento.scrollHeight, behavior: 'smooth' });
  }, [mensagens.length, enviando, erro]);
  useEffect(()=>{if(sessionStorage.getItem('direito-vivo-iniciar-guiado')){sessionStorage.removeItem('direito-vivo-iniciar-guiado');atualizar({modoGuiado:true});}},[atualizar]);
  useEffect(() => {
    const ultima = mensagens.at(-1);
    if (mensagens.length > quantidadeAnterior.current && ultima?.papel === 'assistente' && preferencias.leituraAutomatica) {
      sintetizadorDeVoz.ouvir(ultima.conteudo, preferencias.velocidadeLeitura);
    }
    quantidadeAnterior.current = mensagens.length;
  }, [mensagens, preferencias.leituraAutomatica, preferencias.velocidadeLeitura]);

  return (
    <section className="dv-conversation" data-testid="conversa-shell" data-layout="viewport" aria-label="Conversa de orientação">
      <ContextoConversa aoLimpar={aoLimpar} podeLimpar={mensagens.length > 1 && !enviando} />
      <div className="dv-conversation__main">
        <header className="dv-conversation__heading">
          <div className="dv-conversation__agent"><span className="dv-conversation__avatar"><Marca variante="simbolo" clara /></span><div><strong>Direito Vivo</strong><span>{enviando ? 'Organizando uma resposta…' : 'Assistente de orientação'}</span></div></div>
          <div className="dv-conversation__heading-tools"><AcessibilidadeConversa/><span className="dv-conversation__privacy"><span aria-hidden="true">●</span> conversa ativa</span></div>
        </header>
        <div className="dv-messages" ref={historico} data-testid="area-rolavel" aria-live="polite" aria-relevant="additions">
          <details className="dv-conversation__mobile-guide">
            <summary>Como esta conversa ajuda</summary>
            <p>Você conta o que aconteceu. A orientação organiza possibilidades, documentos e canais como CRAS, SUS, INSS ou Defensoria.</p>
          </details>
          <div className="dv-messages__notice"><strong>Sua privacidade vem primeiro.</strong><span>Não informe nome completo, CPF, RG, endereço, telefone ou e-mail.</span></div>
          {mensagens.map((mensagem, indice) => <Mensagem key={`${mensagem.papel}-${indice}`} mensagem={mensagem} velocidadeLeitura={preferencias.velocidadeLeitura} />)}
          {enviando && <div className="dv-message dv-message--assistente"><div className="dv-message__label">Direito Vivo</div><div className="dv-message__typing" aria-label="Direito Vivo está digitando"><span /><span /><span /></div></div>}
          {erro && <div className="dv-conversation__error" role="alert"><strong>Não foi possível concluir.</strong><span>{erro}</span>{aoTentarNovamente && <button type="button" onClick={aoTentarNovamente}>Tentar novamente</button>}</div>}
        </div>
        {preferencias.modoGuiado&&mensagens.at(-1)?.papel==='assistente'&&!enviando&&<RespostasGuiadas pergunta={mensagens.at(-1)?.conteudo??''} desabilitado={enviando} aoEscolher={aoEnviar}/>} 
        <Compositor enviando={enviando} aoEnviar={aoEnviar} />
      </div>
    </section>
  );
}
