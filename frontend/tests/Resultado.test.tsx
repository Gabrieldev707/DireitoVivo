import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CATALOGO_DIREITOS } from '../src/dados/catalogoDireitos';
import { Resultado } from '../src/componentes/resultado/Resultado';
import { Urgencia } from '../src/componentes/resultado/Urgencia';
import type { RespostaTriagem } from '../src/tipos';

const base = CATALOGO_DIREITOS[0];
const respostaOrientacao: Extract<RespostaTriagem, { tipo: 'orientacao' }> = {
  tipo: 'orientacao', resumo: 'Há um caminho que vale confirmar.', confianca: 'media', alertas: [],
  itens: [{ ...base, situacao: 'precisa_confirmar', criterios_confirmados: [], criterios_pendentes: ['Confirmar renda'], proximos_passos: base.passo_a_passo, documentos: base.documentos_necessarios, fontes: base.fontes_oficiais, posicao: 1, motivo: 'Renda informada' }],
};

describe('resultado acionável', () => {
  it('organiza possibilidade, pendências, documentos, canal e revisão', () => {
    render(<Resultado resposta={respostaOrientacao} aoRecomecar={vi.fn()} aoVerDireitos={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'O que pode se aplicar' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'O que confirmar' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Documentos para preparar' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Próximo passo' })).toBeVisible();
    expect(screen.getByText(/revisado em/i)).toBeVisible();
  });

  it('mostra canais urgentes antes da ação de saída', () => {
    const resposta: Extract<RespostaTriagem, { tipo: 'urgencia' }> = { tipo: 'urgencia', nivel: 'imediato', mensagem: 'Procure ajuda agora.', canais: [{ nome: 'SAMU', numero: '192', quando_usar: 'Emergência de saúde' }] };
    render(<Urgencia resposta={resposta} aoSair={vi.fn()} />);
    const texto = screen.getByRole('region', { name: 'Orientação urgente' }).textContent ?? '';
    expect(texto.indexOf('192')).toBeLessThan(texto.indexOf('Sair da orientação'));
  });
});
