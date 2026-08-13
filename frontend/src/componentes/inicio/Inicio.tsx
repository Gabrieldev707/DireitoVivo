import { CATALOGO_DIREITOS } from '../../dados/catalogoDireitos';
import { SITUACOES, type Situacao } from '../../dados/situacoes';
import { Icone } from '../compartilhados/Icone';
import { Selo } from '../compartilhados/Selo';
import { DemonstracaoRota } from './DemonstracaoRota';

interface PropriedadesInicio {
  aoComecar: () => void;
  aoVerDireitos: () => void;
  aoVerSituacoes: () => void;
  aoEscolherSituacao: (situacao: Situacao) => void;
}

const IDS_DESTAQUES = [
  'perdi-emprego',
  'renda-caiu',
  'idoso-pouca-renda',
  'doente-sem-trabalhar',
  'medicamentos',
  'sofrimento-emocional',
];

export function Inicio({ aoComecar, aoVerDireitos, aoVerSituacoes, aoEscolherSituacao }: PropriedadesInicio) {
  const destaques = IDS_DESTAQUES.map((id) => SITUACOES.find((item) => item.id === id)).filter(
    (item): item is Situacao => Boolean(item),
  );

  return (
    <div className="dv-home">
      <section className="dv-home__hero">
        <div className="dv-container dv-home__hero-grid">
          <div className="dv-home__copy">
            <Selo tom="cuidado"><Icone nome="escudo" /> orientação anônima</Selo>
            <h1>Encontre o próximo passo para o momento que você está vivendo.</h1>
            <p className="dv-home__lead">
              Você conta o momento. O Direito Vivo organiza direitos possíveis, o que confirmar e quais canais oficiais procurar — sem prometer aprovação.
            </p>
            <div className="dv-home__actions">
              <button className="dv-button dv-button--primary" type="button" onClick={aoComecar}>
                Contar minha situação <Icone nome="conversa" />
              </button>
              <button className="dv-button dv-button--secondary" type="button" onClick={aoVerDireitos}>
                Ver direitos revisados
              </button>
            </div>
            <div className="dv-home__trust" aria-label="Características da demonstração">
              <Selo>sem cadastro</Selo>
              <Selo>dados pessoais mascarados</Selo>
              <Selo>fontes oficiais</Selo>
              <Selo>7 conteúdos revisados</Selo>
            </div>
          </div>
          <div className="dv-home__route-card">
            <span className="dv-home__route-label">Uma rota, não um veredito</span>
            <h2>Da dúvida ao lugar certo</h2>
            <DemonstracaoRota />
          </div>
        </div>
      </section>

      <section className="dv-section dv-container" aria-labelledby="situacoes-em-destaque">
        <div className="dv-section__heading">
          <div>
            <span className="dv-eyebrow">Comece pelo que aconteceu</span>
            <h2 id="situacoes-em-destaque">Qual destas situações se parece com a sua?</h2>
          </div>
          <button className="dv-button dv-button--quiet" type="button" onClick={aoVerSituacoes}>
            Ver as 12 situações <Icone nome="seta" />
          </button>
        </div>
        <div className="dv-situation-preview">
          {destaques.map((situacao) => (
            <button
              data-testid="situacao-destaque"
              type="button"
              key={situacao.id}
              onClick={() => aoEscolherSituacao(situacao)}
            >
              <span className="dv-situation-preview__icon"><Icone nome={situacao.categoria === 'saude' ? 'saude' : situacao.categoria === 'cuidado_deficiencia' ? 'cuidado' : 'trabalho'} /></span>
              <strong>{situacao.titulo}</strong>
              <Icone nome="seta" />
            </button>
          ))}
        </div>
      </section>

      <section className="dv-home__rights">
        <div className="dv-container">
          <div className="dv-section__heading">
            <div>
              <span className="dv-eyebrow">Conteúdo verificável</span>
              <h2>Direitos explicados sem juridiquês</h2>
              <p>Critérios, documentos, passos e fonte oficial em um só lugar.</p>
            </div>
            <button className="dv-button dv-button--secondary" type="button" onClick={aoVerDireitos}>Explorar 7 conteúdos</button>
          </div>
          <div className="dv-rights-preview">
            {CATALOGO_DIREITOS.slice(0, 3).map((direito) => (
              <article className="dv-card" key={direito.id}>
                <Selo tom="informacao">revisado</Selo>
                <h3>{direito.nome_popular}</h3>
                <p>{direito.resumo_simples}</p>
                <span>{direito.canal_solicitacao.detalhe}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
