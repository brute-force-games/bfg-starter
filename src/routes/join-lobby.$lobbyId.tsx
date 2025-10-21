import { z } from 'zod'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { BfgGameLobbyId } from '@bfg-engine/models/types/bfg-branded-ids'
import { ProfileGuard, Typography, useMyDefaultPlayerProfile } from '@bfg-engine'
import { P2pLobbyPlayerContextProvider } from '@bfg-engine/hooks/p2p/p2p-lobby-player-context'


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

  const myPlayerProfile = useMyDefaultPlayerProfile();
  if (!myPlayerProfile) {
    return <Typography variant="body1">Loading player profile...</Typography>
  }

  return (
    <ProfileGuard>
      <P2pLobbyPlayerContextProvider
        lobbyId={lobbyId}
        myPlayerProfile={myPlayerProfile}
      >
        <Outlet />
      </P2pLobbyPlayerContextProvider>
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