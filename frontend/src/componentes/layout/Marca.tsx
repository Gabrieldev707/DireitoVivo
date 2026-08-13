interface PropriedadesMarca {
  compacta?: boolean;
}

export function Marca({ compacta = false }: PropriedadesMarca) {
  return (
    <span className="dv-brand">
      <svg className="dv-brand__signal" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M9 30c8-17 18-8 24-18" />
        <circle cx="9" cy="30" r="4" />
        <circle cx="22" cy="21" r="4" />
        <circle cx="34" cy="12" r="4" />
      </svg>
      <span className="dv-brand__name">Direito Vivo</span>
      {!compacta && <span className="dv-brand__demo">demonstração</span>}
    </span>
  );
}
