// Gera embeddings para todos os itens da base de conhecimento e grava na coluna `embedding`.
// Requer GEMINI_API_KEY e SUPABASE_CHAVE_SERVICO no .env da raiz.
// Uso: npm run db:embeddings (na raiz). Reexecutável: refaz todos os itens (a base é pequena).
import {
  criarClienteSupabase,
  criarProvedorLLM,
  construirTextoEmbedding,
} from '@direito-vivo/rag';

const supabase = criarClienteSupabase({ usarChaveServico: true });
const provedor = criarProvedorLLM();

const { data: itens, error } = await supabase
  .from('direitos_itens')
  .select('id, nome_popular, categoria_vida, natureza, criterios_elegibilidade, canal_detalhe, termos_populares')
  .order('id');

if (error || !itens) {
  console.error('Falha ao ler itens:', error?.message);
  process.exit(1);
}

console.log(`Gerando embeddings para ${itens.length} itens com "${provedor.nome}"...`);

let falhas = 0;
for (const item of itens) {
  const texto = construirTextoEmbedding(item);
  try {
    const embedding = await gerarComTentativas(texto);
    const { error: erroUpdate } = await supabase
      .from('direitos_itens')
      .update({ embedding: JSON.stringify(embedding), texto_embedding: texto, atualizado_em: new Date().toISOString() })
      .eq('id', item.id);
    if (erroUpdate) throw new Error(erroUpdate.message);
    console.log(`  ok: ${item.id}`);
  } catch (erro) {
    falhas++;
    console.error(`  FALHOU: ${item.id} — ${(erro as Error).message}`);
  }
}

// O tier free do Gemini tem limite de requisições por minuto; em caso de 429, espera e tenta de novo.
async function gerarComTentativas(texto: string, tentativas = 3): Promise<number[]> {
  for (let i = 1; ; i++) {
    try {
      return await provedor.gerarEmbedding(texto, 'documento');
    } catch (erro) {
      const mensagem = (erro as Error).message ?? '';
      if (i >= tentativas || !/429|RESOURCE_EXHAUSTED|rate/i.test(mensagem)) throw erro;
      console.log(`    limite de requisições atingido; aguardando 25s (tentativa ${i}/${tentativas})...`);
      await new Promise((r) => setTimeout(r, 25_000));
    }
  }
}

if (falhas > 0) {
  console.error(`Concluído com ${falhas} falha(s). Rode de novo para completar.`);
  process.exit(1);
}
console.log('Embeddings gerados para todos os itens.');
