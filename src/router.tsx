import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export const router = createRouter({
  routeTree,
  scrollRestoration: true,
  // Development mode options for better error detection
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  // Enable strict mode for development
  ...(process.env.NODE_ENV === 'development' && {
    defaultErrorComponent: ({ error }) => {
      console.error('Router Error:', error)
      return <div>Route Error: {error.message}</div>
    },
  }),
})

export function getRouter() {
  return router
}
