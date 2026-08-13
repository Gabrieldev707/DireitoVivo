import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import '@fontsource-variable/atkinson-hyperlegible-next';
import '@fontsource-variable/bricolage-grotesque';
import './estilos/tokens.css';
import './estilos/base.css';
import './estilos/componentes.css';
import './estilos/paginas.css';
import './estilos/conversa.css';

createRoot(document.getElementById('raiz')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
