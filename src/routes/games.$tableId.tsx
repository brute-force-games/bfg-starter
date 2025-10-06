import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useMyDefaultPlayerProfile } from '~/hooks/stores/use-my-player-profiles-store'
import { BfgGameTableId } from '~/types/core/branded-values/bfg-branded-ids'
import { PlayerP2pGameComponent } from '~/components/p2p/player-p2p-game-component'

// Define params schema using the existing BfgGameTableId schema
const paramsSchema = z.object({
  tableId: BfgGameTableId.idSchema,
})

// Search params schema using Standard Schema
const searchSchema = z.object({
  spectate: z.boolean().optional(),
  debug: z.boolean().optional(),
}).optional()

export const Route = createFileRoute('/games/$tableId')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ tableId: params.tableId }),
  },
  validateSearch: searchSchema, // Standard Schema validation
  component: PlayerGamePage,
})

function PlayerGamePage() {
  const { tableId } = Route.useParams() // tableId is now properly typed as GameTableId
  
  const myPlayerProfile = useMyDefaultPlayerProfile();

  if (!myPlayerProfile) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Game...</h1>
        <div className="text-gray-600">Loading game details...</div>
      </div>
    )
  }

  return (
    <PlayerP2pGameComponent
      gameTableId={tableId}
      playerProfile={myPlayerProfile}
    />
  )
}
