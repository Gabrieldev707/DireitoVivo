import { useEffect, useRef, type ReactNode } from 'react';

export interface SecaoInstitucional { id: string; titulo: string; conteudo: ReactNode; }

interface PropriedadesLayout {
  etiqueta: string; titulo: string; resumo: string; secoes: SecaoInstitucional[];
}

export function LayoutInstitucional({ etiqueta, titulo, resumo, secoes }: PropriedadesLayout) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const anterior = document.title;
    document.title = `${titulo} — Direito Vivo`;
    heading.current?.focus();
    return () => { document.title = anterior; };
  }, [titulo]);
  return <article className="dv-institutional">
    <header className="dv-institutional__hero"><div className="dv-container"><a href="#inicio">← Início</a><span>{etiqueta}</span><h1 ref={heading} tabIndex={-1}>{titulo}</h1><p>{resumo}</p></div></header>
    <div className="dv-container dv-institutional__layout">
      <nav aria-label="Nesta página"><strong>Nesta página</strong>{secoes.map((s) => <a key={s.id} href={`#${s.id}`}>{s.titulo}</a>)}</nav>
      <div className="dv-institutional__content">{secoes.map((s) => <section id={s.id} key={s.id}><h2>{s.titulo}</h2>{s.conteudo}</section>)}</div>
    </div>
  </article>;
}
