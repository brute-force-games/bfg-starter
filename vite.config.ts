/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import viteReact from '@vitejs/plugin-react';
import { checker } from 'vite-plugin-checker';

// Load environment variables from .env files
// Vite automatically loads .env files, but we need to ensure they're loaded for the config
const env = loadEnv('development', process.cwd(), '');

// Get workspace root from environment variable
// Must be an absolute path - relative paths are not supported
const getWorkspaceRoot = (): string => {
  const envRoot = env.VITE_WORKSPACE_ROOT || process.env.VITE_WORKSPACE_ROOT;
  if (!envRoot) {
    throw new Error('VITE_WORKSPACE_ROOT environment variable is required. Set it in your .env file as an absolute path. Relative paths are not supported.');
  }
  if (!envRoot.startsWith('/')) {
    throw new Error(`VITE_WORKSPACE_ROOT must be an absolute path (starting with /), but got: ${envRoot}. Relative paths are not supported.`);
  }
  return envRoot;
};

const getRequiredEnv = (key: string): string => {
  const value = env[key] || process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set. Set it in your .env file.`);
  }
  return value;
};

export default defineConfig({
  base: getRequiredEnv('VITE_APP_URL_ROOT_PATH'),
  plugins: [
    tsConfigPaths(),
    // tanstackStart({
    //   spa: { enabled: true }, // Run as SPA (client-side only)
    // }),
    viteReact({
      jsxRuntime: 'automatic'
    }),
    checker({
      typescript: {
        buildMode: true,
      },
    }),
  ],
  server: {
    port: Number(getRequiredEnv('VITE_DEV_PORT')),
    host: true
  },
  build: {
    sourcemap: true
  },
  define: {
    BUILD_DETAILS: JSON.stringify({
      timestamp: new Date().toISOString(),
      commit: getRequiredEnv('CF_PAGES_COMMIT_SHA').slice(0, 7),
      branch: getRequiredEnv('CF_PAGES_BRANCH')
    }),
    'import.meta.env.VITE_WORKSPACE_ROOT_RESOLVED': JSON.stringify(getWorkspaceRoot()),
    __WORKSPACE_ROOT__: JSON.stringify(getWorkspaceRoot())
  }
});