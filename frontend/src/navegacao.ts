export type Pagina = 'inicio' | 'direitos' | 'situacoes' | 'ajuda' | 'conversa';

const LEGADO: Record<string, Pagina> = {
  catalogo: 'direitos',
  cenarios: 'situacoes',
  chat: 'conversa',
};

export function lerPagina(hash: string): Pagina {
  const valor = hash.replace(/^#/, '');
  if (valor in LEGADO) return LEGADO[valor];
  if (valor === 'direitos' || valor === 'situacoes' || valor === 'ajuda' || valor === 'conversa') return valor;
  return 'inicio';
}

export function abrirPagina(pagina: Pagina): void {
  const destino = `#${pagina}`;
  if (window.location.hash !== destino) window.location.hash = destino;
}
