import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Conversa } from '../src/componentes/conversa/Conversa';
import type { MensagemChat } from '../src/tipos';
import type { ReactElement } from 'react';
import { PreferenciasProvider } from '../src/acessibilidade/PreferenciasProvider';

const mensagens: MensagemChat[] = [
  { papel: 'assistente', conteudo: 'Conte o que está acontecendo, sem informar dados pessoais.' },
];
const renderConversa=(ui:ReactElement)=>render(<PreferenciasProvider>{ui}</PreferenciasProvider>);

describe('conversa responsiva', () => {
  it('explica o processo e oferece ajuda presencial sem parecer um formulário vazio', () => {
    renderConversa(<Conversa mensagens={mensagens} enviando={false} aoEnviar={vi.fn()} />);
    expect(screen.getByText('O que vamos descobrir')).toBeVisible();
    expect(screen.getByText(/^Ao final, indicamos onde confirmar:/i)).toBeVisible();
    expect(screen.getByText(/prefere atendimento presencial/i)).toBeVisible();
  });

  it('envia com Enter e quebra linha com Shift+Enter', async () => {
    const user = userEvent.setup();
    const aoEnviar = vi.fn();
    renderConversa(<Conversa mensagens={mensagens} enviando={false} aoEnviar={aoEnviar} />);
    const entrada = screen.getByRole('textbox', { name: 'Escreva sua resposta' });

    await user.type(entrada, 'Minha renda caiu{Shift>}{Enter}{/Shift}este mês');
    expect(entrada).toHaveValue('Minha renda caiu\neste mês');
    await user.keyboard('{Enter}');
    expect(aoEnviar).toHaveBeenCalledWith('Minha renda caiu\neste mês');
  });

  it('oferece reenvio quando a API falha', async () => {
    const user = userEvent.setup();
    const aoTentarNovamente = vi.fn();
    renderConversa(<Conversa mensagens={mensagens} enviando={false} erro="Falha de conexão" aoEnviar={vi.fn()} aoTentarNovamente={aoTentarNovamente} />);
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(aoTentarNovamente).toHaveBeenCalledOnce();
  });
});
