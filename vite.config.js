import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist',
    // rollupOptions: {
    //   external: ["pdfjs-dist/build/pdf.worker.min.js"],
    // },

  },
  base: '/', // Ensures correct routing
});
