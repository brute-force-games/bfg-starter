import { useHostedP2pGameWithStore } from "@bfg-engine/hooks/p2p/game/use-hosted-p2p-game-with-store";
import { PublicPlayerProfile } from "@bfg-engine/models/player-profile/public-player-profile";
import { GameTableId } from "@bfg-engine/models/types/bfg-branded-ids";
import { GameTabId, getGameTabItems } from "~/routes/games.$role.$tableId/-components";
import { PlayerGameView } from "@bfg-engine/ui/components/player-game-view";
import { BfgGameScreenFrame } from "@bfg-engine/ui/components/bfg-game-screen-frame";
import { useGameRegistry } from "@bfg-engine/hooks/games-registry/games-registry";


interface HostGamePlayerViewPageProps {
  tableId: GameTableId;
  myPlayerProfile: PublicPlayerProfile | null;
}

export const HostGamePlayerViewPage = ({ tableId, myPlayerProfile }: HostGamePlayerViewPageProps) => {

  const hostedP2pGame = useHostedP2pGameWithStore(tableId, myPlayerProfile);
  const gameRegistry = useGameRegistry();

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
    onSelfPlayerActionStr,
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

  const gameMetadata = gameRegistry.getGameMetadata(gameTable.gameTitle);
  const latestGameSpecificStateStr = gameActions.length > 0 ? 
    gameActions[gameActions.length - 1].nextGameStateStr :
    null;
  const latestGameSpecificState = latestGameSpecificStateStr ?
    gameMetadata.gameSpecificStateEncoder.decode(latestGameSpecificStateStr) :
    null;

  const activeTabId: GameTabId = '/games/$role/$tableId';

  const gameTabItems = getGameTabItems(myGameTableAccess);
  const tabsConfig = {
    tabItems: gameTabItems,
    activeTabId: activeTabId,
    onTabChange: () => { console.log('onTabChange not implemented'); }
  };

  return (
      <BfgGameScreenFrame
        tabsConfig={tabsConfig}
        gameMetadata={gameMetadata}
        gameTable={gameTable}
        allPlayerProfiles={allPlayerProfiles}
        gameState={latestGameSpecificState}
        gameActions={gameActions}
      >
        {myPlayerSeat ? (
          <PlayerGameView
            myPlayerSeat={myPlayerSeat}
            myPlayerProfile={myPlayerProfile}
            gameTable={gameTable}
            gameActions={gameActions}
            peers={peers}
            peerPlayers={peerPlayers}
            allPlayerProfiles={allPlayerProfiles}
            onPlayerGameAction={onSelfPlayerActionStr}
          />
        ) : (
          <div>You are not a player of this game table</div>
        )}
    </BfgGameScreenFrame>
  )
}

  //     <PlayerGameView
  //       allPlayerProfiles={allPlayerProfiles}
  //       myPlayerProfile={myHostPlayerProfile}
  //       myPlayerSeat={myPlayerSeat}
  //       gameTable={gameTable}
  //       peers={peers}
  //       peerPlayers={peerPlayers}
  //       gameActions={gameActions}
  //       onPlayerGameAction={onSelfPlayerActionStr}
  //     />