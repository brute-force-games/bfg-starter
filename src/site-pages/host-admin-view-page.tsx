import { HostedGameView } from "@bfg-engine/ui/components/hosted-game-view";
import { GameTabId, getGameTabItems } from "~/routes/games.$role.$tableId/-components";
import { BfgGameScreenFrame } from "@bfg-engine/ui/components/bfg-game-screen-frame";
import { IBfgGameRoomForHost } from "@bfg-engine/hooks/p2p/game/p2p-game-types";
import { AppBarTabsConfig } from "@bfg-engine/ui/components/bfg-app-bar/tabs-config";


export const HostAdminViewPage = (props: IBfgGameRoomForHost) => {

  const { p2pDetails, hostGameDetails } = props;
  const { allPlayerProfiles } = p2pDetails;

  const {
    gameTable,
    gameMetadata,
    gameActions,
  } = hostGameDetails;

  console.log('HostAdminViewPage - gameTable:', gameTable, 'hostGameDetails:', hostGameDetails);

  if (!gameTable) {
    console.error('HostAdminViewPage: gameTable is null/undefined', { gameTable, hostGameDetails, props });
    return <div>Game table not found</div>;
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
  const gameTabItems = getGameTabItems('host');
  const tabsConfig: AppBarTabsConfig<GameTabId> = {
    tabItems: gameTabItems,
    activeTabId: activeTabId,
    onTabClicked: () => { console.warn('onTabClicked not implemented'); }
  };


  const latestGameSpecificStateStr = gameActions.length > 0 ? 
    gameActions[gameActions.length - 1].nextGameStateStr :
    null;
  const latestGameSpecificState = latestGameSpecificStateStr ?
    gameMetadata.encoders.hostGameStateEncoder.decode(latestGameSpecificStateStr) :
    null;

  return (
    <BfgGameScreenFrame
      tabsConfig={tabsConfig}
      gameMetadata={gameMetadata}
      gameTable={gameTable}
      allPlayerProfiles={allPlayerProfiles}
      gameState={latestGameSpecificState}
      gameActions={gameActions}
    >
      <HostedGameView
        {...props}
      />
    </BfgGameScreenFrame>
  )
}
