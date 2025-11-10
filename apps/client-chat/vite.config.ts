/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig(({ mode }) => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/client-chat',
  
  server: {
    port: 4200,
    host: 'localhost',
  },
  
  preview: {
    port: 4300,
    host: 'localhost',
  },
  
  plugins: [react()],
  
  // Resolve workspace dependencies
  resolve: {
    alias: {
      '@mini-chat/shared-types': path.resolve(__dirname, '../../libs/shared/types/src'),
      '@mini-chat/frontend-ui': path.resolve(__dirname, '../../libs/frontend/ui/src'),
      // Add specific alias for styles to handle CSS imports
      '@mini-chat/frontend-ui/styles': path.resolve(__dirname, '../../libs/frontend/ui/src/styles'),
    },
  },
  
  // Environment variables
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3000'),
    'process.env.VITE_APP_ENV': JSON.stringify(process.env.VITE_APP_ENV || mode),
  },
  
  build: {
    // Use absolute path for Nx consistency
    outDir: '../../dist/apps/client-chat',
    emptyOutDir: true,
    reportCompressedSize: true,
    
    // Optimize for production
    minify: mode === 'production',
    sourcemap: mode === 'development',
    
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
    
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  
  // Test configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      reportsDirectory: '../../coverage/apps/client-chat',
      provider: 'v8',
    },
  },
}));