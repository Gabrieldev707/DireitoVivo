import { CATALOGO_DIREITOS } from '../../dados/catalogoDireitos';
import { SITUACOES, type Situacao } from '../../dados/situacoes';
import { Icone } from '../compartilhados/Icone';
import { Selo } from '../compartilhados/Selo';

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
            <p className="dv-home__kicker">Direitos públicos em linguagem simples</p>
            <h1>Descubra onde buscar ajuda para o que você está vivendo.</h1>
            <p className="dv-home__lead">
              Conte o que aconteceu do seu jeito. A gente organiza possibilidades e mostra onde confirmar — sem cadastro e sem prometer aprovação.
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
          <div className="dv-home__portrait">
            <picture>
              <source media="(max-width: 47.999rem)" srcSet="/assets/hero-brasil-familia-mobile.webp" />
              <img
                src="/assets/hero-brasil-familia.webp"
                alt="Família brasileira consultando orientações em um celular"
                width="1600"
                height="800"
                fetchPriority="high"
              />
            </picture>
          </div>
        </div>
        <div className="dv-container dv-home__channels" aria-label="Canais que a orientação pode indicar">
          <strong>Você não precisa saber o nome do benefício.</strong>
          <span>A orientação ajuda a encontrar portas de entrada como</span>
          <div><b>CRAS</b><b>SUS</b><b>INSS</b><b>Defensoria</b></div>
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
