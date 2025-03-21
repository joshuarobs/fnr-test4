/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

// Proxy target for development - matches server config
const DEV_API_URL = 'http://localhost:3333';

export default defineConfig(({ mode }) => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/fnr-app',
  server: {
    port: 4200,
    host: 'localhost',
    proxy: {
      '/api': {
        target: DEV_API_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [
    react(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md', 'manifest.json', 'favicon.ico']),
  ],
  build: {
    outDir: '../../dist/apps/fnr-app',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    assetsDir: 'assets',
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
        assetFileNames: (assetInfo: { name?: string }) => {
          // Keep favicon.ico in root directory
          if (assetInfo.name === 'favicon.ico') {
            return '[name].[ext]';
          }
          return 'assets/[name].[hash].[ext]';
        },
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      },
    },
  },
  // Use absolute base path in production for better compatibility
  base: mode === 'production' ? '/' : './',
}));
