import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({include: "**/*.jsx", usePolling: true})],
  base: '',
  build: {
    assetsDir:'.',
    rollupOptions: {
      output: {
        assetFileNames: '[name].[ext]',
        entryFileNames: '[name].JS',
        inlineDynamicImports: false,
        format: 'iife',
        manualChunks: () => {
          return 'Any string'
        },
      }
    }
  }
})
