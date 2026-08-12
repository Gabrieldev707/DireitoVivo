// Ponto de entrada do módulo rag — tudo que os outros módulos (api, db) podem usar.
export * from './tipos.js';
export { obterEnv } from './config.js';
export { criarProvedorLLM, obterProvedorLLM, type ProvedorLLM, type OpcoesGeracao } from './provedor-llm.js';
export { criarClienteSupabase, obterSupabase } from './supabase.js';
export { construirTextoEmbedding, DIMENSOES_EMBEDDING, type EntradaTextoEmbedding } from './embeddings.js';
export { buscarItensRelevantes, listarTodosItens, buscarFichasPorIds } from './busca.js';
export { executarTriagem, ordenarLinhaDaVida, ErroTriagem, TEXTO_DISCLAIMER } from './triagem.js';
export { MAX_PERGUNTAS, MENSAGEM_SEM_MATCH } from './prompts.js';
export { obterModoAplicacao, validarModoAplicacao, type ModoAplicacao } from './modo-aplicacao.js';
export { protegerMensagens, type CategoriaDado } from './protecao-dados.js';
export { detectarUrgencia } from './urgencia.js';
