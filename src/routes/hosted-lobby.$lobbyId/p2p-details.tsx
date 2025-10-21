import { P2pConnectionComponent, useP2pHostedLobbyContext } from '@bfg-engine';
import { createFileRoute } from '@tanstack/react-router'
import { BfgHostedLobbyAppBar, HostedLobbyTabId } from './-components';


const HostedLobbyP2pDetailsRoute = () => {

  const activeTabId: HostedLobbyTabId = '/hosted-lobby/$lobbyId/p2p-details';

  const lobby = useP2pHostedLobbyContext();
  const { connectionStatus, connectionEvents, peerProfiles, refreshConnection, allPlayerProfiles } = lobby;

  return (
    <>
      <BfgHostedLobbyAppBar 
        activeTabId={activeTabId}
      />
      <P2pConnectionComponent
        connectionStatus={connectionStatus}
        connectionEvents={connectionEvents}
        peerProfiles={peerProfiles}
        playerProfiles={allPlayerProfiles}
        onRefreshConnection={refreshConnection}
      />
    </>
  )
}


export const Route = createFileRoute('/hosted-lobby/$lobbyId/p2p-details')({
  component: HostedLobbyP2pDetailsRoute,
})
