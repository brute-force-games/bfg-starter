// Combines BFG engine routes with auto-generated app routes
import { routeTree as generatedRouteTree } from './routeTree.gen'
import { Route as rootRoute } from './routes/__root'
import { combineBfgRoutesWithAppRoutes } from '@bfg-engine'

// Combine BFG routes (from bfg-engine) with app routes (from routeTree.gen)
export const routeTree = combineBfgRoutesWithAppRoutes(generatedRouteTree, rootRoute)


