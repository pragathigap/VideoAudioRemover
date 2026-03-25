import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-utils': ['framer-motion', 'lucide-react', 'canvas-confetti'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
      treeshake: true,
    },
    minify: 'esbuild',
    cssMinify: true,
    chunkSizeWarningLimit: 1000,
  },
  server: {
    headers: {
       'Cross-Origin-Opener-Policy': 'same-origin',
       'Cross-Origin-Embedder-Policy': 'credentialless',
       'Cross-Origin-Resource-Policy': 'cross-origin',
    },
  },
  preview: {
    headers: {
       'Cross-Origin-Opener-Policy': 'same-origin',
       'Cross-Origin-Embedder-Policy': 'credentialless',
       'Cross-Origin-Resource-Policy': 'cross-origin',
    },
  },
})
