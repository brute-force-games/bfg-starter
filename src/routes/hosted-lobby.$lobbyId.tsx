import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { z } from "zod"
import { HostedP2pLobbyComponent } from "@bfg-engine/ui/components/hosted-p2p-lobby-component"
import { useHostedLobby, useHostedLobbyActions } from "@bfg-engine/hooks/stores/use-hosted-lobbies-store"
import { useMyDefaultHostPlayerProfile } from "@bfg-engine/hooks/stores/use-my-player-profiles-store"
import { GameLobby, LobbyOptions } from "@bfg-engine/models/p2p-lobby"
import { BfgGameLobbyId, PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids"
import { useGameRegistry } from "@bfg-engine/hooks/games-registry/games-registry"

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


export const HostedLobbyPage = () => {
  const { lobbyId } = Route.useParams()

  const lobby = useHostedLobby(lobbyId);
  const lobbyActions = useHostedLobbyActions();
  const myHostPlayerProfile = useMyDefaultHostPlayerProfile();

  const registry = useGameRegistry();
  const gameChoices = registry.getAvailableGameTitles();

  const [lobbyOptions, setLobbyOptions] = useState<LobbyOptions>(() => {
    return {
      gameChoices,
    }
  });

  const setLobbyState = (lobbyState: GameLobby) => {
    console.log('setting lobby state', lobbyState);
    lobbyActions.updateLobby(lobbyId, lobbyState);
  }

  const setLobbyPlayerPool = (playerPool: PlayerProfileId[]) => {
    lobbyActions.updateLobbyPlayerPool(lobbyId, playerPool);
    if (playerPool.length === 0) {
      lobbyActions.updateLobby(lobbyId, {
        isLobbyValid: false,
      });
    }
  }

  if (!lobby) {
    return (
      <div>
        Loading lobby...
      </div>
    )
  }

  if (myHostPlayerProfile?.id !== lobby.gameHostPlayerProfile.id) {
    throw new Error('You are not the host of this lobby');
  }

  return (
    <HostedP2pLobbyComponent
      lobbyId={lobbyId}
      hostPlayerProfile={myHostPlayerProfile}
      lobbyOptions={lobbyOptions}
      lobbyState={lobby}
      updateLobbyState={setLobbyState}
      setLobbyOptions={setLobbyOptions}
      setLobbyPlayerPool={setLobbyPlayerPool}
    />
  )
}


export const Route = createFileRoute('/hosted-lobby/$lobbyId')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ lobbyId: params.lobbyId }),
  },
  validateSearch: searchSchema, // Standard Schema validation
  component: HostedLobbyPage,
})
