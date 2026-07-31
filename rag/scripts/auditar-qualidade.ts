// Auditoria de qualidade da entrega da triagem.
// Diferente de testar-perfis.ts (que valida critérios de aceite e para no primeiro sucesso),
// este script MEDE o comportamento: quantas perguntas o modelo faz antes de fechar, quantos
// itens entrega, e — o mais importante — quanto isso VARIA entre execuções do mesmo perfil.
// Uso: npm run rag:auditar (na raiz). Requer GEMINI_API_KEY e Supabase ativo.
import { executarTriagem, MAX_PERGUNTAS, type MensagemChat, type RespostaTriagem } from '../src/index.js';

const RODADAS_POR_PERFIL = 3;

interface Perfil {
  nome: string;
  respostas: string[];
  itensEsperados: string[];
}

const perfis: Perfil[] = [
  {
    nome: 'Mãe solo desempregada',
    respostas: [
      'Sou mãe solteira de dois filhos pequenos, de 3 e 6 anos. Perdi meu emprego de vendedora faz dois meses e tá muito difícil pagar as contas.',
      'Trabalhava de carteira assinada e fui demitida sem justa causa. Trabalhei lá uns dois anos.',
      'Hoje a renda é uns 400 reais por mês de bicos. Não recebo nenhum benefício e não estou no CadÚnico.',
      'Moro de aluguel só eu e as crianças. Saúde em dia, graças a Deus.',
      'Não, é isso mesmo. Pode me dizer o que eu consigo?',
    ],
    itensEsperados: ['bolsa-familia', 'seguro-desemprego'],
  },
  {
    nome: 'Idoso com deficiência',
    respostas: [
      'Tenho 67 anos e uma deficiência na perna, ando com muleta. Nunca consegui me aposentar porque trabalhei a vida toda por conta própria, sem contribuir pro INSS.',
      'Moro com minha esposa, só nós dois. A renda da casa é uns 300 reais por mês que ela faz costurando.',
      'Não estou no CadÚnico ainda, nunca fiz.',
      'Tomo remédio de pressão todo mês, pesa no bolso.',
      'É isso, pode me orientar por favor.',
    ],
    itensEsperados: ['bpc-loas-idoso', 'bpc-loas-pcd'],
  },
  {
    nome: 'Trabalhador informal acidentado',
    respostas: [
      'Trabalho de pedreiro por conta própria e caí de uma laje na obra. Machuquei a coluna e não consigo trabalhar.',
      'Pago o INSS como autônomo sim, o carnê, faz uns três anos.',
      'Faz três semanas que não consigo trabalhar. Tenho os laudos do hospital.',
      'Moro com a família, a renda parou por causa do acidente.',
      'Só isso mesmo, o que eu faço?',
    ],
    itensEsperados: ['auxilio-incapacidade-temporaria', 'auxilio-acidente'],
  },
];

interface Medicao {
  perfil: string;
  rodada: number;
  perguntasFeitas: number;
  respostasUsadas: number;
  qtdItens: number;
  ids: string[];
  acertouEsperado: boolean;
  fichaCompleta: boolean;
  erro?: string;
}

const CAMPOS_FICHA = [
  'nome_popular',
  'categoria_vida',
  'natureza',
  'criterios_elegibilidade',
  'documentos_necessarios',
  'passo_a_passo',
  'fonte_legal',
  'ultima_revisao',
] as const;

function fichaEstaCompleta(resposta: Extract<RespostaTriagem, { tipo: 'resultado' }>): boolean {
  return resposta.itens.every(
    (item) =>
      CAMPOS_FICHA.every((campo) => {
        const valor = item[campo];
        return valor !== undefined && valor !== '' && !(Array.isArray(valor) && valor.length === 0);
      }) && Boolean(item.canal_solicitacao?.detalhe),
  );
}

