import { PlayerP2pGameComponent } from "@bfg-engine";
import { BfgGameScreenFrame } from "@bfg-engine/ui/components/bfg-game-screen-frame";
import { GameTabId, getGameTabItems } from "~/routes/games.$role.$tableId/-components";
import { IBfgGameRoomForPlayer } from "@bfg-engine/hooks/p2p/game/p2p-game-types";
import type { BfgGameActionByPlayer, BfgGameActionByHost } from "../../modules/bfg-engine/src/game-metadata/metadata-types/game-action-types";
import type { BfgGameStateForHost, BfgGameStateForPlayer, BfgGameStateForWatcher } from "../../modules/bfg-engine/src/game-metadata/metadata-types/game-state-types";


// interface PlayerGamePageProps {
//   p2pGameRoom: IBfgGameRoomForPlayer;
// }

export const PlayerGamePage = <
  GSH extends BfgGameStateForHost,
  GSP extends BfgGameStateForPlayer,
  GSW extends BfgGameStateForWatcher,
  PGA extends BfgGameActionByPlayer,
  HGA extends BfgGameActionByHost,
> (props: IBfgGameRoomForPlayer<GSH, GSP, GSW, PGA, HGA>) => {

  const { playerGameDetails } = props;

  const { gameTable, gameActions, gameMetadata, allPlayerProfiles } = playerGameDetails;

  const latestGameSpecificStateStr = gameActions.length > 0 ? 
    gameActions[gameActions.length - 1].nextGameStateStr :
    null;
  const latestGameSpecificState = latestGameSpecificStateStr ?
    gameMetadata.encoders.publicGameStateEncoder.decode(latestGameSpecificStateStr) :
    null;

  // if (!latestGameSpecificState) {
  //   return (
  //     <Container style={{ padding: '24px' }}>
  //       <Stack spacing={3}>
  //         <Typography variant="h3">Loading Game...</Typography>
  //       </Stack>
  //     </Container>
  //   )
  // }

  const activeTabId: GameTabId = '/games/$role/$tableId';

  const gameTabItems = getGameTabItems('play');
  const tabsConfig = {
    tabItems: gameTabItems,
    activeTabId: activeTabId,
    onTabClicked: () => { console.log('onTabClicked not implemented'); }
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
