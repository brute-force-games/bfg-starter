import { PlayerP2pGameComponent } from "@bfg-engine";
import { BfgGameScreenFrame } from "@bfg-engine/ui/components/bfg-game-screen-frame";
import { GameTabId, getGameTabItems } from "~/routes/games/-components";
import { IBfgGameTableForPlayer } from "@bfg-engine/hooks/p2p/game/p2p-game-types";
// import type { BfgGameActionByPlayer, BfgGameActionByHost } from "../../modules/bfg-engine/src/game-metadata/metadata-types/game-action-types";
// import type { BfgGameStateForHost, BfgGameStateForPlayer, BfgGameStateForWatcher } from "../../modules/bfg-engine/src/game-metadata/metadata-types/game-state-types";
// import { convertPlayerEventToBoardEvent, convertWatcherEventToBoardEvent } from "../../modules/bfg-engine/src/models/game-table/game-table-event-converter";


// interface PlayerGamePageProps {
//   p2pGameRoom: IBfgGameTableForPlayer;
// }

// export const PlayerGamePage = <
//   GSH extends BfgGameStateForHost,
//   GSP extends BfgGameStateForPlayer,
//   GSW extends BfgGameStateForWatcher,
//   PGA extends BfgGameActionByPlayer,
//   HGA extends BfgGameActionByHost,
// > (props: IBfgGameRoomForPlayer<GSH, GSP, GSW, PGA, HGA>) => {
export const PlayerGamePage = (props: IBfgGameTableForPlayer) => {

  const { playerGameDetails } = props;

  const { gameRoom , watcherGameEvents, playerGameEvents, gameMetadata, allPlayerProfiles } = playerGameDetails;

  // const watcherBoardEvents = watcherGameEvents.map(event => 
  //   convertWatcherEventToBoardEvent(event, gameMetadata)
  // );

  // const playerBoardEvents = playerGameEvents.map(event => 
  //   convertPlayerEventToBoardEvent(event, gameMetadata)
  // );

  const latestGameSpecificState = playerGameEvents[playerGameEvents.length - 1].nextGamePlayerState;
  // const boardEvents = [...watcherBoardEvents, ...playerBoardEvents];

  // if (!latestGameSpecificState) {
  //   return (
  //     <Container style={{ padding: '24px' }}>
  //       <Stack spacing={3}>
  //         <Typography variant="h3">Loading Game...</Typography>
  //       </Stack>
  //     </Container>
  //   )
  // }

  const activeTabId: GameTabId = '/games/play/$gameId';

  const gameTabItems = getGameTabItems('player');
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
      gameState={latestGameSpecificState}
      boardEvents={watcherGameEvents}
    >
      <PlayerP2pGameComponent
        {...playerGameDetails}
      />
    </BfgGameScreenFrame>
  )
}
