import { z } from 'zod'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids'


// Define params schema using the existing BfgGameTableId schema
const paramsSchema = z.object({
  tableId: BfgGameTableId.idSchema,
})

// Search params schema using Standard Schema
const searchSchema = z.object({
  spectate: z.boolean().optional(),
  debug: z.boolean().optional(),
}).optional()


// const GamesTableIdLayout = () => {
//   // This is a layout route - it just wraps children with ProfileGuard
//   return (
//     // <ProfileGuard>
//     <Outlet />
//     // </ProfileGuard>
//   )
// }


export const Route = createFileRoute('/games/$tableId')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ tableId: params.tableId }),
  },
  validateSearch: searchSchema,
  // component: GamesTableIdLayout,
  component: Outlet,
})
