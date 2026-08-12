import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PainelUrgencia } from '../src/componentes/PainelUrgencia';
import type { RespostaTriagem } from '../src/tipos';

describe('<PainelUrgencia>', () => {
  const resposta: Extract<RespostaTriagem, { tipo: 'urgencia' }> = {
    tipo: 'urgencia',
    nivel: 'imediato',
    mensagem: 'Se existe perigo agora, vá para um local seguro se puder.',
    canais: [
      { nome: 'Polícia Militar', numero: '190', quando_usar: 'Perigo acontecendo agora' },
      { nome: 'Central de Atendimento à Mulher', numero: '180', quando_usar: 'Orientação e acolhimento' },
    ],
  };

  it('mostra ajuda imediata e links telefônicos acionáveis', () => {
    render(<PainelUrgencia resposta={resposta} aoSair={vi.fn()} />);
    expect(screen.getByRole('alert')).toHaveTextContent(/ajuda imediata/i);
    expect(screen.getByRole('link', { name: /ligar 190/i })).toHaveAttribute('href', 'tel:190');
    expect(screen.getByRole('link', { name: /ligar 180/i })).toHaveAttribute('href', 'tel:180');
    expect(screen.getByText(/não confronte uma pessoa agressora/i)).toBeInTheDocument();
  });

  it('permite sair do painel e voltar ao início', async () => {
    const aoSair = vi.fn();
    const usuario = userEvent.setup();
    render(<PainelUrgencia resposta={resposta} aoSair={aoSair} />);
    await usuario.click(screen.getByRole('button', { name: /voltar ao início/i }));
    expect(aoSair).toHaveBeenCalledOnce();
  });
});
