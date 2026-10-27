// Marca tipográfica independente, sem símbolos que lembrem órgãos públicos.

interface PropriedadesMarca {
  className?: string;
  tamanho?: number;
}

export function SimboloDireitoVivo({ className = '', tamanho = 40 }: PropriedadesMarca) {
  return (
    <span aria-hidden="true" className={`dv-monograma ${className}`} style={{ width: tamanho, height: tamanho, fontSize: tamanho * .38 }}>
      dv<span>.</span>
    </span>
  );
}

export function LogotipoDireitoVivo({ className = '' }: { className?: string }) {
  return (
    <span className={`dv-wordmark ${className}`}>
      direito<span>vivo</span><i aria-hidden="true">.</i>
    </span>
  );
}
