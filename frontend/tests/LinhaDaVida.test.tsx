import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LinhaDaVida } from '../src/componentes/LinhaDaVida';
import type { ItemOrientacao, RespostaTriagem } from '../src/tipos';

function criarItem(patch: Partial<ItemOrientacao> = {}): ItemOrientacao {
  return {
    id: 'bolsa-familia',
    nome_popular: 'Bolsa Família',
    categoria_vida: 'familia_crianca',
    natureza: 'beneficio',
    criterios_elegibilidade: 'renda por pessoa até R$ 218',
    documentos_necessarios: ['CPF', 'CadÚnico'],
    canal_solicitacao: { tipo: 'presencial', detalhe: 'CRAS do seu bairro' },
    passo_a_passo: ['Ir ao CRAS', 'Levar documentos'],
    fonte_legal: 'Lei 14.601/2023',
    prioridade_base: 1,
    ultima_revisao: '2026-01-01',
    abrangencia: 'federal',
    posicao: 1,
    motivo: 'renda familiar baixa',
    situacao: 'precisa_confirmar',
    criterios_confirmados: ['Família com baixa renda'],
    criterios_pendentes: ['Confirmar renda por pessoa'],
    proximos_passos: ['Ir ao CRAS', 'Levar documentos'],
    documentos: ['CPF', 'CadÚnico'],
    resumo_simples: 'Resumo simples do programa.',
    criterios_estruturados: [{ id: 'renda', descricao: 'Confirmar renda', confirmacao: 'documental' }],
    excecoes_e_alertas: ['Confirme no canal oficial.'],
    fontes_oficiais: [{
      titulo: 'Página oficial do programa',
      url: 'https://www.gov.br/programa',
      orgao: 'Ministério responsável',
      acessado_em: '2026-08-12',
    }],
    revisao_prevista_em: '2026-11-12',
    vigencia_inicio: null,
    vigencia_fim: null,
    versao_conteudo: 1,
    fontes: [{
      titulo: 'Página oficial do programa',
      url: 'https://www.gov.br/programa',
      orgao: 'Ministério responsável',
      acessado_em: '2026-08-12',
    }],
    ...patch,
  };
}

describe('<LinhaDaVida>', () => {
  const resultadoOk: Extract<RespostaTriagem, { tipo: 'orientacao' }> = {
    tipo: 'orientacao',
    resumo: 'Encontrei alguns caminhos que vale confirmar.',
    confianca: 'media',
    alertas: [],
    itens: [
      criarItem({ posicao: 1, id: 'bolsa-familia', nome_popular: 'Bolsa Família' }),
      criarItem({
        posicao: 2,
        id: 'seguro-desemprego',
        nome_popular: 'Seguro-desemprego',
        prioridade_base: 2,
      }),
    ],
  };

  it('exibe a mensagem do resultado, títulos dos itens e disclaimer', () => {
    render(
      <LinhaDaVida
        resultado={resultadoOk}
        aoRecomecar={vi.fn()}
        aoVerCatalogo={vi.fn()}
      />,
    );
    expect(screen.getByText(/comece por aqui/i)).toBeInTheDocument();
    expect(screen.getByText('Bolsa Família')).toBeInTheDocument();
    expect(screen.getByText('Seguro-desemprego')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: /o que parece compatível/i }).length).toBe(2);
    expect(screen.getAllByRole('heading', { name: /o que confirmar/i }).length).toBe(2);
    expect(screen.getAllByRole('heading', { name: /próximos passos/i }).length).toBe(2);
    expect(screen.getAllByRole('heading', { name: 'Documentos', exact: true }).length).toBe(2);
    expect(screen.getAllByRole('link', { name: /página oficial do programa/i })).toHaveLength(2);
    // Disclaimer RF06
    expect(screen.getByText(/não substitui aconselhamento jurídico/i)).toBeInTheDocument();
  });

  it('respeita a ordem passada no resultado (RF04)', () => {
    render(
      <LinhaDaVida
        resultado={resultadoOk}
        aoRecomecar={vi.fn()}
        aoVerCatalogo={vi.fn()}
      />,
    );
    const titulos = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(titulos.slice(0, 2)).toEqual(['Bolsa Família', 'Seguro-desemprego']);
  });

  it('mostra mensagem alternativa quando o resultado é sem_match', () => {
    const semMatch: Extract<RespostaTriagem, { tipo: 'sem_match' }> = {
      tipo: 'sem_match',
      mensagem: 'Não encontrei um item específico com o que você me contou.',
      proximos_passos: ['Procure o CRAS.'],
    };
    const { container } = render(
      <LinhaDaVida
        resultado={semMatch}
        aoRecomecar={vi.fn()}
        aoVerCatalogo={vi.fn()}
      />,
    );
    expect(
      screen.getByText('Não encontrei um item específico com o que você me contou.'),
    ).toBeInTheDocument();
    // Não deve haver ficha de item (nenhuma <details>)
    expect(container.querySelectorAll('details').length).toBe(0);
  });

  it('aciona aoRecomecar ao clicar no botão de nova triagem', async () => {
    const aoRecomecar = vi.fn();
    const usuario = userEvent.setup();
    render(
      <LinhaDaVida
        resultado={resultadoOk}
        aoRecomecar={aoRecomecar}
        aoVerCatalogo={vi.fn()}
      />,
    );
    await usuario.click(screen.getByRole('button', { name: /fazer nova triagem/i }));
    expect(aoRecomecar).toHaveBeenCalled();
  });

  it('botão de compartilhar chama navigator.share com a linha de vida', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    (navigator as unknown as { share: typeof share }).share = share;

    const usuario = userEvent.setup();
    render(
      <LinhaDaVida
        resultado={resultadoOk}
        aoRecomecar={vi.fn()}
        aoVerCatalogo={vi.fn()}
      />,
    );
    await usuario.click(screen.getByRole('button', { name: /^compartilhar$/i }));
    await waitFor(() => expect(share).toHaveBeenCalled());
    const payload = share.mock.calls[0][0] as { title: string; text: string; url: string };
    expect(payload.title).toContain('Direito Vivo');
    expect(payload.text).toContain('Bolsa Família');
    expect(payload.url).toMatch(/^http/);
  });
});
