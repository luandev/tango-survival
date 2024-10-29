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
        assetFileNames: '[hash:10].[ext]',
        entryFileNames: '[hash:10].js',
        // inlineDynamicImports: false,
        // format: 'iife',
        // manualChunks: () => {
        //   return 'Any string'
        // },
      }
    }
  }
})
