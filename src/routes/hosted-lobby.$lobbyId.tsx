import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { BfgGameLobbyId } from "@bfg-engine/models/types/bfg-branded-ids"
import { ProfileGuard } from "@bfg-engine/ui/components/profile-guard"
import { Outlet } from "@tanstack/react-router"
import { P2pHostedLobbyContextProvider } from "@bfg-engine/hooks/p2p/hosted-p2p-lobby-context"
import { useMyDefaultPlayerProfile } from "@bfg-engine/hooks/stores/use-my-player-profiles-store"
import { Typography } from "@bfg-engine/ui/bfg-ui"


const paramsSchema = z.object({
  lobbyId: BfgGameLobbyId.idSchema,
})

// Search params schema using Standard Schema
const searchSchema = z.object({
  maxPlayers: z.number().min(2).max(16).optional(),
  autoStart: z.boolean().optional(),
  // showInvites: z.boolean().default(true),
  debug: z.boolean().optional(),
}).optional()


const HostedLobbyRoute = () => {
  const { lobbyId } = Route.useParams();

  const myHostPlayerProfile = useMyDefaultPlayerProfile();
  if (!myHostPlayerProfile) {
    return <Typography variant="body1">Loading player profile...</Typography>
  }

  return (
    <ProfileGuard>
      <P2pHostedLobbyContextProvider
        lobbyId={lobbyId}
        hostPlayerProfile={myHostPlayerProfile}
      >
        <Outlet />
      </P2pHostedLobbyContextProvider>
    </ProfileGuard>
  )
}


export const Route = createFileRoute('/hosted-lobby/$lobbyId')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ lobbyId: params.lobbyId }),
  },
  validateSearch: searchSchema, // Standard Schema validation
  component: HostedLobbyRoute,
})
