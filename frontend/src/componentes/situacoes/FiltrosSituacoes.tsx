import { CATEGORIAS_SITUACAO, type CategoriaSituacao } from '../../dados/situacoes';

export type FiltroSituacao = CategoriaSituacao | 'todas';

interface PropriedadesFiltros {
  ativo: FiltroSituacao;
  aoMudar: (filtro: FiltroSituacao) => void;
}

export function FiltrosSituacoes({ ativo, aoMudar }: PropriedadesFiltros) {
  return (
    <div className="dv-filters" aria-label="Filtrar situações">
      {CATEGORIAS_SITUACAO.map((categoria) => (
        <button
          className="dv-chip"
          type="button"
          key={categoria.id}
          aria-pressed={ativo === categoria.id}
          onClick={() => aoMudar(categoria.id)}
        >
          {categoria.rotulo}
        </button>
      ))}
    </div>
  );
}
