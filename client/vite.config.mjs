import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// ESM config: required when using ESM-only plugins
export default defineConfig({
  plugins: [react()],
  root: process.cwd(),
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  server: {
    port: 3000,
    strictPort: false,
  },
});
