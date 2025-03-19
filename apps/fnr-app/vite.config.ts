/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

// Proxy target for development - matches server config
const DEV_API_URL = 'http://localhost:3333';

export default defineConfig({
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
    nxCopyAssetsPlugin(['*.md', 'manifest.json']),
  ],
  build: {
    outDir: '../../dist/apps/fnr-app',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    // Ensure assets use relative paths
    assetsDir: 'assets',
    // Generate manifest for better asset tracking
    manifest: true,
    rollupOptions: {
      output: {
        // Ensure proper chunking and naming
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
        // Ensure assets have consistent naming
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      },
    },
  },
  // Use relative base path for production
  base: './',
});
