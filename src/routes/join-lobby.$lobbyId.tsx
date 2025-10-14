import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { PlayerP2pLobbyComponent } from '@bfg-engine/ui/components/player-p2p-lobby-component'
import { useMyDefaultPlayerProfile } from '@bfg-engine/hooks/stores/use-my-player-profiles-store'
import { BfgGameLobbyId } from '@bfg-engine/models/types/bfg-branded-ids'

const paramsSchema = z.object({
  lobbyId: BfgGameLobbyId.idSchema,
})

// Search params schema using Standard Schema
const searchSchema = z.object({
  inviteCode: z.string().optional(),
  autoJoin: z.boolean().optional(),
  debug: z.boolean().optional(),
}).optional()

function JoinLobbyComponent() {
  const { lobbyId } = Route.useParams()

  const myPlayerProfile = useMyDefaultPlayerProfile();

  if (!myPlayerProfile) {
    return <div>Loading player profile...</div>
  }

  return (
    <PlayerP2pLobbyComponent
      lobbyId={lobbyId}
      playerProfile={myPlayerProfile}
    />
  )
}


export const Route = createFileRoute('/join-lobby/$lobbyId')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ lobbyId: params.lobbyId }),
  },
  validateSearch: searchSchema, // Standard Schema validation
  component: JoinLobbyComponent,
})