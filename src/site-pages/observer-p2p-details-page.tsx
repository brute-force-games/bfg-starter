import { P2pConnectionComponent } from "@bfg-engine/ui/components/p2p-connection-component"
// import { BfgGameTabId, BfgPlayerGameBar, PlayerGameTabId } from "~/routes/games.$role.$tableId/-components";
// import { useObserverP2pGame } from "@bfg-engine/hooks/p2p/game/use-observer-p2p-game";
import { IBfgGameRoomForObserver } from "@bfg-engine/hooks/p2p/game/p2p-game-types";
import { BruteForceGamesAppBar } from "@bfg-engine/ui/components/bfg-app-bar/app-bar";

  
// interface IObserverP2pDetailsPageProps {
//   tableId: BfgGameTableId;
// }

export const ObserverP2pDetailsPage = (props: IBfgGameRoomForObserver) => {

  const { publicGameDetails, p2pDetails } = props;
  if (!publicGameDetails) {
    return <div>Public game details not found</div>;
  }
  if (!p2pDetails) {
    return <div>P2P details not found</div>;
  }
  const { connectionStatus, connectionEvents, peerIds, peerIdsToPlayerIds, myPeerProfile, allPlayerProfiles } = p2pDetails;
  
  // const refreshConnection = () => {
  //   console.error('refreshConnection not implemented');
  // }

  // const activeTabId: GameTabId = '/games/$role/$tableId/p2p-details';
  
  // const observerGame = useObserverP2pGame(tableId);
  // if (!observerGame) {
  //   return <div>Loading P2P game...</div>;
  // }

  // const { connectionStatus, connectionEvents, peerIds, peerPlayerIds, allPlayerProfiles, refreshConnection } = p2pDetails;


  return (
    <>
      {/* <BfgPlayerGameBar 
        activeTabId={activeTabId}
      /> */}
      <BruteForceGamesAppBar 
        // gameContext={gameContext}
      >
        <P2pConnectionComponent
          connectionStatus={connectionStatus}
          connectionEvents={connectionEvents}
          peerIds={peerIds}
          myPeerProfile={myPeerProfile}
          peerIdsToPlayerIds={peerIdsToPlayerIds}
          allPlayerProfiles={allPlayerProfiles}
          // onRefreshConnection={refreshConnection}
        />
      </BruteForceGamesAppBar>
    </>  
  )
}
