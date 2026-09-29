import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/App';

const enviarTriagem = vi.fn();
vi.mock('../src/api', () => ({ enviarTriagem: (...args: unknown[]) => enviarTriagem(...args) }));

afterEach(() => {
  enviarTriagem.mockReset();
  window.location.hash = '';
});

describe('<App> consentimento', () => {
  it('mostra a prévia antes de enviar o cenário', async () => {
    const usuario = userEvent.setup();
    enviarTriagem.mockResolvedValue({ tipo: 'pergunta', mensagem: 'Qual sua renda?' });
    render(<App />);
    await usuario.click(within(screen.getByRole('navigation', { name: /navegação principal/i })).getByRole('button', { name: /^situações/i }));
    await usuario.click(screen.getAllByRole('button', { name: /ver prévia da conversa/i })[0]);
    expect(enviarTriagem).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toHaveTextContent(/Perdi renda recentemente/i);
    await usuario.click(screen.getByRole('checkbox', { name: /entendi/i }));
    await usuario.click(screen.getByRole('button', { name: /iniciar demonstração/i }));
    await waitFor(() => expect(enviarTriagem).toHaveBeenCalledOnce());
    expect(enviarTriagem.mock.calls[0][0]).toContainEqual(expect.objectContaining({ papel: 'usuario', conteudo: expect.stringContaining('Perdi renda recentemente') }));
    expect(enviarTriagem.mock.calls[0][1]).toBe(true);
  });

  it('permite fechar o aviso sem enviar e continuar no catálogo', async () => {
    const usuario = userEvent.setup();
    render(<App />);
    await usuario.click(within(screen.getByRole('navigation', { name: /navegação principal/i })).getByRole('button', { name: /^situações/i }));
    await usuario.click(screen.getAllByRole('button', { name: /ver prévia da conversa/i })[0]);
    await usuario.click(screen.getByRole('button', { name: /continuar sem conversa/i }));
    expect(enviarTriagem).not.toHaveBeenCalled();
    await usuario.click(within(screen.getByRole('navigation', { name: /navegação principal/i })).getByRole('button', { name: /^direitos/i }));
    expect(screen.getByLabelText(/buscar no catálogo/i)).toBeInTheDocument();
  });

  it('abre Ajuda e volta à conversa sem apagar mensagens', async () => {
    const usuario = userEvent.setup();
    enviarTriagem.mockResolvedValue({ tipo: 'pergunta', mensagem: 'Qual sua renda?' });
    render(<App />);
    const navegacao = within(screen.getByRole('navigation', { name: /navegação principal/i }));
    await usuario.click(navegacao.getByRole('button', { name: /^conversa/i }));
    await usuario.type(screen.getByRole('textbox', { name: /escreva sua resposta/i }), 'Preciso de apoio{Enter}');
    await usuario.click(screen.getByRole('checkbox', { name: /entendi/i }));
    await usuario.click(screen.getByRole('button', { name: /iniciar demonstração/i }));
    await waitFor(() => expect(screen.getByText('Preciso de apoio')).toBeInTheDocument());
    await usuario.click(navegacao.getByRole('button', { name: /^ajuda/i }));
    expect(screen.getByRole('heading', { name: /encontre ajuda/i })).toBeInTheDocument();
    await usuario.click(navegacao.getByRole('button', { name: /^conversa/i }));
    expect(screen.getByText('Preciso de apoio')).toBeInTheDocument();
  });

  it('abre hash legado e responde a voltar/avançar sem expor relato na URL', async () => {
    window.location.hash = '#catalogo';
    render(<App />);
    expect(screen.getByLabelText(/buscar no catálogo/i)).toBeInTheDocument();
    window.location.hash = '#ajuda';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    await waitFor(() => expect(screen.getByRole('heading', { name: /encontre ajuda/i })).toBeInTheDocument());
    expect(window.location.hash).toBe('#ajuda');
  });
});
