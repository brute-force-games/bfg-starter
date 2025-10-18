import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { BfgGameLobbyId } from '@bfg-engine/models/types/bfg-branded-ids'
import { JoinLobbyPage } from '~/site-pages/join-lobby-page'
import { ProfileGuard } from '@bfg-engine'

const paramsSchema = z.object({
  lobbyId: BfgGameLobbyId.idSchema,
})

// Search params schema using Standard Schema
const searchSchema = z.object({
  inviteCode: z.string().optional(),
  autoJoin: z.boolean().optional(),
  debug: z.boolean().optional(),
}).optional()


const JoinLobbyRoute = () => {
  const { lobbyId } = Route.useParams()

  return (
    <ProfileGuard>
      <JoinLobbyPage lobbyId={lobbyId} />
    </ProfileGuard>
  )
}


export const Route = createFileRoute('/join-lobby/$lobbyId')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ lobbyId: params.lobbyId }),
  },
  validateSearch: searchSchema, // Standard Schema validation
  component: JoinLobbyRoute,
})