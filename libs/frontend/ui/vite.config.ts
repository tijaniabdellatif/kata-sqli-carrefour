/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/libs/frontend/ui',
  plugins: [
    react(),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  // Resolve path aliases for Vite
  resolve: {
    alias: {
      '@mini-chat/shared/types': path.resolve(
        __dirname,
        '../../../libs/shared/types/src/index.ts'
      ),
      '@mini-chat/types': path.resolve(
        __dirname,
        '../../../libs/shared/types/src/index.ts'
      ),
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
  // Configuration for building your library.
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.tsx',
      name: '@mini-chat/ui',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        // Mark types as external so they're not bundled
        '@mini-chat/shared/types',
        '@mini-chat/types',
      ],
      
    },
  },
}));
