import { useState } from 'react';
import type { ItemCatalogo } from '../../tipos';
import { Icone } from '../compartilhados/Icone';
import { Selo } from '../compartilhados/Selo';
import { DetalhesDireito } from './DetalhesDireito';

interface PropriedadesCartaoDireito {
  item: ItemCatalogo;
  aoConversarSobre: (item: ItemCatalogo) => void;
}

export function CartaoDireito({ item, aoConversarSobre }: PropriedadesCartaoDireito) {
  const [aberto, setAberto] = useState(false);
  return (
    <article className="dv-card dv-right-card" data-natureza={item.natureza} data-testid="cartao-direito">
      <div className="dv-right-card__heading">
        <Selo tom="informacao">{item.natureza === 'beneficio' ? 'benefício' : 'serviço'}</Selo>
        <span>{item.canal_solicitacao.detalhe}</span>
      </div>
      <h2>{item.nome_popular}</h2>
      <p>{item.resumo_simples}</p>
      <div className="dv-right-card__actions">
        <button className="dv-button dv-button--secondary" type="button" aria-expanded={aberto} onClick={() => setAberto((atual) => !atual)}>
          {aberto ? 'Fechar detalhes' : `Ver detalhes de ${item.nome_popular}`} <Icone nome="documento" />
        </button>
        <button className="dv-button dv-button--quiet" type="button" onClick={() => aoConversarSobre(item)}>
          Conversar <Icone nome="seta" />
        </button>
      </div>
      {aberto && <DetalhesDireito item={item} />}
    </article>
  );
}
