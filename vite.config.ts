/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import viteReact from '@vitejs/plugin-react';

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    tsConfigPaths(),
    // tanstackStart({
    //   spa: { enabled: true }, // Run as SPA (client-side only)
    // }),
    viteReact({
      jsxRuntime: 'automatic'
    })
  ],
  server: {
    port: 62776
  },
  resolve: {
    alias: {
      '~': path.resolve(dirname, './src'),
      '@bfg-engine': path.resolve(dirname, './modules/bfg-engine/src'),
      '@bfg-games': path.resolve(dirname, './modules/bfg-gdp-basic-games/src')
    }
  },
  define: {
    BUILD_DETAILS: JSON.stringify({
      timestamp: new Date().toISOString(),
      commit: process.env.CF_PAGES_COMMIT_SHA?.slice(0, 7) || 'local',
      branch: process.env.CF_PAGES_BRANCH || 'local'
    })
  }
});