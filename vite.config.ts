import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
  },
  build: {
    modulePreload: {
      polyfill: true,
      resolveDependencies: (_url, deps) => {
        return deps.filter(dep => 
          !dep.includes('vendor-supabase') && 
          !dep.includes('vendor-framer') && 
          !dep.includes('vendor-icons') &&
          !dep.includes('vendor-effects')
        );
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
            if (id.includes('@supabase')) return 'vendor-supabase';
            if (id.includes('framer-motion')) return 'vendor-framer';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('canvas-confetti')) return 'vendor-effects';
            return 'vendor';
          }
        },
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 3,
      },
      mangle: {
        toplevel: true,
      },
      format: {
        comments: false,
      },
    },
    cssMinify: true,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
  },
  server: {
    headers: {
       'Cross-Origin-Opener-Policy': 'same-origin',
       'Cross-Origin-Embedder-Policy': 'require-corp',
       'Cross-Origin-Resource-Policy': 'cross-origin',
    },
  },
  preview: {
    headers: {
       'Cross-Origin-Opener-Policy': 'same-origin',
       'Cross-Origin-Embedder-Policy': 'require-corp',
       'Cross-Origin-Resource-Policy': 'cross-origin',
    },
  },
})
