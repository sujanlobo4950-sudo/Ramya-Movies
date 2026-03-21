import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const TMDB_API_KEY = env.VITE_TMDB_API_KEY || env.TMDB_API_KEY || '9d8cf97474a82331932cdd34262788fc';
  
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.VITE_TMDB_API_KEY': JSON.stringify(TMDB_API_KEY),
      'process.env.TMDB_API_KEY': JSON.stringify(TMDB_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api/tmdb': {
          target: 'https://api.themoviedb.org/3',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/tmdb/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              const url = new URL(proxyReq.path, 'https://api.themoviedb.org');
              url.searchParams.set('api_key', TMDB_API_KEY);
              proxyReq.path = url.pathname + url.search;
            });
          },
        },
      },
    },
  };
});
