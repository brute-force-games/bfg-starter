import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { HostedP2pLobbyComponent } from "~/components/p2p/hosted-p2p-lobby-component"
import { useHostedLobby, useHostedLobbyActions } from "~/hooks/stores/use-hosted-lobbies-store"
import { GameLobby, LobbyOptions } from "~/models/p2p-lobby"
import { BfgSupportedGameTitlesSchema } from "~/types/bfg-game-engines/supported-games"
import { GameLobbyId, PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids"


export const HostedLobbyPage = () => {
  const { lobbyId: rawLobbyId } = Route.useParams();
  const lobbyId = rawLobbyId as GameLobbyId;

  const lobby = useHostedLobby(lobbyId);
  const lobbyActions = useHostedLobbyActions();

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
    console.log('setting lobby player pool', playerPool);
    lobbyActions.updateLobbyPlayerPool(lobbyId, playerPool);
  }

  if (!lobby) {
    return (
      <div>
        Loading lobby...
      </div>
    )
  }

  return (
    <HostedP2pLobbyComponent
      lobbyId={lobbyId}
      hostPlayerProfile={lobby.gameHostPlayerProfile}
      lobbyOptions={lobbyOptions}
      lobbyState={lobby}
      updateLobbyState={setLobbyState}
      setLobbyOptions={setLobbyOptions}
      setLobbyPlayerPool={setLobbyPlayerPool}
    />
  )
}


export const Route = createFileRoute('/hosted-lobby/$lobbyId')({
  component: HostedLobbyPage,
})
