import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Isso permite que o código existente usando process.env.API_KEY funcione
      // Nota: Na Vercel, defina a variável de ambiente 'API_KEY'
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});