import { PlayerP2pGameComponent, useRiskyMyDefaultPlayerProfile, Container, Typography, Stack } from "@bfg-engine";
import { useP2pGameContext } from "@bfg-engine/hooks/p2p/game/p2p-game-context";
import { GameTableId } from "@bfg-engine/models/types/bfg-branded-ids";
import { BfgGameScreenFrame } from "@bfg-engine/ui/components/bfg-game-screen-frame";
import { GameTabId, getGameTabItems } from "~/routes/games.$role.$tableId/-components";
import { useGameRegistry } from "@bfg-engine/hooks/games-registry/games-registry";


interface IPlayerGamePageProps {
  tableId: GameTableId;
}

export const PlayerGamePage = ({ tableId }: IPlayerGamePageProps) => {

  const activeTabId: GameTabId = '/games/$role/$tableId';

  const myPlayerProfile = useRiskyMyDefaultPlayerProfile();
  const gameRegistry = useGameRegistry();

  if (!myPlayerProfile) {
    return (
      <Container style={{ padding: '24px' }}>
        <Stack spacing={3}>
          <Typography variant="h3">Loading Game...</Typography>
          <Typography variant="body1" color="secondary">
            Loading game ee details...
          </Typography>
        </Stack>
      </Container>
    )
  }

  const { myGameTableAccess, gameTable, gameActions, allPlayerProfiles } = useP2pGameContext();

  if (!gameTable) {
    return (
      <Container style={{ padding: '24px' }}>
        <Stack spacing={3}>
          <Typography variant="h3">Loading Game...</Typography>
          <Typography variant="body1" color="secondary">
            Loading game table...
          </Typography>
        </Stack>
      </Container>
    )
  }

  if (!gameActions) {
    return (
      <Container style={{ padding: '24px' }}>
        <Stack spacing={3}>
          <Typography variant="h3">Loading Game...</Typography>
          <Typography variant="body1" color="secondary">
            Loading game actions...
          </Typography>
        </Stack>
      </Container>
    )
  }

  const gameMetadata = gameRegistry.getGameMetadata(gameTable.gameTitle);
  const latestGameSpecificStateStr = gameActions.length > 0 ? 
    gameActions[gameActions.length - 1].nextGameStateStr :
    null;
  const latestGameSpecificState = latestGameSpecificStateStr ?
    gameMetadata.gameSpecificStateEncoder.decode(latestGameSpecificStateStr) :
    null;

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
      <PlayerP2pGameComponent
        gameTableId={tableId}
        playerProfile={myPlayerProfile}
        mode="player-game"
      />
    </BfgGameScreenFrame>
  )
}
