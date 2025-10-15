import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { BfgGameLobbyId } from "@bfg-engine/models/types/bfg-branded-ids"
import { HostedLobbyPage } from "@bfg-engine/ui/pages/hosted-lobby-page"


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


export const HostedLobbyRoute = () => {
  const { lobbyId } = Route.useParams();

  return (
    <HostedLobbyPage
      lobbyId={lobbyId}
    />
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
