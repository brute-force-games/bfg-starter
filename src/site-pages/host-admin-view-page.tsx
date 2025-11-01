import { HostedGameView } from "@bfg-engine/ui/components/hosted-game-view";
import { GameTableSeat } from "@bfg-engine/models/game-table/game-table";
import { useHostedP2pGameWithStore } from "@bfg-engine/hooks/p2p/game/use-hosted-p2p-game-with-store";
import { PublicPlayerProfile } from "@bfg-engine/models/player-profile/public-player-profile";
import { GameTableId } from "@bfg-engine/models/types/bfg-branded-ids";
import { BfgGameBar, GameTabId } from "~/routes/games.$role.$tableId/-components";


interface HostAdminViewPageProps {
  tableId: GameTableId;
  myPlayerProfile: PublicPlayerProfile | null;
  // activeTabId: HostedGameTabId;
}

export const HostAdminViewPage = ({ tableId, myPlayerProfile }: HostAdminViewPageProps) => {

  const hostedP2pGame = useHostedP2pGameWithStore(tableId, myPlayerProfile);

  if (!hostedP2pGame) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Game...</h1>
        <div className="text-gray-600">Loading P2P game details...</div>
      </div>
    )
  }

  if (!myPlayerProfile) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Player Profile Required</h1>
        <div className="text-gray-600">A player profile is required to host a game.</div>
      </div>
    )
  }

  const {
    gameTable,
    peers, 
    peerPlayers,
    allPlayerProfiles,
    myPlayerSeat,
    myGameTableAccess,
    gameActions,
    onHostActionStr,
  } = hostedP2pGame;

  if (!gameTable) {
    return <div>Game table not found</div>;
  }

  if (myGameTableAccess !== 'host') {
    return <div>You are not the host of this game table</div>;
  }

  if (!gameActions) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Game Actions...</h1>
        <div className="text-gray-600">Loading game action history...</div>
      </div>
    )
  }

  const activeTabId: GameTabId = '/games/$role/$tableId/admin';

  const onActingAsPlayerGameAction = (_actingAsPlayerSeat: GameTableSeat, _playerAction: any) => {
    throw new Error('Not implemented');
  }

  return (
    <>
      {/* <BfgHostedGameBar
        activeTabId={activeTabId}
      /> */}
      <BfgGameBar
        myGameTableAccess={myGameTableAccess}
        activeTabId={activeTabId}
      />
      
      <HostedGameView
        hostedGame={gameTable}
        myPlayerProfile={myPlayerProfile}
        myPlayerSeat={myPlayerSeat}
        gameActions={gameActions}
        peers={peers}
        peerPlayers={peerPlayers}
        allPlayerProfiles={allPlayerProfiles}
        onActingAsPlayerGameAction={onActingAsPlayerGameAction}
        onHostGameAction={onHostActionStr}
      />
    </>
  )
}
