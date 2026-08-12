import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chat } from '../src/componentes/Chat';
import type { MensagemChat } from '../src/tipos';

const historicoInicial: MensagemChat[] = [
  { papel: 'assistente', conteudo: 'Olá! Como está sua vida hoje?' },
];

describe('<Chat>', () => {
  it('renderiza a mensagem inicial do assistente', () => {
    render(
      <Chat mensagens={historicoInicial} enviando={false} aoEnviar={vi.fn()} />,
    );
    expect(screen.getByText(/como está sua vida hoje/i)).toBeInTheDocument();
    expect(screen.getByText(/direito vivo/i)).toBeInTheDocument();
  });

  it('mostra o estado "digitando…" enquanto enviando=true', () => {
    render(
      <Chat mensagens={historicoInicial} enviando aoEnviar={vi.fn()} />,
    );
    expect(screen.getByText(/digitando/i)).toBeInTheDocument();
  });

  it('exibe o aviso sobre CPF e processamento por provedor de IA', () => {
    render(
      <Chat mensagens={historicoInicial} enviando={false} aoEnviar={vi.fn()} />,
    );
    expect(screen.getByText(/não informe cpf/i)).toBeInTheDocument();
    expect(screen.getByText(/provedor de ia/i)).toBeInTheDocument();
  });

  it('chama aoEnviar quando o usuário digita e aperta Enter', async () => {
    const aoEnviar = vi.fn();
    const usuario = userEvent.setup();
    render(
      <Chat mensagens={historicoInicial} enviando={false} aoEnviar={aoEnviar} />,
    );

    const textarea = screen.getByLabelText(/escreva sua resposta/i);
    await usuario.type(textarea, 'preciso de bolsa família{Enter}');
    expect(aoEnviar).toHaveBeenCalledWith('preciso de bolsa família');
  });

  it('não envia mensagem vazia ao clicar em enviar', async () => {
    const aoEnviar = vi.fn();
    const usuario = userEvent.setup();
    render(
      <Chat mensagens={historicoInicial} enviando={false} aoEnviar={aoEnviar} />,
    );
    const botaoEnviar = screen.getByRole('button', { name: /enviar mensagem/i });
    expect(botaoEnviar).toBeDisabled();
    await usuario.click(botaoEnviar);
    expect(aoEnviar).not.toHaveBeenCalled();
  });

  it('desabilita o envio enquanto enviando=true', () => {
    render(
      <Chat mensagens={historicoInicial} enviando aoEnviar={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: /enviar mensagem/i })).toBeDisabled();
  });

  it('usa uma sugestão rápida como mensagem', async () => {
    const aoEnviar = vi.fn();
    const usuario = userEvent.setup();
    render(
      <Chat mensagens={historicoInicial} enviando={false} aoEnviar={aoEnviar} />,
    );
    await usuario.click(screen.getByRole('button', { name: /trabalho sem carteira/i }));
    expect(aoEnviar).toHaveBeenCalledWith('Trabalho sem carteira');
  });

  it('exibe o erro devolvido pela API', () => {
    render(
      <Chat
        mensagens={historicoInicial}
        enviando={false}
        erro="tempo esgotado"
        aoEnviar={vi.fn()}
      />,
    );
    const alerta = screen.getByRole('alert');
    expect(alerta).toHaveTextContent(/tempo esgotado/i);
  });

  it('renderiza bolha do usuário à direita e do assistente à esquerda', () => {
    const historico: MensagemChat[] = [
      { papel: 'assistente', conteudo: 'oi' },
      { papel: 'usuario', conteudo: 'oi de volta' },
    ];
    const { container } = render(
      <Chat mensagens={historico} enviando={false} aoEnviar={vi.fn()} />,
    );
    expect(container.querySelector('.wa-bubble--user')).not.toBeNull();
    expect(container.querySelector('.wa-bubble--bot')).not.toBeNull();
  });
});
