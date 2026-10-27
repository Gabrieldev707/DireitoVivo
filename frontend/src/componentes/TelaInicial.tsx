import { useState, type FormEvent } from 'react';
import { TOTAL_DIREITOS } from '../dados/catalogoDireitos';
import { ROTULOS_CATEGORIA, TEXTO_DISCLAIMER, type CategoriaVida } from '../tipos';

interface PropriedadesTelaInicial {
  aoComecar: () => void;
  aoBuscarDireitos: (termo: string) => void;
  aoVerAjuda: () => void;
  aoVerSituacoes: () => void;
}

const SITUACOES: Array<{ categoria: CategoriaVida; rotulo: string; detalhe: string }> = [
  { categoria: 'familia_crianca', rotulo: 'Família e renda', detalhe: 'Cuidado, crianças e apoio financeiro' },
  { categoria: 'trabalho_acidente', rotulo: 'Trabalho', detalhe: 'Emprego, afastamento e acidente' },
  { categoria: 'saude_mental', rotulo: 'Saúde', detalhe: 'Atendimento e saúde mental' },
  { categoria: 'violencia_domestica', rotulo: 'Violência', detalhe: 'Proteção e canais humanos' },
  { categoria: 'idoso', rotulo: 'Pessoa idosa', detalhe: 'Renda, mobilidade e cuidados' },
  { categoria: 'pcd', rotulo: 'Deficiência', detalhe: 'Acessibilidade e benefícios' },
  { categoria: 'situacao_rua', rotulo: 'Moradia', detalhe: 'Documentos e rede de apoio' },
  { categoria: 'divida_credito', rotulo: 'Dívidas', detalhe: 'Orientação e proteção financeira' },
];

export function TelaInicial({ aoComecar, aoBuscarDireitos, aoVerAjuda, aoVerSituacoes }: PropriedadesTelaInicial) {
  const [busca, setBusca] = useState('');

  function buscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    aoBuscarDireitos(busca.trim());
  }

  return (
    <div className="home-new">
      <section className="home-new__hero" aria-labelledby="titulo-inicio">
        <div className="home-new__wrap home-new__hero-grid">
          <div className="home-new__hero-copy">
          <h1 id="titulo-inicio">Quando a vida muda, por onde começar?</h1>
          <p className="home-new__lead">Encontre orientações sobre direitos e serviços a partir da sua situação. Você escolhe o caminho.</p>

          <form className="home-new__search" role="search" onSubmit={buscar}>
            <label htmlFor="busca-inicial">O que está acontecendo?</label>
            <div className="home-new__search-row">
              <input id="busca-inicial" type="search" value={busca} onChange={(evento) => setBusca(evento.target.value)} placeholder="Ex.: BPC, desemprego, apoio para minha família" />
              <button type="submit">Buscar direitos</button>
            </div>
            <p>Pesquise as {TOTAL_DIREITOS} fichas sem usar a conversa com IA.</p>
          </form>

          <button type="button" onClick={aoVerAjuda} className="home-new__urgent">Preciso de ajuda agora <span aria-hidden="true">→</span></button>
          </div>
          <figure className="home-new__photo">
            <img src="/assets/rua-rio-felipe-vieira.jpg" alt="Pessoas caminhando em uma rua do centro do Rio de Janeiro" width="1500" height="2000" fetchPriority="high" />
            <figcaption>Centro do Rio de Janeiro. Foto: Felipe Vieira / Unsplash.</figcaption>
          </figure>
        </div>
      </section>

      <section className="home-new__section home-new__situations" aria-labelledby="titulo-situacoes">
        <div className="home-new__wrap">
          <div className="home-new__section-heading">
            <div>
              <h2 id="titulo-situacoes">Qual assunto se aproxima do seu?</h2>
            </div>
            <button type="button" onClick={aoVerSituacoes} className="home-new__text-link">Ver todas as situações <span aria-hidden="true">→</span></button>
          </div>
          <div className="home-new__situation-grid">
            {SITUACOES.map((situacao) => (
              <button type="button" className="home-new__situation" key={situacao.categoria} onClick={aoVerSituacoes} aria-label={`Ver situações de ${ROTULOS_CATEGORIA[situacao.categoria]}`}>
                <strong>{situacao.rotulo}</strong>
                <span>{situacao.detalhe}</span>
                <span className="home-new__arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="home-new__section home-new__paths" aria-labelledby="titulo-caminhos">
        <div className="home-new__wrap">
          <h2 id="titulo-caminhos">Como prefere continuar?</h2>
          <div className="home-new__paths-layout">
            <figure className="home-new__paths-photo">
              <img src="/assets/anotacoes-zulfugar-karimov.jpg" alt="Mãos fazendo anotações em uma folha de papel" width="1200" height="800" loading="lazy" />
              <figcaption>Foto ilustrativa: Zulfugar Karimov / Unsplash.</figcaption>
            </figure>
            <div className="home-new__path-grid">
              <article><h3>Orientações por situação</h3><p>Veja exemplos e caminhos de atendimento, sem enviar seu relato.</p><button type="button" onClick={aoVerSituacoes}>Ver orientações <span aria-hidden="true">→</span></button></article>
              <article><h3>Direitos pelo nome</h3><p>Leia critérios, documentos, fontes e passos das {TOTAL_DIREITOS} fichas.</p><button type="button" onClick={() => aoBuscarDireitos('')}>Explorar direitos <span aria-hidden="true">→</span></button></article>
              <article><h3>Conversa guiada</h3><p>Explique sua dúvida com suas palavras, depois de ler e aceitar o aviso de privacidade.</p><button type="button" onClick={aoComecar}>Iniciar conversa <span aria-hidden="true">→</span></button></article>
            </div>
          </div>
        </div>
      </section>

      <section className="home-new__section home-new__limits" aria-labelledby="titulo-limites">
        <div className="home-new__wrap home-new__limits-grid">
          <div><h2 id="titulo-limites">Informação para você decidir o próximo passo.</h2></div>
          <div><p>O Direito Vivo é um <strong>projeto independente</strong>, sem vínculo governamental. Não recebe pedidos de benefício nem decide elegibilidade.</p><p>Você pode consultar fichas e canais de ajuda sem usar IA. Na conversa, o texto enviado é processado por um provedor externo. Evite nome, CPF, endereço e telefone.</p><p>{TEXTO_DISCLAIMER}</p><button type="button" onClick={aoVerAjuda} className="home-new__text-link">Entenda privacidade e ajuda <span aria-hidden="true">→</span></button></div>
        </div>
      </section>
    </div>
  );
}
