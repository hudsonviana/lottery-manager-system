import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3333',
    //     changeOrigin: true,
    //     // rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    // },
  },
  optimizeDeps: {
    include: ['jose'],
  },
});
