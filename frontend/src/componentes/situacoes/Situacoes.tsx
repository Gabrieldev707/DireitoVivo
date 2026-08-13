import { useState } from 'react';
import { SITUACOES, type Situacao } from '../../dados/situacoes';
import { CartaoSituacao } from './CartaoSituacao';
import { FiltrosSituacoes, type FiltroSituacao } from './FiltrosSituacoes';

interface PropriedadesSituacoes {
  aoEscolher: (situacao: Situacao) => void;
}

export function Situacoes({ aoEscolher }: PropriedadesSituacoes) {
  const [filtro, setFiltro] = useState<FiltroSituacao>('todas');
  const visiveis = filtro === 'todas' ? SITUACOES : SITUACOES.filter((item) => item.categoria === filtro);

  return (
    <section className="dv-page dv-page--situacoes dv-container" aria-labelledby="titulo-situacoes">
      <header className="dv-page__header">
        <span className="dv-eyebrow">12 pontos de partida</span>
        <h1 id="titulo-situacoes">Comece pelo que está acontecendo agora.</h1>
        <p>Escolha uma situação próxima da sua. A conversa ajuda a organizar o que confirmar — sem pedir nome, CPF ou endereço.</p>
      </header>
      <aside className="dv-page__guide" aria-label="Como usar as situações">
        <div><span>1</span><p><strong>Escolha o que mais se aproxima</strong><small>Não precisa ser exatamente igual.</small></p></div>
        <div><span>2</span><p><strong>Conte só o necessário</strong><small>Sem nome, CPF ou endereço.</small></p></div>
        <div><span>3</span><p><strong>Veja onde confirmar</strong><small>Receba canais e próximos passos.</small></p></div>
      </aside>
      <FiltrosSituacoes ativo={filtro} aoMudar={setFiltro} />
      <p className="dv-results-count" aria-live="polite">{visiveis.length} situações encontradas</p>
      <div className="dv-situation-grid">
        {visiveis.map((situacao) => <CartaoSituacao key={situacao.id} situacao={situacao} aoEscolher={aoEscolher} />)}
      </div>
    </section>
  );
}
