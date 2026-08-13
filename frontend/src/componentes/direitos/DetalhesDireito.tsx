import type { ItemCatalogo } from '../../tipos';
import { rotularCanal } from '../../tipos';

interface PropriedadesDetalhes {
  item: ItemCatalogo;
}

export function DetalhesDireito({ item }: PropriedadesDetalhes) {
  return (
    <div className="dv-right-card__details">
      <div><strong>Quem pode verificar</strong><p>{item.criterios_elegibilidade}</p></div>
      {item.documentos_necessarios.length > 0 && <div><strong>Documentos para preparar</strong><ul>{item.documentos_necessarios.map((doc) => <li key={doc}>{doc}</li>)}</ul></div>}
      <div><strong>Como começar</strong><ol>{item.passo_a_passo.map((passo) => <li key={passo}>{passo}</li>)}</ol></div>
      <div><strong>Canal</strong><p>{rotularCanal(item.canal_solicitacao.tipo)} · {item.canal_solicitacao.detalhe}</p></div>
      <div className="dv-right-card__sources">
        {item.fontes_oficiais.map((fonte, indice) => (
          <a key={fonte.url} href={fonte.url} target="_blank" rel="noreferrer">
            {indice === 0 ? 'Fonte oficial' : `Fonte oficial ${indice + 1}`}
          </a>
        ))}
        <span>Revisado em {new Date(`${item.ultima_revisao}T12:00:00`).toLocaleDateString('pt-BR')}</span>
      </div>
    </div>
  );
}
