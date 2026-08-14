import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { PreferenciasProvider, usePreferenciasAcessibilidade } from '../src/acessibilidade/PreferenciasProvider';

function Leitor() { const { preferencias, atualizar, restaurar } = usePreferenciasAcessibilidade(); return <><output>{JSON.stringify(preferencias)}</output><button onClick={() => atualizar({ modoGuiado:true })}>Guiar</button><button onClick={restaurar}>Restaurar</button></>; }

describe('preferências compartilhadas', () => {
  beforeEach(() => localStorage.clear());
  it('persiste somente preferências e nunca conteúdo de conversa', async () => {
    render(<PreferenciasProvider><Leitor /></PreferenciasProvider>);
    await userEvent.click(screen.getByRole('button',{name:'Guiar'}));
    const salvo = localStorage.getItem('direito-vivo-acessibilidade') ?? '';
    expect(salvo).toContain('"modoGuiado":true');
    expect(salvo).not.toMatch(/mensagens|transcricao|conteudo/);
  });
  it('restaura padrão mesmo após JSON inválido', () => {
    localStorage.setItem('direito-vivo-acessibilidade','{inválido');
    render(<PreferenciasProvider><Leitor /></PreferenciasProvider>);
    expect(screen.getByText(/"modoGuiado":false/)).toBeVisible();
  });
});
