import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
      { find: 'bootstrap', replacement: '/node_modules/bootstrap' }
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Global SCSS options
        additionalData: `
          @import "./src/styles/abstracts/_variables.scss";
        `,
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
