import { useMemo, useState } from 'react';
import { CATALOGO_DIREITOS } from '../../dados/catalogoDireitos';
import type { CategoriaVida, ItemCatalogo } from '../../tipos';
import { ROTULOS_CATEGORIA } from '../../tipos';
import { EstadoVazio } from '../compartilhados/EstadoVazio';
import { Icone } from '../compartilhados/Icone';
import { CartaoDireito } from './CartaoDireito';

interface PropriedadesDireitos {
  aoConversarSobre: (item: ItemCatalogo) => void;
}

function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('pt-BR');
}

export function Direitos({ aoConversarSobre }: PropriedadesDireitos) {
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState<CategoriaVida | 'todas'>('todas');
  const categorias = Array.from(new Set(CATALOGO_DIREITOS.map((item) => item.categoria_vida)));
  const resultados = useMemo(() => {
    const termo = normalizar(busca);
    return CATALOGO_DIREITOS.filter((item) => {
      const correspondeCategoria = categoria === 'todas' || item.categoria_vida === categoria;
      const texto = normalizar([item.nome_popular, item.resumo_simples, ...item.termos_populares].join(' '));
      return correspondeCategoria && texto.includes(termo);
    });
  }, [busca, categoria]);

  return (
    <section className="dv-page dv-page--direitos dv-container" aria-labelledby="titulo-direitos">
      <header className="dv-page__header">
        <span className="dv-eyebrow">7 conteúdos publicáveis</span>
        <h1 id="titulo-direitos">Direitos e serviços, com critérios que você pode conferir.</h1>
        <p>O catálogo mostra apenas conteúdos com fonte oficial e revisão editorial. A orientação não garante concessão.</p>
      </header>
      <aside className="dv-page__guide" aria-label="Como consultar um direito">
        <div><span>1</span><p><strong>Busque pelo seu momento</strong><small>Use palavras como remédio ou desemprego.</small></p></div>
        <div><span>2</span><p><strong>Confira os critérios</strong><small>Veja documentos e onde solicitar.</small></p></div>
        <div><span>3</span><p><strong>Abra a fonte oficial</strong><small>Confirme sempre a regra atual.</small></p></div>
      </aside>
      <div className="dv-search">
        <Icone nome="busca" />
        <label className="sr-only" htmlFor="buscar-direitos">Buscar direitos</label>
        <input id="buscar-direitos" type="search" value={busca} placeholder="Ex.: remédio, desemprego, idoso" onChange={(evento) => setBusca(evento.target.value)} />
      </div>
      <div className="dv-filters" aria-label="Filtrar direitos por categoria">
        <button className="dv-chip" type="button" aria-pressed={categoria === 'todas'} onClick={() => setCategoria('todas')}>Todas</button>
        {categorias.map((id) => <button className="dv-chip" type="button" key={id} aria-pressed={categoria === id} onClick={() => setCategoria(id)}>{ROTULOS_CATEGORIA[id]}</button>)}
      </div>
      <p className="dv-results-count">{resultados.length === 7 ? '7 direitos e serviços revisados' : `${resultados.length} resultados encontrados`}</p>
      {resultados.length > 0 ? (
        <div className="dv-rights-grid">{resultados.map((item) => <CartaoDireito key={item.id} item={item} aoConversarSobre={aoConversarSobre} />)}</div>
      ) : (
        <EstadoVazio titulo="Nenhum direito encontrado" descricao="Tente outra palavra ou limpe os filtros." acao={<button className="dv-button dv-button--secondary" type="button" onClick={() => { setBusca(''); setCategoria('todas'); }}>Limpar busca</button>} />
      )}
    </section>
  );
}
