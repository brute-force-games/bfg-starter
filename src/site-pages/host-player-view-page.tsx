import { GameTabId, getGameTabItems } from "~/routes/games/-components";
import { PlayerGameView } from "@bfg-engine/ui/components/player-game-view";
import { BfgGameScreenFrame } from "@bfg-engine/ui/components/bfg-game-screen-frame";
import { IBfgGameTableForHost } from "@bfg-engine/hooks/p2p/game/p2p-game-types";


interface HostGamePlayerViewPageProps {
  p2pGameRoom: IBfgGameTableForHost;
}

export const HostGamePlayerViewPage = ({ p2pGameRoom }: HostGamePlayerViewPageProps) => {

  const { publicGameDetails, playerGameDetails, hostGameDetails, gameMetadata } = p2pGameRoom;

  if (!publicGameDetails || !playerGameDetails || !hostGameDetails || !gameMetadata) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Game Details Not Available</h1>
        <div className="text-gray-600">Game details are not available.</div>
      </div>
    )
  }

  const { allPlayerProfiles, gameRoom, watcherGameEvents } = publicGameDetails;

  // const {
  //   gameTable,
  //   gameActions,
  //   gameMetadata,
  // } = publicGameDetails;

  if (!gameRoom) {
    return <div>Game room not found</div>;
  }

  if (p2pGameRoom.maxAllowedAccessRole !== 'host') {
    return <div>You are not the host of this game table</div>;
  }

  // if (!gameActions || gameActions.length === 0) {
  //   return (
  //     <div className="p-6">
  //       <h1 className="text-3xl font-bold mb-6">Loading Game Actions...</h1>
  //       <div className="text-gray-600">Loading game action history...</div>
  //     </div>
  //   )
  // }

  // const latestGameSpecificStateStr = gameActions[gameActions.length - 1].nextGameStateStr;
  // const latestHostGameState = gameMetadata.encoders.hostGameStateEncoder.decode(latestGameSpecificStateStr);
  const latestHostGameEvent = hostGameDetails.latestHostGameEvent;
  const latestHostGameState = latestHostGameEvent.nextGameHostState;

  const activeTabId: GameTabId = '/games/host/$tableId';

  const gameTabItems = getGameTabItems('host');
  const tabsConfig = {
    tabItems: gameTabItems,
    activeTabId: activeTabId,
    onTabClicked: () => { console.log('onTabClicked not implemented'); }
  };

  return (
    <BfgGameScreenFrame
      tabsConfig={tabsConfig}
      gameMetadata={gameMetadata}
      gameRoom={gameRoom}
      allPlayerProfiles={allPlayerProfiles}
      gameState={latestHostGameState}
      boardEvents={watcherGameEvents}
    >
      <PlayerGameView
        {...playerGameDetails}
      />
    </BfgGameScreenFrame>
  )
}
