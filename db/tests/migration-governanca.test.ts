import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const caminho = fileURLToPath(
  new URL('../migrations/0004_governanca_conteudo.sql', import.meta.url),
);

function sqlNormalizado(): string {
  return readFileSync(caminho, 'utf8').replace(/\s+/g, ' ').toLowerCase();
}

describe('migration de governança do conteúdo', () => {
  it('adiciona os campos editoriais e restringe o status', () => {
    const sql = sqlNormalizado();
    for (const coluna of [
      'resumo_simples',
      'criterios_estruturados',
      'excecoes_e_alertas',
      'fontes_oficiais',
      'vigencia_inicio',
      'vigencia_fim',
      'status_conteudo',
      'revisado_por',
      'revisao_prevista_em',
      'versao_conteudo',
    ]) {
      expect(sql).toContain(`add column if not exists ${coluna}`);
    }
    expect(sql).toMatch(/status_conteudo in \('rascunho', 'revisao_pendente', 'publicavel', 'expirado'\)/);
  });

  it('revoga escrita pública e limita leitura a conteúdo publicável e vigente', () => {
    const sql = sqlNormalizado();
    expect(sql).toContain('revoke insert, update, delete on table public.direitos_itens from anon, authenticated');
    expect(sql).toContain('alter table public.direitos_itens enable row level security');
    expect(sql).toContain("status_conteudo = 'publicavel'");
    expect(sql).toContain('revisao_prevista_em >= current_date');
    expect(sql).toContain('vigencia_inicio is null or vigencia_inicio <= current_date');
    expect(sql).toContain('vigencia_fim is null or vigencia_fim >= current_date');
  });

  it('mantém a RPC como security invoker, limita parâmetros e fecha execução genérica', () => {
    const sql = sqlNormalizado();
    expect(sql).toContain('security invoker');
    expect(sql).toContain('set search_path = public, extensions');
    expect(sql).toContain('greatest(1, least(coalesce(limite, 8), 20))');
    expect(sql).toContain('greatest(0.0, least(coalesce(limiar, 0.30), 1.0))');
    expect(sql).toContain('revoke execute on function public.buscar_direitos(extensions.vector, integer, double precision) from public');
    expect(sql).toContain('grant execute on function public.buscar_direitos(extensions.vector, integer, double precision) to anon, authenticated, service_role');
  });
});
