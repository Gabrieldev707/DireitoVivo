import type { RespostaTriagem } from '../../tipos';
import { Icone } from '../compartilhados/Icone';

interface PropriedadesUrgencia {
  resposta: Extract<RespostaTriagem, { tipo: 'urgencia' }>;
  aoSair: () => void;
}

export function Urgencia({ resposta, aoSair }: PropriedadesUrgencia) {
  return (
    <section className="dv-urgent dv-container" role="region" aria-label="Orientação urgente">
      <header><span><Icone nome="urgencia" /> ajuda imediata</span><h1>Priorize sua segurança agora.</h1><p>{resposta.mensagem}</p></header>
      <div className="dv-urgent__channels">
        {resposta.canais.map((canal) => <article key={`${canal.nome}-${canal.numero}`}><strong>{canal.nome}</strong><span>{canal.quando_usar}</span><a href={`tel:${canal.numero.replace(/\D/g, '')}`}>Ligar {canal.numero}</a></article>)}
      </div>
      <div className="dv-urgent__care"><strong>Se puder:</strong><span>vá para um local seguro e não confronte uma pessoa agressora. Use um aparelho seguro para buscar ajuda.</span></div>
      <button className="dv-button dv-button--secondary" type="button" onClick={aoSair}>Sair da orientação</button>
    </section>
  );
}
