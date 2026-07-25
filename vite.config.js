import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr'],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Three.js + R3F + postprocessing — always one chunk
          if (
            id.includes('three') ||
            id.includes('@react-three') ||
            id.includes('postprocessing')
          ) return 'three'

          // Framer Motion
          if (id.includes('framer-motion')) return 'motion'

          // React core
          if (id.includes('react-dom') || id.includes('react/')) return 'react'

          // Zustand + router + clsx
          if (
            id.includes('zustand') ||
            id.includes('react-router') ||
            id.includes('clsx')
          ) return 'vendor'

          // Hub + UI components (used on initial load)
          if (
            id.includes('src/components/hub') ||
            id.includes('src/components/ui') ||
            id.includes('src/components/cursor') ||
            id.includes('src/components/boot') ||
            id.includes('src/components/space') ||
            id.includes('src/components/overlays') ||
            id.includes('src/components/terminal') ||
            id.includes('src/hooks') ||
            id.includes('src/store') ||
            id.includes('src/audio') ||
            id.includes('src/data')
          ) return 'core'
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      'react', 'react-dom',
      'three', '@react-three/fiber', '@react-three/drei',
      'framer-motion', 'zustand',
    ],
  },
  server: {
    port: 3000,
    open: true,
  },
})
