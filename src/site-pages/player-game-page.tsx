import { PlayerP2pGameComponent } from "@bfg-engine";
import { BfgGameScreenFrame } from "@bfg-engine/ui/components/bfg-game-screen-frame";
import { GameTabId, getGameTabItems } from "~/routes/games.$role.$tableId/-components";
import { IBfgGameRoomForPlayer } from "@bfg-engine/hooks/p2p/game/p2p-game-types";


interface PlayerGamePageProps {
  p2pGameRoom: IBfgGameRoomForPlayer;
}

export const PlayerGamePage = ({ p2pGameRoom }: PlayerGamePageProps) => {

  const { playerGameDetails } = p2pGameRoom;

  const { gameTable, gameActions, gameMetadata, allPlayerProfiles } = playerGameDetails;

  const latestGameSpecificStateStr = gameActions.length > 0 ? 
    gameActions[gameActions.length - 1].nextGameStateStr :
    null;
  const latestGameSpecificState = latestGameSpecificStateStr ?
    gameMetadata.encoders.publicGameStateEncoder.decode(latestGameSpecificStateStr) :
    null;

  const activeTabId: GameTabId = '/games/$role/$tableId';

  const gameTabItems = getGameTabItems('play');
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
      <PlayerP2pGameComponent
        {...playerGameDetails}
      />
    </BfgGameScreenFrame>
  )
}
