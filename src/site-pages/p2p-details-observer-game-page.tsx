import { P2pConnectionComponent } from "@bfg-engine/ui/components/p2p-connection-component"
import { GameTableId } from "@bfg-engine/models/types/bfg-branded-ids"
import { BfgPlayerGameBar, PlayerGameTabId } from "~/routes/games.$tableId/-components";
import { useObserverP2pGame } from "@bfg-engine/hooks/p2p/game/use-observer-p2p-game";


interface IP2pDetailsObserverPageProps {
  tableId: GameTableId;
}

export const P2pDetailsObserverPage = ({ tableId }: IP2pDetailsObserverPageProps) => {

  const activeTabId: PlayerGameTabId = '/games/$tableId/observe';
  
  const observerGame = useObserverP2pGame(tableId);
  if (!observerGame) {
    return <div>Loading P2P game...</div>;
  }

  const { connectionStatus, connectionEvents, peers, peerPlayers, allPlayerProfiles, refreshConnection } = observerGame;

  return (
    <>
      <BfgPlayerGameBar 
        activeTabId={activeTabId}
      />
      <P2pConnectionComponent
        connectionStatus={connectionStatus}
        connectionEvents={connectionEvents}
        peers={peers}
        peerPlayers={peerPlayers}
        allPlayerProfiles={allPlayerProfiles}
        onRefreshConnection={refreshConnection}
      />
    </>  
  )
}
