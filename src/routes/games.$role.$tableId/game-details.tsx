import { z } from 'zod';
import { createFileRoute } from '@tanstack/react-router'
import { GameTabId, getGameTabItems } from './-components'
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids';
import { GameTableAccessRoleSchema } from '@bfg-engine/models/game-roles';
import { HostedGameDetailsComponent } from '@bfg-engine/ui/components/host-game-details-component';
import { PlayerGameDetailsComponent } from '@bfg-engine/ui/components/player-game-details-component';
import { Container, ObserverP2pGameDetailsComponent, Stack, Typography } from '@bfg-engine';
import { BfgGameScreenFrame } from '@bfg-engine/ui/components/bfg-game-screen-frame';
import { useBfgGameRoomForRole } from '@bfg-engine/hooks/p2p/game/use-bfg-game-room';


const paramsSchema = z.object({
  role: GameTableAccessRoleSchema,
  tableId: BfgGameTableId.idSchema,
})

const GameDetailsRoute = () => {
  const { role, tableId } = Route.useParams()
  
  // const p2pGame = useP2pGameContext();
  const p2pGame = useBfgGameRoomForRole(role);

  if (!p2pGame) {
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

  const { p2pDetails, maxAllowedAccessRole, allowedRoles } = p2pGame;

  if (!p2pDetails) {
    return (
      <Container style={{ padding: '24px' }}>
        <Stack spacing={3}>
          <Typography variant="h3">Loading Game...</Typography>
          <Typography variant="body1" color="secondary">
            Loading P2P Game Details...
          </Typography>
        </Stack>
      </Container>
    )
  }

  const { allPlayerProfiles } = p2pDetails;
  const { gameTable, gameActions, gameMetadata } = p2pGame.publicGameDetails;
  // const { gameMetadata } = p2pGame.gameDetails;

  // const gameRegistry = useGameRegistry();

  const activeTabId: GameTabId = '/games/$role/$tableId/game-details';

  if (!gameTable) {
    return <div>Game table not found: {tableId}</div>;
  }

  if (!allowedRoles.includes(role)) {
    return <div>You are not allowed to access this game table as a {role}</div>;
  }
  // const gameMetadata = gameRegistry.getGameMetadata(gameTable.gameTitle);

  const gameTabItems = getGameTabItems(role);
  const tabsConfig = {
    tabItems: gameTabItems,
    activeTabId: activeTabId,
    onTabChange: () => { console.log('onTabChange not implemented'); }
  };

  const getGameScreen = () => {
    if (role === 'host') {
      return (
        <HostedGameDetailsComponent
          gameTable={gameTable}
          gameActions={gameActions}
        />
      )
    }
    if (role === 'player') {
      return (
        <PlayerGameDetailsComponent />
      )
    }
    if (role === 'observer') {
      return (
        <ObserverP2pGameDetailsComponent
          gameTableId={tableId}
        />
      )
    }

    throw new Error(`Invalid game table access role: ${role}`);
  }

  const gameScreen = getGameScreen();

  const latestGameAction = gameActions[gameActions.length - 1];
  const latestGameSpecificState = latestGameAction ?
    gameMetadata.encoders.hostGameStateEncoder.decode(latestGameAction.nextGameStateStr) :
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
      {gameScreen}
    </BfgGameScreenFrame>
  )
}


export const Route = createFileRoute('/games/$role/$tableId/game-details')({
  component: GameDetailsRoute,
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ role: params.role, tableId: params.tableId }),
  },
})
