import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 5173,
  },

  build: {
    // Raise the warning limit so minor overages don't clutter output
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Split vendor libraries into separate chunks for better caching
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],

          // UI / animation
          'vendor-mui': [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
          ],
          'vendor-motion': ['framer-motion'],

          // Charts
          'vendor-recharts': ['recharts'],

          // Maps
          'vendor-leaflet': ['leaflet', 'react-leaflet'],

          // 3D / Three.js (large – isolate so it's only loaded when needed)
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],

          // State management
          'vendor-zustand': ['zustand'],

          // HTTP
          'vendor-axios': ['axios'],

          // Icons
          'vendor-icons': ['lucide-react', 'react-icons'],
        },
      },
    },

    // Generate source maps for production error tracking
    sourcemap: false,

    // Minify output
    minify: 'esbuild',

    // Split CSS per chunk for better caching
    cssCodeSplit: true,
  },
})
