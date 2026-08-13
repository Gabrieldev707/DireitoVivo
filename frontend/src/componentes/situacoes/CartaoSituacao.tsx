import { CATALOGO_DIREITOS } from '../../dados/catalogoDireitos';
import type { Situacao } from '../../dados/situacoes';
import { Icone } from '../compartilhados/Icone';
import { Selo } from '../compartilhados/Selo';

interface PropriedadesCartao {
  situacao: Situacao;
  aoEscolher: (situacao: Situacao) => void;
}

const ROTULOS_PRIORIDADE = {
  orientacao: 'orientação',
  alta: 'atenção prioritária',
  imediata: 'proteção imediata',
};

export function CartaoSituacao({ situacao, aoEscolher }: PropriedadesCartao) {
  const direitos = situacao.direitosIds
    .map((id) => CATALOGO_DIREITOS.find((item) => item.id === id))
    .filter(Boolean)
    .slice(0, 2);
  const assunto = situacao.id === 'medicamentos' ? 'remédios' : situacao.titulo.toLocaleLowerCase('pt-BR');

  return (
    <article className="dv-card dv-situation-card" data-categoria={situacao.categoria} data-testid="cartao-situacao">
      <div className="dv-situation-card__top">
        <span className="dv-situation-card__icon">
          <Icone nome={situacao.categoria === 'saude' ? 'saude' : situacao.categoria === 'urgencia' ? 'urgencia' : situacao.categoria === 'cuidado_deficiencia' ? 'cuidado' : 'trabalho'} />
        </span>
        <Selo tom={situacao.prioridade === 'imediata' ? 'urgencia' : situacao.prioridade === 'alta' ? 'atencao' : 'neutro'}>
          {ROTULOS_PRIORIDADE[situacao.prioridade]}
        </Selo>
      </div>
      <h2>{situacao.titulo}</h2>
      <p>{situacao.resumo}</p>
      {situacao.prioridade === 'imediata' && (
        <div className="dv-situation-card__urgent">
          <strong>Se houver risco agora:</strong> {situacao.canais.join(' · ')}
        </div>
      )}
      {direitos.length > 0 && (
        <div className="dv-situation-card__links">
          {direitos.map((direito) => <span key={direito!.id}>{direito!.nome_popular}</span>)}
        </div>
      )}
      <div className="dv-situation-card__channels">Portas de entrada: {situacao.canais.join(' · ')}</div>
      <button className="dv-button dv-button--secondary" type="button" onClick={() => aoEscolher(situacao)}>
        Conversar sobre {assunto} <Icone nome="seta" />
      </button>
    </article>
  );
}
