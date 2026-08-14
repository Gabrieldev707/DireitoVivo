import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PreferenciasProvider } from '../src/acessibilidade/PreferenciasProvider';
import { Conversa } from '../src/componentes/conversa/Conversa';
import { ProgressoConversa } from '../src/componentes/conversa/ProgressoConversa';

const mensagens=[{papel:'assistente' as const,conteudo:'Você perdeu o emprego recentemente?'}];
function renderGuiado(aoEnviar=vi.fn()){return render(<PreferenciasProvider preferenciasIniciais={{modoGuiado:true}}><Conversa mensagens={mensagens} enviando={false} aoEnviar={aoEnviar}/></PreferenciasProvider>)}

describe('chat acessível',()=>{
  it('oferece respostas guiadas e mantém texto livre',async()=>{renderGuiado();expect(screen.getByRole('button',{name:'Sim'})).toBeVisible();expect(screen.getByRole('button',{name:'Não'})).toBeVisible();expect(screen.getByRole('button',{name:'Não sei'})).toBeVisible();await userEvent.click(screen.getByRole('button',{name:'Quero explicar com minhas palavras'}));expect(screen.getByRole('textbox',{name:'Escreva sua resposta'})).toHaveFocus();});
  it('não apresenta progresso como percentual',()=>{render(<ProgressoConversa etapa="organizar"/>);expect(screen.getByText('Organizar')).toHaveAttribute('aria-current','step');expect(document.body).not.toHaveTextContent(/%|perguntas restantes/i);});
  it('expõe ajustes específicos da conversa',async()=>{renderGuiado();await userEvent.click(screen.getByRole('button',{name:'Acessibilidade da conversa'}));expect(screen.getByRole('dialog',{name:'Acessibilidade da conversa'})).toBeVisible();expect(screen.getByRole('switch',{name:'Modo guiado'})).toBeChecked();expect(screen.getByRole('link',{name:'Página de acessibilidade'})).toHaveAttribute('href','#acessibilidade');});
  it('revisa texto antes de enviar quando a preferência está ativa',async()=>{const aoEnviar=vi.fn();render(<PreferenciasProvider preferenciasIniciais={{confirmarEnvio:true}}><Conversa mensagens={mensagens} enviando={false} aoEnviar={aoEnviar}/></PreferenciasProvider>);await userEvent.type(screen.getByRole('textbox'),'Minha renda caiu');await userEvent.click(screen.getByRole('button',{name:'Enviar mensagem'}));expect(aoEnviar).not.toHaveBeenCalled();expect(screen.getByRole('dialog',{name:'Confirmar mensagem'})).toHaveTextContent('Minha renda caiu');await userEvent.click(screen.getByRole('button',{name:'Confirmar envio'}));expect(aoEnviar).toHaveBeenCalledWith('Minha renda caiu');});
});
