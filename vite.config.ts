
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig(() => {
  return {
    // Required for GitHub Pages project deployments
    base: '/pawdemo/',

    plugins: [
      react(),
      tailwindcss(),
      ViteImageOptimizer({
        webp: { quality: 75 },
        png: { quality: 75 },
        jpg: { quality: 75 },
        includePublic: true,
      }),
    ],

    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-lucide': ['lucide-react'],
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
