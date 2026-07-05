// Chat de triagem no terminal — para testar o motor antes de plugar o frontend (SDD seção 8).
// Uso: npm run rag:cli (na raiz). Requer GEMINI_API_KEY no .env.
import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { executarTriagem, TEXTO_DISCLAIMER, type MensagemChat } from '../src/index.js';

const rl = readline.createInterface({ input: stdin, output: stdout });
const mensagens: MensagemChat[] = [];

console.log('=== Direito Vivo — triagem via terminal ===');
console.log(`AVISO: ${TEXTO_DISCLAIMER}`);
console.log('Conte sua situação com suas palavras (Ctrl+C para sair).\n');

let rodando = true;
while (rodando) {
  const entrada = (await rl.question('você > ')).trim();
  if (!entrada) continue;
  mensagens.push({ papel: 'usuario', conteudo: entrada });

  const resposta = await executarTriagem(mensagens);

  if (resposta.tipo === 'pergunta') {
    console.log(`\nassistente > ${resposta.mensagem}\n`);
    mensagens.push({ papel: 'assistente', conteudo: resposta.mensagem });
    continue;
  }

  console.log(`\nassistente > ${resposta.mensagem}\n`);
  if (resposta.tipo === 'sem_match') {
    console.log('(nenhum item da base se aplicou)');
  } else {
    console.log('=== SUA LINHA DE VIDA (comece pelo 1) ===');
    for (const item of resposta.itens) {
      console.log(`\n${item.posicao}. ${item.nome_popular}  [${item.natureza}] [prioridade ${item.prioridade_base}]`);
      if (item.motivo) console.log(`   Por quê: ${item.motivo}`);
      console.log(`   Quem tem direito: ${item.criterios_elegibilidade}`);
      console.log(`   Documentos: ${item.documentos_necessarios.join('; ')}`);
      console.log(`   Onde pedir: ${item.canal_solicitacao.detalhe}`);
      console.log(`   Passo a passo:`);
      item.passo_a_passo.forEach((passo, i) => console.log(`     ${i + 1}) ${passo}`));
      console.log(`   Fonte legal: ${item.fonte_legal} | Revisado em: ${item.ultima_revisao} | Abrangência: ${item.abrangencia}`);
    }
  }
  console.log(`\nAVISO: ${TEXTO_DISCLAIMER}`);
  rodando = false;
}
rl.close();
