import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids'
import { HostedGamePage } from '../site-pages/hosted-game-page'
import { ProfileGuard } from '@bfg-engine/ui/components/profile-guard'

const paramsSchema = z.object({
  tableId: BfgGameTableId.idSchema,
})

// Search params schema using Standard Schema
const searchSchema = z.object({
  debug: z.boolean().optional(),
  autoStart: z.boolean().optional(),
}).optional()


const HostedGameRoute = () => {
  const { tableId } = Route.useParams()

  return (
    <ProfileGuard>
      <HostedGamePage
        tableId={tableId}
      />
    </ProfileGuard>
  )
}

export const Route = createFileRoute('/hosted-games/$tableId')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ tableId: params.tableId }),
  },
  validateSearch: searchSchema, // Standard Schema validation
  component: HostedGameRoute,
})

