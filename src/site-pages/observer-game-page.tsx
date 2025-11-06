import { Container, ObserverP2pGameComponent, Stack, Typography } from "@bfg-engine";
import { IBfgGameRoomForObserver } from "@bfg-engine/hooks/p2p/game/p2p-game-types";
import { BfgGameScreenFrame } from "@bfg-engine/ui/components/bfg-game-screen-frame";
import { GameTabId, getGameTabItems } from "~/routes/games.$role.$tableId/-components";


interface ObserverGamePageProps {
  p2pGameRoom: IBfgGameRoomForObserver;
}

export const ObserverGamePage = ({ p2pGameRoom }: ObserverGamePageProps) => {

  const { publicGameDetails } = p2pGameRoom;

  if (!publicGameDetails) {
    return (
      <Container style={{ padding: '24px' }}>
        <Stack spacing={3}>
          <Typography variant="h3">Loading Game...</Typography>
          <Typography variant="body1" color="secondary">
            Loading P2P Game...
          </Typography>
        </Stack>
      </Container>
    )
  }

  const { gameTable, gameActions, gameMetadata, allPlayerProfiles } = publicGameDetails;

  const latestGameSpecificStateStr = gameActions.length > 0 ? 
    gameActions[gameActions.length - 1].nextGameStateStr :
    null;
  const latestGameSpecificState = latestGameSpecificStateStr ?
    gameMetadata.encoders.publicGameStateEncoder.decode(latestGameSpecificStateStr) :
    null;

  const activeTabId: GameTabId = '/games/$role/$tableId';

  const gameTabItems = getGameTabItems('watch');
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
      <ObserverP2pGameComponent
        {...publicGameDetails}
      />
    </BfgGameScreenFrame>
  )
}
