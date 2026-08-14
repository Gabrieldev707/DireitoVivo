import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Conversa } from '../src/componentes/conversa/Conversa';
import { PreferenciasProvider } from '../src/acessibilidade/PreferenciasProvider';

describe('estrutura da conversa', () => {
  it('mantém apenas a lista de mensagens como área rolável', () => {
    render(<PreferenciasProvider><Conversa mensagens={[{ papel: 'assistente', conteudo: 'Olá' }]} enviando={false} aoEnviar={vi.fn()} /></PreferenciasProvider>);
    expect(screen.getByTestId('conversa-shell')).toHaveAttribute('data-layout', 'viewport');
    expect(screen.getAllByTestId('area-rolavel')).toHaveLength(1);
    expect(screen.getByTestId('compositor')).toHaveAttribute('data-safe-area', 'bottom');
  });
});
