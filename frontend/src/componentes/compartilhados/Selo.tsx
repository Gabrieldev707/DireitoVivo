import type { ReactNode } from 'react';

interface PropriedadesSelo {
  children: ReactNode;
  tom?: 'neutro' | 'cuidado' | 'informacao' | 'atencao' | 'urgencia';
}

export function Selo({ children, tom = 'neutro' }: PropriedadesSelo) {
  return <span className={`dv-badge dv-badge--${tom}`}>{children}</span>;
}
