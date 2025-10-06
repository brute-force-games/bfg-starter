/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import viteReact from '@vitejs/plugin-react';

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [tsConfigPaths(),
  // tanstackStart({
  //   spa: { enabled: true }, // Run as SPA (client-side only)
  // }),
  viteReact({
    jsxRuntime: 'automatic'
  })],
  server: {
    port: 62777
  },
  resolve: {
    alias: {
      '~': '/src'
    }
  },
  define: {
    BUILD_DETAILS: JSON.stringify({
      timestamp: new Date().toISOString(),
      commit: process.env.CF_PAGES_COMMIT_SHA?.slice(0, 7) || 'local',
      branch: process.env.CF_PAGES_BRANCH || 'local'
    })
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: 'playwright',
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.ts']
      }
    }]
  }
});