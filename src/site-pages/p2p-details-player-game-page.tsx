import { P2pConnectionComponent } from "@bfg-engine/ui/components/p2p-connection-component"
import { GameTableId } from "@bfg-engine/models/types/bfg-branded-ids"
import { BfgPlayerGameBar, PlayerGameTabId } from "~/routes/games.$tableId/-components";
import { PrivatePlayerProfile } from "@bfg-engine/models/player-profile/private-player-profile";
import { usePlayerP2pGame } from "@bfg-engine/hooks/p2p/game/use-player-p2p-game";


interface IP2pDetailsPlayerPageProps {
  tableId: GameTableId;
  myPlayerProfile: PrivatePlayerProfile;
}

export const P2pDetailsPlayerPage = ({ tableId, myPlayerProfile }: IP2pDetailsPlayerPageProps) => {

  const activeTabId: PlayerGameTabId = '/games/$tableId/p2p-details';

  const p2pGame = usePlayerP2pGame(tableId, myPlayerProfile);
  if (!p2pGame) {
    return <div>Loading P2P game...</div>;
  }

  const { connectionStatus, connectionEvents, peers, peerPlayers, allPlayerProfiles, refreshConnection } = p2pGame;

  return (
    <>
      <BfgPlayerGameBar 
        activeTabId={activeTabId}
      />
      <P2pConnectionComponent
        connectionStatus={connectionStatus}
        connectionEvents={connectionEvents}
        peers={peers}
        myPeerPlayer={myPlayerProfile}
        peerPlayers={peerPlayers}
        allPlayerProfiles={allPlayerProfiles}
        onRefreshConnection={refreshConnection}
      />
    </>
  )
}
