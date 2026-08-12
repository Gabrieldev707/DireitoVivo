import type { MensagemChat } from './tipos.js';

export type CategoriaDado = 'cpf' | 'email' | 'telefone' | 'cep';

interface ResultadoProtecao {
  mensagens: MensagemChat[];
  categoriasMascaradas: CategoriaDado[];
}

interface PadraoProtecao {
  categoria: CategoriaDado;
  marcador: string;
  expressoes: RegExp[];
}

const PADROES: PadraoProtecao[] = [
  {
    categoria: 'cpf',
    marcador: '[CPF REMOVIDO]',
    expressoes: [
      /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g,
      /(?<=\bcpf\s*(?:é|e|:)?\s*)\d{11}\b/gi,
    ],
  },
  {
    categoria: 'email',
    marcador: '[E-MAIL REMOVIDO]',
    expressoes: [/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi],
  },
  {
    categoria: 'telefone',
    marcador: '[TELEFONE REMOVIDO]',
    expressoes: [/(?:\+?55\s*)?\(?\d{2}\)?\s*9?\d{4}[-\s]?\d{4}\b/g],
  },
  {
    categoria: 'cep',
    marcador: '[CEP REMOVIDO]',
    expressoes: [/\b\d{5}-\d{3}\b/g],
  },
];

export function protegerMensagens(mensagens: MensagemChat[]): ResultadoProtecao {
  const primeiraOcorrencia = new Map<CategoriaDado, number>();
  const protegidas = mensagens.map((mensagem, indiceMensagem) => {
    let conteudo = mensagem.conteudo;
    for (const padrao of PADROES) {
      for (const expressao of padrao.expressoes) {
        expressao.lastIndex = 0;
        const encontrado = expressao.exec(mensagem.conteudo);
        if (encontrado) {
          const posicao = indiceMensagem * 1_000_000 + encontrado.index;
          const anterior = primeiraOcorrencia.get(padrao.categoria);
          if (anterior === undefined || posicao < anterior) {
            primeiraOcorrencia.set(padrao.categoria, posicao);
          }
        }
        expressao.lastIndex = 0;
        conteudo = conteudo.replace(expressao, padrao.marcador);
      }
    }
    return { ...mensagem, conteudo };
  });

  const categoriasMascaradas = [...primeiraOcorrencia.entries()]
    .sort((a, b) => a[1] - b[1])
    .map(([categoria]) => categoria);
  return { mensagens: protegidas, categoriasMascaradas };
}
