import type { ReactNode } from 'react';
import { Icone } from './Icone';

interface PropriedadesEstadoVazio {
  titulo: string;
  descricao: string;
  acao?: ReactNode;
}

export function EstadoVazio({ titulo, descricao, acao }: PropriedadesEstadoVazio) {
  return (
    <section className="dv-empty" aria-labelledby="titulo-estado-vazio">
      <span className="dv-empty__icon">
        <Icone nome="busca" tamanho={24} />
      </span>
      <h2 id="titulo-estado-vazio">{titulo}</h2>
      <p>{descricao}</p>
      {acao && <div className="dv-empty__action">{acao}</div>}
    </section>
  );
}
