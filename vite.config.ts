import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 62776
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
