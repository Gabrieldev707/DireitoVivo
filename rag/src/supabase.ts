import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { obterEnv } from './config.js';

export function criarClienteSupabase(opcoes?: { usarChaveServico?: boolean }): SupabaseClient {
  const chave = opcoes?.usarChaveServico
    ? obterEnv('SUPABASE_CHAVE_SERVICO')
    : obterEnv('SUPABASE_CHAVE_PUBLICA');
  return createClient(obterEnv('SUPABASE_URL'), chave, {
    auth: { persistSession: false },
  });
}

let instancia: SupabaseClient | undefined;

/** Cliente somente-leitura (chave publicável) usado pelo motor de triagem. */
export function obterSupabase(): SupabaseClient {
  instancia ??= criarClienteSupabase();
  return instancia;
}
