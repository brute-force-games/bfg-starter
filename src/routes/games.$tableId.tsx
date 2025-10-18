import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids'
import { PlayerGamePage } from '../site-pages/player-game-page'
import { ProfileGuard } from '@bfg-engine/ui/components/profile-guard'


// Define params schema using the existing BfgGameTableId schema
const paramsSchema = z.object({
  tableId: BfgGameTableId.idSchema,
})

// Search params schema using Standard Schema
const searchSchema = z.object({
  spectate: z.boolean().optional(),
  debug: z.boolean().optional(),
}).optional()


const PlayerGameRoute = () => {
  const { tableId } = Route.useParams();

  return (
    <ProfileGuard>
      <PlayerGamePage tableId={tableId} />
    </ProfileGuard>
  )
}


export const Route = createFileRoute('/games/$tableId')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ tableId: params.tableId }),
  },
  validateSearch: searchSchema, // Standard Schema validation
  component: PlayerGameRoute,
})
