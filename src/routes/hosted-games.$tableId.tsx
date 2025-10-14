import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids'
import { HostedP2pGameComponent } from '@bfg-engine/ui/components/hosted-p2p-game-component'

const paramsSchema = z.object({
  tableId: BfgGameTableId.idSchema,
})

// Search params schema using Standard Schema
const searchSchema = z.object({
  debug: z.boolean().optional(),
  autoStart: z.boolean().optional(),
}).optional()

export const Route = createFileRoute('/hosted-games/$tableId')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ tableId: params.tableId }),
  },
  validateSearch: searchSchema, // Standard Schema validation
  component: HostedGamePage,
})

function HostedGamePage() {
  const { tableId } = Route.useParams()

  return (
    <HostedP2pGameComponent
      gameTableId={tableId}
    />
  )
}
