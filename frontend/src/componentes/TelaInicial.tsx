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
        <div className="home-new__wrap">
          <p className="home-new__eyebrow">Direito Vivo · projeto independente</p>
          <h1 id="titulo-inicio">Encontre ajuda para sua situação.</h1>
          <p className="home-new__lead">Comece pelo que está acontecendo. Consulte orientações sobre direitos e descubra onde confirmar seus próximos passos.</p>

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
      </section>

      <section className="home-new__section home-new__situations" aria-labelledby="titulo-situacoes">
        <div className="home-new__wrap">
          <div className="home-new__section-heading">
            <div>
              <p className="home-new__eyebrow">Comece pela sua realidade</p>
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
          <p className="home-new__eyebrow">Você escolhe o caminho</p>
          <h2 id="titulo-caminhos">Como prefere continuar?</h2>
          <div className="home-new__path-grid">
            <article><span className="home-new__path-number">01</span><h3>Orientações por situação</h3><p>Veja exemplos e caminhos de atendimento, sem enviar seu relato.</p><button type="button" onClick={aoVerSituacoes}>Ver orientações <span aria-hidden="true">→</span></button></article>
            <article><span className="home-new__path-number">02</span><h3>Direitos pelo nome</h3><p>Leia critérios, documentos, fontes e passos das {TOTAL_DIREITOS} fichas.</p><button type="button" onClick={() => aoBuscarDireitos('')}>Explorar direitos <span aria-hidden="true">→</span></button></article>
            <article><span className="home-new__path-number">03</span><h3>Conversa guiada</h3><p>Explique sua dúvida com suas palavras, depois de ler e aceitar o aviso de privacidade.</p><button type="button" onClick={aoComecar}>Iniciar conversa <span aria-hidden="true">→</span></button></article>
          </div>
        </div>
      </section>

      <section className="home-new__section home-new__limits" aria-labelledby="titulo-limites">
        <div className="home-new__wrap home-new__limits-grid">
          <div><p className="home-new__eyebrow">Antes de começar</p><h2 id="titulo-limites">Informação para você decidir o próximo passo.</h2></div>
          <div><p>O Direito Vivo é um <strong>projeto independente</strong>, sem vínculo governamental. Não recebe pedidos de benefício nem decide elegibilidade.</p><p>Você pode consultar fichas e canais de ajuda sem usar IA. Na conversa, o texto enviado é processado por um provedor externo. Evite nome, CPF, endereço e telefone.</p><p>{TEXTO_DISCLAIMER}</p><button type="button" onClick={aoVerAjuda} className="home-new__text-link">Entenda privacidade e ajuda <span aria-hidden="true">→</span></button></div>
        </div>
      </section>
    </div>
  );
}
