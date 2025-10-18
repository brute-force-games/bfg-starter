import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { BfgGameLobbyId } from "@bfg-engine/models/types/bfg-branded-ids"
import { HostedLobbyPage } from "../site-pages/hosted-lobby-page"
import { ProfileGuard } from "@bfg-engine/ui/components/profile-guard"


const paramsSchema = z.object({
  lobbyId: BfgGameLobbyId.idSchema,
})

// Search params schema using Standard Schema
const searchSchema = z.object({
  maxPlayers: z.number().min(2).max(16).optional(),
  autoStart: z.boolean().optional(),
  showInvites: z.boolean().default(true),
  debug: z.boolean().optional(),
}).optional()


const HostedLobbyRoute = () => {
  const { lobbyId } = Route.useParams();

  return (
    <ProfileGuard>
      <HostedLobbyPage
        lobbyId={lobbyId}
      />
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
