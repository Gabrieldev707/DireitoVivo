import { CATALOGO_DIREITOS } from '../../dados/catalogoDireitos';
import type { RespostaTriagem } from '../../tipos';
import { rotularCanal, TEXTO_DISCLAIMER } from '../../tipos';
import { Icone } from '../compartilhados/Icone';
import { Selo } from '../compartilhados/Selo';
import { LeituraFacilitada } from './LeituraFacilitada';

interface PropriedadesResultado {
  resposta: Extract<RespostaTriagem, { tipo: 'orientacao' | 'sem_match' }>;
  aoRecomecar: () => void;
  aoVerDireitos: () => void;
}

export function Resultado({ resposta, aoRecomecar, aoVerDireitos }: PropriedadesResultado) {
  if (resposta.tipo === 'sem_match') {
    return (
      <section className="dv-result dv-container">
        <Selo tom="informacao">orientação geral</Selo>
        <h1>O melhor próximo passo é uma porta de entrada geral.</h1>
        <p>{resposta.mensagem}</p>
        <div className="dv-result__plain"><h2>Próximos passos</h2><ul>{resposta.proximos_passos.map((passo) => <li key={passo}>{passo}</li>)}</ul></div>
        <div className="dv-result__actions"><button className="dv-button dv-button--primary" type="button" onClick={aoRecomecar}>Começar novamente</button><button className="dv-button dv-button--secondary" type="button" onClick={aoVerDireitos}>Ver direitos revisados</button></div>
      </section>
    );
  }

  const itens = resposta.itens.map((orientacao) => {
    const publicado = CATALOGO_DIREITOS.find((item) => item.id === orientacao.id);
    return publicado ? { ...orientacao, ...publicado } : null;
  }).filter((item): item is NonNullable<typeof item> => Boolean(item));
  const criterios = itens.flatMap((item) => item.criterios_pendentes);
  const documentos = Array.from(new Set(itens.flatMap((item) => item.documentos)));
  const passos = Array.from(new Set(itens.flatMap((item) => item.proximos_passos)));

  return (
    <section className="dv-result dv-container" aria-labelledby="titulo-resultado">
      <header className="dv-result__header">
        <Selo tom="cuidado"><Icone nome="escudo" /> orientação organizada</Selo>
        <h1 id="titulo-resultado">Você já tem uma rota para confirmar.</h1>
        <p>{resposta.resumo}</p>
      </header>
      <LeituraFacilitada
        resumo={resposta.resumo}
        possibilidades={itens.map((item) => item.nome_popular)}
        passos={passos}
        canal={itens[0] ? `${rotularCanal(itens[0].canal_solicitacao.tipo)} — ${itens[0].canal_solicitacao.detalhe}` : undefined}
      />
      <div className="dv-result__grid">
        <article className="dv-result__block dv-result__block--main">
          <span className="dv-result__number">01</span><h2>O que pode se aplicar</h2>
          {itens.map((item) => <div className="dv-result__candidate" key={item.id}><Selo tom={item.situacao === 'compativel' ? 'cuidado' : 'atencao'}>{item.situacao === 'compativel' ? 'Parece compatível' : 'Vale confirmar'}</Selo><h3>{item.nome_popular}</h3><p>{item.resumo_simples}</p></div>)}
        </article>
        <article className="dv-result__block"><span className="dv-result__number">02</span><h2>O que confirmar</h2>{criterios.length ? <ul>{criterios.map((criterio) => <li key={criterio}>{criterio}</li>)}</ul> : <p>Nenhuma pendência adicional foi indicada.</p>}</article>
        <article className="dv-result__block"><span className="dv-result__number">03</span><h2>Documentos para preparar</h2>{documentos.length ? <ul>{documentos.map((documento) => <li key={documento}>{documento}</li>)}</ul> : <p>O canal oficial informará os documentos necessários.</p>}</article>
        <article className="dv-result__block dv-result__block--next"><span className="dv-result__number">04</span><h2>Próximo passo</h2><ol>{passos.map((passo) => <li key={passo}>{passo}</li>)}</ol>{itens[0] && <p className="dv-result__channel"><strong>Canal:</strong> {rotularCanal(itens[0].canal_solicitacao.tipo)} · {itens[0].canal_solicitacao.detalhe}</p>}</article>
      </div>
      <div className="dv-result__sources">
        {itens.map((item) => <div key={item.id}><strong>{item.nome_popular}</strong><span>Revisado em {new Date(`${item.ultima_revisao}T12:00:00`).toLocaleDateString('pt-BR')}</span>{item.fontes_oficiais.slice(0, 1).map((fonte) => <a key={fonte.url} href={fonte.url} target="_blank" rel="noreferrer">Consultar fonte oficial</a>)}</div>)}
      </div>
      <p className="dv-result__disclaimer">{TEXTO_DISCLAIMER}</p>
      <div className="dv-result__actions"><button className="dv-button dv-button--primary" type="button" onClick={aoRecomecar}>Fazer nova orientação</button><button className="dv-button dv-button--secondary" type="button" onClick={aoVerDireitos}>Ver todos os direitos</button></div>
    </section>
  );
}
