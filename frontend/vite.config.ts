import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Em dev, o frontend fala com a API local sem CORS.
    proxy: { '/api': 'http://localhost:3333' },
  },
});
