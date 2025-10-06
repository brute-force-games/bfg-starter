import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { z } from "zod"
import { HostedP2pLobbyComponent } from "~/components/p2p/hosted-p2p-lobby-component"
import { useHostedLobby, useHostedLobbyActions } from "~/hooks/stores/use-hosted-lobbies-store"
import { useMyDefaultHostPlayerProfile } from "~/hooks/stores/use-my-player-profiles-store"
import { GameLobby, LobbyOptions } from "~/models/p2p-lobby"
import { BfgSupportedGameTitlesSchema } from "~/types/bfg-game-engines/supported-games"
import { BfgGameLobbyId, PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids"

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

  const [lobbyOptions, setLobbyOptions] = useState<LobbyOptions>(() => {
    const gameChoices = BfgSupportedGameTitlesSchema.options;
    return {
      gameChoices,  
      maxPlayers: 8,
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
