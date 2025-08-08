import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // <-- This is the default for Vite
    emptyOutDir: true, // cleans up previous build, recommended
  },
});

