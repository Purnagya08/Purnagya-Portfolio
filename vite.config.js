import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const fromRoot = (path) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // The lazy-loaded Three.js scene is intentionally isolated from the app shell.
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@': fromRoot('./src'),
      '@assets': fromRoot('./src/assets'),
      '@core': fromRoot('./src/core'),
      '@data': fromRoot('./src/data'),
      '@modules': fromRoot('./src/modules'),
      '@services': fromRoot('./src/services'),
      '@shared': fromRoot('./src/shared'),
      '@three': fromRoot('./src/three'),
    },
  },
})
