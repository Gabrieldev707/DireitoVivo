export type NomeIcone =
  | 'seta'
  | 'escudo'
  | 'busca'
  | 'conversa'
  | 'documento'
  | 'saude'
  | 'trabalho'
  | 'cuidado'
  | 'urgencia'
  | 'fechar'
  | 'menu'
  | 'ouvir'
  | 'enviar'
  | 'limpar';

interface PropriedadesIcone {
  nome: NomeIcone;
  tamanho?: number;
}

const CAMINHOS: Record<NomeIcone, string[]> = {
  seta: ['M5 12h14', 'm13 6 6 6-6 6'],
  escudo: ['M12 3 5 6v5c0 4.8 2.8 8.2 7 10 4.2-1.8 7-5.2 7-10V6l-7-3Z', 'm9 12 2 2 4-5'],
  busca: ['m21 21-4.35-4.35', 'M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z'],
  conversa: ['M21 12a8 8 0 0 1-8 8H6l-4 2 1.5-4A9 9 0 1 1 21 12Z'],
  documento: ['M6 3h8l4 4v14H6V3Z', 'M14 3v5h5', 'M9 13h6', 'M9 17h6'],
  saude: ['M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10Z', 'M9 13h6', 'M12 10v6'],
  trabalho: ['M4 8h16v11H4V8Z', 'M9 8V5h6v3', 'M4 12h16'],
  cuidado: ['M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10Z'],
  urgencia: ['M12 3 2 21h20L12 3Z', 'M12 9v5', 'M12 18h.01'],
  fechar: ['m6 6 12 12', 'M18 6 6 18'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  ouvir: ['M5 10v4h3l4 3V7l-4 3H5Z', 'M16 9a4 4 0 0 1 0 6', 'M18.5 6.5a8 8 0 0 1 0 11'],
  enviar: ['m3 11 18-8-8 18-2-7-8-3Z', 'm11 14 10-11'],
  limpar: ['M4 7h16', 'm9 7 1-3h4l1 3', 'm6 7 1 14h10l1-14', 'M10 11v6', 'M14 11v6'],
};

export function Icone({ nome, tamanho = 20 }: PropriedadesIcone) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={tamanho}
      viewBox="0 0 24 24"
      width={tamanho}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      {CAMINHOS[nome].map((caminho) => (
        <path d={caminho} key={caminho} />
      ))}
    </svg>
  );
}
