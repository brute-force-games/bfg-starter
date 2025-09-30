import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { HostedP2pLobbyComponent } from "~/components/p2p/hosted-p2p-lobby-component"
import { useHostedLobby, useHostedLobbyActions } from "~/hooks/stores/use-hosted-lobbies-store"
import { useMyDefaultHostPlayerProfile } from "~/hooks/stores/use-my-player-profiles-store"
import { GameLobby, LobbyOptions } from "~/models/p2p-lobby"
import { BfgSupportedGameTitlesSchema } from "~/types/bfg-game-engines/supported-games"
import { GameLobbyId, PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids"


export const HostedLobbyPage = () => {
  const { lobbyId: rawLobbyId } = Route.useParams();
  const lobbyId = rawLobbyId as GameLobbyId;

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
  component: HostedLobbyPage,
})
