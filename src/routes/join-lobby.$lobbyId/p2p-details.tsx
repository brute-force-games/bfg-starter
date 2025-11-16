import { P2pConnectionComponent, type PlayerProfileId } from '@bfg-engine';
import { createFileRoute } from '@tanstack/react-router'
import { BfgJoinLobbyAppBar, JoinLobbyTabId } from './-components';
import { useP2pLobbyPlayerContext } from '@bfg-engine/hooks/p2p/lobby/p2p-lobby-player-context';
import type { PeerId } from '../../../modules/bfg-engine/src/hooks/p2p/p2p-types';


const JoinLobbyP2pDetailsRoute = () => {
  // const { lobbyId } = Route.useParams();


  // const myPlayerProfile = useMyDefaultPlayerProfile();
  // if (!myPlayerProfile) {
  //   return <Typography variant="body1">Loading player profile...</Typography>
  // }

  // const JoinLobbyTabItems: readonly AppBarTabItem<JoinLobbyTabId>[] = [
  //   {
  //     id: 'player-lobby',
  //     label: 'Player Lobby',
  //     link: { to: '/join-lobby/$lobbyId' },
  //   },
  //   { 
  //     id: 'player-p2p-lobby-details',
  //     label: 'P2P Details', 
  //     // link: { to: '/join-lobby/$lobbyId/p2p-details' },
  //   },
  // ];

  const activeTabId: JoinLobbyTabId = '/join-lobby/$lobbyId/p2p-details';

  // const setActiveTabId = (tabId: JoinLobbyTabId) => {
  //   console.log('setActiveTabId', tabId);
  //   // activeTabId = tabId;
  // }

  const lobby = useP2pLobbyPlayerContext();
  const {
    connectionStatus,
    connectionEvents,
    peerIds,
    peerPlayers,
    myPlayerProfile,
    allPlayerProfiles,
   } = lobby;

  const peerIdsToPlayerIdsMap = new Map<PeerId, PlayerProfileId>();
  for (const [peerId, playerProfile] of peerPlayers) {
    peerIdsToPlayerIdsMap.set(peerId, playerProfile.id);
  }

  return (
    <>
      <BfgJoinLobbyAppBar 
        activeTabId={activeTabId}
      />
      <P2pConnectionComponent
        connectionStatus={connectionStatus}
        connectionEvents={connectionEvents}
        peerIds={peerIds}
        myPeerProfile={myPlayerProfile}
        peerIdsToPlayerIds={peerIdsToPlayerIdsMap}
        allPlayerProfiles={allPlayerProfiles}
        // onRefreshConnection={refreshConnection}
      />
    </>
  )
}


export const Route = createFileRoute('/join-lobby/$lobbyId/p2p-details')({
  component: JoinLobbyP2pDetailsRoute,
})
