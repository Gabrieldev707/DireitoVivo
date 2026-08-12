import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { auditarItens, type ItemConteudo } from '../src/conteudo.js';

const argumentoHoje = process.argv.find((argumento) => argumento.startsWith('--hoje='));
const hoje = argumentoHoje?.slice('--hoje='.length) ?? new Date().toISOString().slice(0, 10);
const caminhoSeed = fileURLToPath(new URL('../seed/itens.json', import.meta.url));
const itens = JSON.parse(readFileSync(caminhoSeed, 'utf8')) as ItemConteudo[];
const problemas = auditarItens(itens, hoje);

for (const problema of problemas) {
  const rotulo = problema.severidade === 'erro' ? 'ERRO' : 'AVISO';
  console.log(`[${rotulo}] ${problema.item_id} · ${problema.codigo} · ${problema.mensagem}`);
}

const erros = problemas.filter((problema) => problema.severidade === 'erro').length;
const avisos = problemas.length - erros;
console.log(`Auditoria editorial: ${itens.length} itens, ${erros} erro(s), ${avisos} aviso(s).`);
process.exitCode = erros > 0 ? 1 : 0;
