import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  esbuild: {
    target: 'esnext'
  },
  optimizeDeps: {
    include: ['pdfjs-dist']
  },
  test: {
    environment: 'jsdom',
    globals: true
  }
})
