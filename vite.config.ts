import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import viteReact from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsConfigPaths(),
    // tanstackStart({
    //   spa: { enabled: true }, // Run as SPA (client-side only)
    // }),
    viteReact({
      jsxRuntime: 'automatic'
    }),
  ],
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
  }
})
