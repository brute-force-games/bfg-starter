/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import viteReact from '@vitejs/plugin-react';

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
    port: 62776,
    host: true
  },
  build: {
    sourcemap: true
  },
  define: {
    BUILD_DETAILS: JSON.stringify({
      timestamp: new Date().toISOString(),
      commit: process.env.CF_PAGES_COMMIT_SHA?.slice(0, 7) || 'local',
      branch: process.env.CF_PAGES_BRANCH || 'local'
    })
  }
});