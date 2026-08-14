import { render,screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach,describe,expect,it,vi } from 'vitest';
import { Mensagem } from '../src/componentes/conversa/Mensagem';
import { PreferenciasProvider } from '../src/acessibilidade/PreferenciasProvider';
import { Compositor } from '../src/componentes/conversa/Compositor';
import { sintetizadorDeVoz } from '../src/acessibilidade/sinteseVoz';

let ultimoReconhecimento: ReconhecimentoFake;
class ReconhecimentoFake {
 lang='';interimResults=false;continuous=false;maxAlternatives=1;onresult?: (e:any)=>void;onerror?: (e:any)=>void;onend?:()=>void;start=vi.fn();abort=vi.fn();
 constructor(){ultimoReconhecimento=this;}
}

describe('voz acessível',()=>{
 beforeEach(()=>{vi.clearAllMocks();});
 it('cancela leitura anterior antes de ouvir uma mensagem',async()=>{render(<Mensagem mensagem={{papel:'assistente',conteudo:'Orientação'}}/>);await userEvent.click(screen.getByRole('button',{name:'Ouvir mensagem'}));expect(window.speechSynthesis.cancel).toHaveBeenCalled();expect(window.speechSynthesis.speak).toHaveBeenCalled();});
 it('respeita a velocidade de leitura escolhida',()=>{sintetizadorDeVoz.ouvir('Orientação','rapida');expect(window.speechSynthesis.speak).toHaveBeenCalledWith(expect.objectContaining({rate:1.25,lang:'pt-BR'}));});
 it('explica processamento externo antes da primeira escuta',async()=>{(window as any).SpeechRecognition=ReconhecimentoFake;render(<PreferenciasProvider><Compositor enviando={false} aoEnviar={vi.fn()}/></PreferenciasProvider>);await userEvent.click(screen.getByRole('button',{name:'Falar em vez de digitar'}));expect(screen.getByRole('dialog',{name:'Usar entrada por voz'})).toHaveTextContent(/serviço externo do navegador/i);});
 it('obriga a conferir a transcrição antes de enviar',async()=>{const aoEnviar=vi.fn();(window as any).SpeechRecognition=ReconhecimentoFake;render(<PreferenciasProvider><Compositor enviando={false} aoEnviar={aoEnviar}/></PreferenciasProvider>);await userEvent.click(screen.getByRole('button',{name:'Falar em vez de digitar'}));await userEvent.click(screen.getByRole('button',{name:'Entendi, usar voz'}));ultimoReconhecimento.onresult?.({results:[[{transcript:'Preciso de orientação'}]]});expect(await screen.findByRole('dialog',{name:'Confirmar mensagem'})).toHaveTextContent('Transcrito por voz');expect(aoEnviar).not.toHaveBeenCalled();});
});