async function medirUmaRodada(perfil: Perfil, rodada: number): Promise<Medicao> {
  const mensagens: MensagemChat[] = [];
  let resposta: RespostaTriagem | undefined;
  let perguntasFeitas = 0;
  let respostasUsadas = 0;

  try {
    for (let i = 0; i < 10; i++) {
      const fala = perfil.respostas[Math.min(i, perfil.respostas.length - 1)];
      mensagens.push({ papel: 'usuario', conteudo: fala });
      respostasUsadas++;
      resposta = await executarTriagem(mensagens);
      if (resposta.tipo !== 'pergunta') break;
      perguntasFeitas++;
      mensagens.push({ papel: 'assistente', conteudo: resposta.mensagem });
    }
  } catch (excecao) {
    return {
      perfil: perfil.nome,
      rodada,
      perguntasFeitas,
      respostasUsadas,
      qtdItens: 0,
      ids: [],
      acertouEsperado: false,
      fichaCompleta: false,
      erro: (excecao as Error).message.slice(0, 120),
    };
  }

  if (!resposta || resposta.tipo !== 'resultado') {
    return {
      perfil: perfil.nome,
      rodada,
      perguntasFeitas,
      respostasUsadas,
      qtdItens: 0,
      ids: [],
      acertouEsperado: false,
      fichaCompleta: false,
      erro: resposta?.tipo === 'sem_match' ? 'sem_match' : 'não fechou',
    };
  }

  const ids = resposta.itens.map((i) => i.id);
  return {
    perfil: perfil.nome,
    rodada,
    perguntasFeitas,
    respostasUsadas,
    qtdItens: ids.length,
    ids,
    acertouEsperado: perfil.itensEsperados.some((id) => ids.includes(id)),
    fichaCompleta: fichaEstaCompleta(resposta),
  };
}

const medicoes: Medicao[] = [];

for (const perfil of perfis) {
  console.log(`\n${'='.repeat(70)}\nPERFIL: ${perfil.nome}\n${'='.repeat(70)}`);
  for (let rodada = 1; rodada <= RODADAS_POR_PERFIL; rodada++) {
    const m = await medirUmaRodada(perfil, rodada);
    medicoes.push(m);
    const status = m.erro ? `ERRO: ${m.erro}` : `${m.qtdItens} itens: ${m.ids.join(', ')}`;
    console.log(
      `  rodada ${rodada}: ${m.perguntasFeitas} pergunta(s) de ${MAX_PERGUNTAS} permitidas | ${status}`,
    );
  }
}

console.log(`\n\n${'='.repeat(70)}\nRESUMO\n${'='.repeat(70)}`);

for (const perfil of perfis) {
  const doPerfil = medicoes.filter((m) => m.perfil === perfil.nome);
  const perguntas = doPerfil.map((m) => m.perguntasFeitas);
  const itens = doPerfil.map((m) => m.qtdItens);
  const conjuntos = new Set(doPerfil.map((m) => [...m.ids].sort().join('|')));
  const acertos = doPerfil.filter((m) => m.acertouEsperado).length;
  const fichas = doPerfil.filter((m) => m.fichaCompleta).length;

  console.log(`\n${perfil.nome}`);
  console.log(`  perguntas feitas .... ${perguntas.join(', ')} (permitido: ${MAX_PERGUNTAS})`);
  console.log(`  itens entregues ..... ${itens.join(', ')}`);
  console.log(`  resultados distintos  ${conjuntos.size} de ${RODADAS_POR_PERFIL} rodadas`);
  console.log(`  acertou o esperado .. ${acertos}/${RODADAS_POR_PERFIL}`);
  console.log(`  ficha completa ...... ${fichas}/${RODADAS_POR_PERFIL}`);
}

const todasPerguntas = medicoes.map((m) => m.perguntasFeitas);
const mediaPerguntas = todasPerguntas.reduce((a, b) => a + b, 0) / todasPerguntas.length;
const todosItens = medicoes.map((m) => m.qtdItens);
const mediaItens = todosItens.reduce((a, b) => a + b, 0) / todosItens.length;
const totalDistintos = perfis.filter((p) => {
  const c = new Set(medicoes.filter((m) => m.perfil === p.nome).map((m) => [...m.ids].sort().join('|')));
  return c.size > 1;
}).length;

console.log(`\n${'─'.repeat(70)}`);
console.log(`GERAL (${medicoes.length} execuções)`);
console.log(`  média de perguntas antes de fechar: ${mediaPerguntas.toFixed(1)} de ${MAX_PERGUNTAS}`);
console.log(`  média de itens entregues: ${mediaItens.toFixed(1)}`);
console.log(`  perfis com resultado INSTÁVEL entre rodadas: ${totalDistintos} de ${perfis.length}`);
console.log(`  ficha completa: ${medicoes.filter((m) => m.fichaCompleta).length}/${medicoes.length}`);
console.log(`  erros: ${medicoes.filter((m) => m.erro).length}/${medicoes.length}`);
