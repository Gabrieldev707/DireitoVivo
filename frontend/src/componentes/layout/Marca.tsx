export type VarianteMarca = 'completa' | 'compacta' | 'simbolo';

interface PropriedadesMarca { variante?: VarianteMarca; clara?: boolean; demonstracao?: boolean; compacta?: boolean; }

export function Marca({ variante = 'completa', clara = false, demonstracao = true, compacta }: PropriedadesMarca) {
  const forma = compacta ? 'compacta' : variante;
  return (
    <span className={`dv-brand ${clara ? 'dv-brand--clara' : ''}`} aria-label={forma === 'simbolo' ? 'Direito Vivo' : undefined}>
      <svg className="dv-brand__signal" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M9 30c8-17 18-8 24-18" />
        <circle cx="9" cy="30" r="4" />
        <circle cx="22" cy="21" r="4" />
        <circle cx="34" cy="12" r="4" />
      </svg>
      {forma !== 'simbolo' && <span className="dv-brand__name">Direito Vivo</span>}
      {forma === 'completa' && demonstracao && <span className="dv-brand__demo">demonstração</span>}
    </span>
  );
}
