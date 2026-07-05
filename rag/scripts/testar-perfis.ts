// Teste dos critérios de aceite (SDD seção 7) com os 3 perfis citados na spec:
// mãe solo desempregada; idoso com deficiência; trabalhador informal acidentado.
// Para cada perfil: roda a triagem com respostas roteirizadas, exige >= 1 item relevante,
// ficha completa (RF05) e resultado ordenado (RF04). Requer GEMINI_API_KEY no .env.
// Uso: npm run rag:testes (na raiz).
import { executarTriagem, type MensagemChat, type RespostaTriagem } from '../src/index.js';

interface Perfil {
  nome: string;
  respostas: string[];
  itensEsperados: string[]; // pelo menos UM destes deve aparecer
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

const CAMPOS_FICHA: const_ficha[] = [
  'nome_popular',
  'categoria_vida',
  'natureza',
  'criterios_elegibilidade',
  'documentos_necessarios',
  'passo_a_passo',
  'fonte_legal',
  'ultima_revisao',
];
type const_ficha = 'nome_popular' | 'categoria_vida' | 'natureza' | 'criterios_elegibilidade' | 'documentos_necessarios' | 'passo_a_passo' | 'fonte_legal' | 'ultima_revisao';

let falhas = 0;

for (const perfil of perfis) {
  console.log(`\n=== Perfil: ${perfil.nome} ===`);
  const mensagens: MensagemChat[] = [];
  let resposta: RespostaTriagem | undefined;

  for (let rodada = 0; rodada < 10; rodada++) {
    const fala = perfil.respostas[Math.min(rodada, perfil.respostas.length - 1)];
    mensagens.push({ papel: 'usuario', conteudo: fala });
    console.log(`  você > ${fala.slice(0, 80)}...`);
    resposta = await executarTriagem(mensagens);
    if (resposta.tipo !== 'pergunta') break;
    console.log(`  assistente > ${resposta.mensagem}`);
    mensagens.push({ papel: 'assistente', conteudo: resposta.mensagem });
  }

  if (!resposta || resposta.tipo === 'pergunta') {
    console.error('  FALHOU: a triagem não chegou a um resultado em 10 rodadas.');
    falhas++;
    continue;
  }
  if (resposta.tipo === 'sem_match' || resposta.itens.length === 0) {
    console.error('  FALHOU: nenhum item retornado (critério: pelo menos 1 relevante).');
    falhas++;
    continue;
  }

  const ids = resposta.itens.map((i) => i.id);
  console.log(`  Resultado (${ids.length} itens, em ordem): ${ids.join(' → ')}`);

  // Critério: pelo menos 1 item esperado para o perfil
  if (!perfil.itensEsperados.some((id) => ids.includes(id))) {
    console.error(`  FALHOU: esperava ao menos um de [${perfil.itensEsperados.join(', ')}].`);
    falhas++;
    continue;
  }
  // RF05: ficha completa em todos os itens
  const incompletos = resposta.itens.filter((item) =>
    CAMPOS_FICHA.some((campo) => {
      const valor = item[campo];
      return valor === undefined || valor === '' || (Array.isArray(valor) && valor.length === 0);
    }) || !item.canal_solicitacao?.detalhe,
  );
  if (incompletos.length > 0) {
    console.error(`  FALHOU (RF05): ficha incompleta em: ${incompletos.map((i) => i.id).join(', ')}`);
    falhas++;
    continue;
  }
  // RF04: posições sequenciais a partir de 1 (linha de vida, não lista solta)
  const posicoesOk = resposta.itens.every((item, indice) => item.posicao === indice + 1);
  if (!posicoesOk) {
    console.error('  FALHOU (RF04): posições da linha de vida fora de ordem.');
    falhas++;
    continue;
  }
  console.log('  PASSOU ✔');
}

console.log(falhas === 0 ? '\nTodos os perfis passaram.' : `\n${falhas} perfil(is) falharam.`);
process.exit(falhas === 0 ? 0 : 1);
