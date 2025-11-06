import { GameTabId, getGameTabItems } from "~/routes/games.$role.$tableId/-components";
import { PlayerGameView } from "@bfg-engine/ui/components/player-game-view";
import { BfgGameScreenFrame } from "@bfg-engine/ui/components/bfg-game-screen-frame";
import { IBfgGameRoomForHost } from "@bfg-engine/hooks/p2p/game/p2p-game-types";


interface HostGamePlayerViewPageProps {
  p2pGameRoom: IBfgGameRoomForHost;
}

export const HostGamePlayerViewPage = ({ p2pGameRoom }: HostGamePlayerViewPageProps) => {

  const { publicGameDetails, playerGameDetails } = p2pGameRoom;

  if (!publicGameDetails || !playerGameDetails) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Game Details Not Available</h1>
        <div className="text-gray-600">Game details are not available.</div>
      </div>
    )
  }

  const { allPlayerProfiles } = publicGameDetails;

  const {
    gameTable,
    gameActions,
    gameMetadata,
  } = publicGameDetails;

  if (!gameTable) {
    return <div>Game table not found</div>;
  }

  if (p2pGameRoom.maxAllowedAccessRole !== 'host') {
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

  const latestGameSpecificStateStr = gameActions.length > 0 ? 
    gameActions[gameActions.length - 1].nextGameStateStr :
    null;
  const latestHostGameState = latestGameSpecificStateStr ?
    gameMetadata.encoders.hostGameStateEncoder.decode(latestGameSpecificStateStr) :
    null;

  const activeTabId: GameTabId = '/games/$role/$tableId';

  const gameTabItems = getGameTabItems('host');
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
      gameState={latestHostGameState}
      gameActions={gameActions}
    >
      <PlayerGameView
        {...playerGameDetails}
      />
    </BfgGameScreenFrame>
  )
}
