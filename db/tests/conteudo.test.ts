import { describe, expect, it } from 'vitest';
import { auditarItens, podeSerPublicado, type ItemConteudo } from '../src/conteudo.js';
import { carregarSeedGovernado } from '../src/seed-governado.js';

const HOJE = '2026-08-12';

function itemValido(patch: Partial<ItemConteudo> = {}): ItemConteudo {
  return {
    id: 'bolsa-familia',
    nome_popular: 'Bolsa Família',
    resumo_simples: 'Programa de transferência de renda para famílias que atendem aos critérios oficiais.',
    criterios_elegibilidade: 'A família precisa atender aos critérios de renda e cadastro vigentes.',
    criterios_estruturados: [
      { id: 'renda', descricao: 'Confirmar a renda por pessoa', confirmacao: 'documental' },
    ],
    documentos_necessarios: ['Documento de identificação'],
    canal_solicitacao: { tipo: 'presencial', detalhe: 'CRAS do município' },
    passo_a_passo: ['Procure o CRAS para confirmar o cadastro.'],
    fonte_legal: 'Lei 14.601/2023',
    excecoes_e_alertas: ['A concessão depende de análise oficial.'],
    fontes_oficiais: [
      {
        titulo: 'Bolsa Família',
        url: 'https://www.gov.br/mds/pt-br/acoes-e-programas/bolsa-familia',
        orgao: 'Ministério do Desenvolvimento e Assistência Social',
        acessado_em: HOJE,
      },
    ],
    status_conteudo: 'publicavel',
    revisado_por: 'equipe-editorial',
    ultima_revisao: '2026-08-01',
    revisao_prevista_em: '2026-11-01',
    vigencia_inicio: '2023-06-19',
    vigencia_fim: null,
    versao_conteudo: 1,
    ...patch,
  };
}

describe('auditoria editorial', () => {
  it('aceita item publicável com fonte oficial e revisão válida', () => {
    expect(auditarItens([itemValido()], HOJE)).toEqual([]);
    expect(podeSerPublicado(itemValido(), HOJE)).toBe(true);
  });

  it.each([
    ['URL sem HTTPS', 'http://www.gov.br/mds', 'fonte_url_insegura'],
    ['domínio não oficial', 'https://direitos.example.com/bolsa', 'fonte_dominio_nao_oficial'],
    ['domínio que imita o oficial', 'https://gov.br.direitos.example.com/bolsa', 'fonte_dominio_nao_oficial'],
  ])('bloqueia %s', (_nome, url, codigo) => {
    const item = itemValido({
      fontes_oficiais: [{ ...itemValido().fontes_oficiais[0], url }],
    });
    expect(auditarItens([item], HOJE)).toContainEqual(
      expect.objectContaining({ item_id: item.id, codigo, severidade: 'erro' }),
    );
    expect(podeSerPublicado(item, HOJE)).toBe(false);
  });

  it('bloqueia item publicável sem fonte', () => {
    const item = itemValido({ fontes_oficiais: [] });
    expect(auditarItens([item], HOJE)).toContainEqual(
      expect.objectContaining({ codigo: 'fonte_ausente', severidade: 'erro' }),
    );
  });

  it('bloqueia revisão vencida e vigência encerrada', () => {
    const item = itemValido({ revisao_prevista_em: '2026-08-11', vigencia_fim: '2026-08-10' });
    const codigos = auditarItens([item], HOJE).map((problema) => problema.codigo);
    expect(codigos).toContain('revisao_vencida');
    expect(codigos).toContain('vigencia_encerrada');
  });

  it('bloqueia programa temporário publicável sem vigência final', () => {
    const item = itemValido({ programa_temporario: true, vigencia_fim: null });
    expect(auditarItens([item], HOJE)).toContainEqual(
      expect.objectContaining({ codigo: 'programa_temporario_sem_vigencia' }),
    );
  });

  it('bloqueia campo essencial vazio e afirmação absoluta', () => {
    const item = itemValido({
      resumo_simples: 'Você tem direito garantido ao benefício.',
      passo_a_passo: [],
    });
    const codigos = auditarItens([item], HOJE).map((problema) => problema.codigo);
    expect(codigos).toContain('campo_essencial_vazio');
    expect(codigos).toContain('afirmacao_absoluta');
  });

  it('bloqueia IDs duplicados', () => {
    expect(auditarItens([itemValido(), itemValido()], HOJE)).toContainEqual(
      expect.objectContaining({ item_id: 'bolsa-familia', codigo: 'id_duplicado' }),
    );
  });

  it('mantém rascunhos fora da publicação sem exigir fonte completa', () => {
    const rascunho = itemValido({ status_conteudo: 'rascunho', fontes_oficiais: [] });
    expect(podeSerPublicado(rascunho, HOJE)).toBe(false);
    expect(auditarItens([rascunho], HOJE)).toContainEqual(
      expect.objectContaining({ codigo: 'item_nao_publicavel', severidade: 'aviso' }),
    );
  });

  it('trata status ausente ou desconhecido como erro de contrato', () => {
    const legado = itemValido({ status_conteudo: undefined as unknown as ItemConteudo['status_conteudo'] });
    expect(auditarItens([legado], HOJE)).toContainEqual(
      expect.objectContaining({ codigo: 'status_invalido', severidade: 'erro' }),
    );
  });
});

describe('seed governado', () => {
  it('enriquece os 30 itens e libera somente o lote com fonte verificada', () => {
    const itens = carregarSeedGovernado();
    expect(itens).toHaveLength(30);
    expect(new Set(itens.map((item) => item.id)).size).toBe(30);
    expect(itens.every((item) => item.resumo_simples && item.criterios_estruturados.length > 0)).toBe(true);

    const publicaveis = itens.filter((item) => item.status_conteudo === 'publicavel');
    expect(publicaveis.map((item) => item.id).sort()).toEqual([
      'auxilio-incapacidade-temporaria',
      'bolsa-familia',
      'bpc-loas-idoso',
      'bpc-loas-pcd',
      'caps',
      'farmacia-popular',
      'seguro-desemprego',
    ]);
    expect(auditarItens(itens, HOJE).filter((problema) => problema.severidade === 'erro')).toEqual([]);
  });

  it('não publica a alegação não comprovada de um novo Desenrola Brasil', () => {
    const item = carregarSeedGovernado().find((candidato) => candidato.id === 'novo-desenrola-brasil');
    expect(item?.status_conteudo).toBe('rascunho');
    expect(item?.fontes_oficiais).toEqual([]);
  });
});
