import { P2pConnectionComponent, useP2pHostedLobbyContext, type PlayerProfileId } from '@bfg-engine';
import { createFileRoute } from '@tanstack/react-router'
import { BfgHostedLobbyAppBar, HostedLobbyTabId } from './-components';
import type { PeerId } from '../../../modules/bfg-engine/src/hooks/p2p/p2p-types';


const HostedLobbyP2pDetailsRoute = () => {

  const activeTabId: HostedLobbyTabId = '/hosted-lobby/$lobbyId/p2p-details';

  const lobby = useP2pHostedLobbyContext();
  const {
    connectionStatus,
    connectionEvents,
    peerIds,
    myHostPlayerProfile,
    allPlayerProfiles,
    peerPlayers,
  } = lobby;

  const peerIdsToPlayerIds = new Map<PeerId, PlayerProfileId>();
  for (const peerId of peerIds) {
    const playerProfile = peerPlayers.get(peerId);
    if (!playerProfile) {
      continue;
    }
    peerIdsToPlayerIds.set(peerId, playerProfile.id);
  }

  // const refreshConnection = () => {
  //   console.error('refreshConnection not implemented');
  // }

  return (
    <>
      <BfgHostedLobbyAppBar 
        activeTabId={activeTabId}
      />
      <P2pConnectionComponent
        connectionStatus={connectionStatus}
        connectionEvents={connectionEvents}
        peerIds={peerIds}
        myPeerProfile={myHostPlayerProfile}
        peerIdsToPlayerIds={peerIdsToPlayerIds}
        allPlayerProfiles={allPlayerProfiles}
        />
    </>
  )
}


export const Route = createFileRoute('/hosted-lobby/$lobbyId/p2p-details')({
  component: HostedLobbyP2pDetailsRoute,
})
