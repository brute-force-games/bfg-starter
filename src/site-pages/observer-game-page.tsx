import { Container, ObserverP2pGameComponent, Stack, Typography } from "@bfg-engine";
import { BfgGameScreenFrame } from "@bfg-engine/ui/components/bfg-game-screen-frame";
import { GameTabId, getGameTabItems } from "~/routes/games/-components";
import type { IBfgGameTableForObserver } from "../../modules/bfg-engine/src/hooks/p2p/game/p2p-game-types";


export const ObserverGamePage = (props: IBfgGameTableForObserver) => {

  const { publicGameDetails } = props;

  if (!publicGameDetails) {
    return (
      <Container style={{ padding: '24px' }}>
        <Stack spacing={3}>
          <Typography variant="h3">Loading Game...</Typography>
          <Typography variant="body1" color="secondary">
            Loading P2P Game for observer...
          </Typography>
        </Stack>
      </Container>
    )
  }

  const { gameRoom, latestWatcherGameEvent, watcherGameEvents, gameMetadata, allPlayerProfiles } = publicGameDetails;

  if (!gameMetadata || !gameRoom || !watcherGameEvents || watcherGameEvents.length === 0 || !latestWatcherGameEvent) {
    return (
      <Container style={{ padding: '24px' }}>
        <Stack spacing={3}>
          <Typography variant="h3">Loading Game...</Typography>
          { !gameMetadata && <Typography variant="body1" color="secondary">Waiting for game metadata...</Typography> }
          { !gameRoom && <Typography variant="body1" color="secondary">Waiting for game room...</Typography> }
          { (!watcherGameEvents || watcherGameEvents.length === 0) && <Typography variant="body1" color="secondary">Waiting for game events...</Typography> }
          { !latestWatcherGameEvent && <Typography variant="body1" color="secondary">Waiting for latest game event...</Typography> }
        </Stack>
      </Container>
    );
  }

  // const latestGameSpecificStateStr = gameActions.length > 0 ? 
  //   gameActions[gameActions.length - 1].nextGameStateStr :
  //   null;
  // const latestGameSpecificState = latestGameSpecificStateStr ?
  //   gameMetadata.encoders.publicGameStateEncoder.decode(latestGameSpecificStateStr) :
  //   null;
  const latestGameSpecificState = latestWatcherGameEvent.nextGameWatcherState;

  // Convert watcher events to board events format
  // const boardEvents = watcherGameEvents.map(event => 
  //   convertWatcherEventToBoardEvent(event, gameMetadata)
  // );

  const activeTabId: GameTabId = '/games/watch/$gameId';

  const gameTabItems = getGameTabItems('observer');
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
      <ObserverP2pGameComponent
        {...publicGameDetails}
      />
    </BfgGameScreenFrame>
  )
}
