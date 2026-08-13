// Carrega o .env da raiz do repositório, independente de onde o processo foi iniciado.
import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';

config({ path: fileURLToPath(new URL('../../.env', import.meta.url)), quiet: true });

export function obterEnv(nome: string, padrao?: string): string {
  const bruto = process.env[nome];
  const valor = bruto && bruto.trim() !== '' ? bruto.trim() : padrao?.trim();
  if (valor === undefined) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${nome} (veja .env.example)`);
  }
  return valor;
}
