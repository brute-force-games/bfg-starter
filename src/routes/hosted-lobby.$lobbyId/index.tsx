import { createFileRoute } from '@tanstack/react-router'
import { ProfileGuard } from '@bfg-engine/ui/components/profile-guard';
import { useP2pHostedLobbyContext } from '@bfg-engine/hooks/p2p/lobby/hosted-p2p-lobby-context';
import { LobbyHostStateComponent } from '@bfg-engine/ui/components/lobby-host-state-component';
import { GameLobby } from '@bfg-engine/models/p2p-lobby';
import { PlayerProfileId } from '@bfg-engine/models/types/bfg-branded-ids';
import { BfgHostedLobbyAppBar, HostedLobbyTabId } from './-components';


const HostedLobbyIndexRoute = () => {

  const p2pHostedLobby = useP2pHostedLobbyContext();
  const { allPlayerProfiles, lobbyState, lobbyActions, lobbyOptions, setLobbyOptions } = p2pHostedLobby;

  if (!lobbyState) {
    return <div>Loading...</div>;
  }

  const activeTabId: HostedLobbyTabId = '/hosted-lobby/$lobbyId';

  const updateLobbyState = (lobbyState: GameLobby) => {
    lobbyActions.updateLobby(lobbyState.id, lobbyState);
  }

  const setLobbyPlayerPool = (playerPool: PlayerProfileId[]) => {
    lobbyActions.updateLobbyPlayerPool(lobbyState.id, playerPool);
  }

  return (
    <ProfileGuard>
      <BfgHostedLobbyAppBar activeTabId={activeTabId} />
      <LobbyHostStateComponent
        playerProfiles={allPlayerProfiles}
        lobbyState={lobbyState}
        lobbyOptions={lobbyOptions}
        setLobbyOptions={setLobbyOptions}
        updateLobbyState={updateLobbyState}
        setLobbyPlayerPool={setLobbyPlayerPool}
      />
    </ProfileGuard>
  )
}

export const Route = createFileRoute('/hosted-lobby/$lobbyId/')({
  component: HostedLobbyIndexRoute,
})
