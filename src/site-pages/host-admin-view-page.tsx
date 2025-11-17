import { HostedGameView } from "@bfg-engine/ui/components/hosted-game-view";
import { GameTabId, getGameTabItems } from "~/routes/xgames.$role.$tableId/-components";
import { BfgGameScreenFrame } from "@bfg-engine/ui/components/bfg-game-screen-frame";
import { AppBarTabsConfig } from "@bfg-engine/ui/components/bfg-app-bar/tabs-config";
import { IBfgGameTableForHost } from "@bfg-engine/hooks/p2p/game/p2p-game-types";


export const HostAdminViewPage = (props: IBfgGameTableForHost) => {

  // const { p2pDetails, hostGameDetails } = props;
  const { p2pDetails, hostGameDetails, publicGameDetails, gameMetadata } = props;
  
  if (!p2pDetails || !hostGameDetails || !publicGameDetails || !gameMetadata) {
    return <div>Game details not available</div>;
  }
  
  const { allPlayerProfiles } = p2pDetails;

  // const {
  //   gameTable,
  //   gameMetadata,
  //   gameActions,
  // } = hostGameDetails;
  const { gameRoom } = publicGameDetails;

  // console.log('HostAdminViewPage - gameTable:', gameTable, 'hostGameDetails:', hostGameDetails);

  if (!gameRoom) {
    // console.error('HostAdminViewPage: gameTable is null/undefined', { gameTable, hostGameDetails, props });
    return <div>Game room not found</div>;
  }

  // if (!gameActions) {
  //   return (
  //     <div className="p-6">
  //       <h1 className="text-3xl font-bold mb-6">Loading Game Actions...</h1>
  //       <div className="text-gray-600">Loading game action history...</div>
  //     </div>
  //   )
  // }

  const activeTabId: GameTabId = '/games/$role/$tableId/admin';
  const gameTabItems = getGameTabItems('host');
  const tabsConfig: AppBarTabsConfig<GameTabId> = {
    tabItems: gameTabItems,
    activeTabId: activeTabId,
    onTabClicked: () => { console.warn('onTabClicked not implemented'); }
  };

  const latestHostGameEvent = hostGameDetails.latestHostGameEvent;
  const latestHostGameState = latestHostGameEvent.nextGameHostState;
  
  // Convert host events to board events format
  // const gameActions = hostGameDetails.hostGameEvents.map(event => 
  //   convertHostEventToBoardEvent(event, gameMetadata)
  // );

  // const latestGameSpecificStateStr = gameActions.length > 0 ? 
  //   gameActions[gameActions.length - 1].nextGameStateStr :
  //   null;
  // const latestGameSpecificState = latestGameSpecificStateStr ?
  //   gameMetadata.encoders.hostGameStateEncoder.decode(latestGameSpecificStateStr) :
  //   null;

  return (
    <BfgGameScreenFrame
      tabsConfig={tabsConfig}
      gameMetadata={gameMetadata}
      gameRoom={gameRoom}
      allPlayerProfiles={allPlayerProfiles}
      gameState={latestHostGameState}
      boardEvents={publicGameDetails.watcherGameEvents}
    >
      <HostedGameView
        {...props}
      />
    </BfgGameScreenFrame>
  )
}
