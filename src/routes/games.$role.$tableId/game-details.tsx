import { z } from 'zod';
import { createFileRoute } from '@tanstack/react-router'
import { GameTableAccessRoleSchema } from '@bfg-engine/models/game-roles';
import { Container, Stack, Typography } from '@bfg-engine';
import { useBfgGameRoomForContextRole } from '@bfg-engine/hooks/p2p/game/use-bfg-game-room';
import { PlayerGameDetailsPage } from '~/site-pages/player-game-details-page';
import { HostedGameDetailsPage } from '~/site-pages/host-game-details-page';
import { ObserverGameDetailsPage } from '~/site-pages/observer-game-details-page';
import { BfgGameTableIdToolbox } from '@bfg-engine/models/types/bfg-branded-uuids';


const paramsSchema = z.object({
  role: GameTableAccessRoleSchema,
  tableId: BfgGameTableIdToolbox.idSchema,
})

const GameDetailsRoute = () => {
  
  const bfgGameRoom = useBfgGameRoomForContextRole();

  if (!bfgGameRoom) {
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
  
  const { publicGameDetails, allowedRoles, accessRole } = bfgGameRoom;

  if (!publicGameDetails) {
    return <div>Public game details not found</div>;
  }

  // const { gameTable, gameActions, gameMetadata, allPlayerProfiles } = publicGameDetails;
  // const { gameTable, gameActions, gameMetadata, allPlayerProfiles } = playerGameDetails;

  // const activeTabId: GameTabId = '/games/$role/$tableId/game-details';

  // console.log('GameDetailsRoute - gameTable:', 'publicGameDetails:', publicGameDetails);

  // if (!gameTable) {
  //   console.error('GameDetailsRoute: gameTable is null/undefined', { gameTable, publicGameDetails, bfgGameRoom });
  //   return <div>Game table not found: {bfgGameRoom.gameTableId}</div>;
  // }

  if (!allowedRoles.includes(accessRole)) {
    return <div>You are not allowed to access this game table as a {accessRole}</div>;
  }

  // const gameTabItems = getGameTabItems(accessRole);
  // const tabsConfig = {
  //   tabItems: gameTabItems,
  //   activeTabId: activeTabId,
  //   onTabClicked: () => { console.log('onTabClicked not implemented'); }
  // };

  // const getGameScreen = () => {
    
    if (accessRole === 'host') {
      
      return (
        <HostedGameDetailsPage
          {...bfgGameRoom}
        />
      )
    }

    if (accessRole === 'play') {
      
      return (
        <PlayerGameDetailsPage
          {...bfgGameRoom}
        />
      )
    }
    if (accessRole === 'watch') {
      return (
        <ObserverGameDetailsPage
          {...bfgGameRoom}
        />
      )
    }

    throw new Error(`Invalid game table access role: ${accessRole}`);
  // }

  // const gameScreen = getGameScreen();

  // const latestGameAction = gameActions[gameActions.length - 1];
  // const latestGameSpecificState = latestGameAction ?
  //   gameMetadata.encoders.hostGameStateEncoder.decode(latestGameAction.nextGameStateStr) :
  //   null;

  // return (
  //   <BfgGameScreenFrame
  //     tabsConfig={tabsConfig}
  //     gameMetadata={gameMetadata}
  //     gameTable={gameTable}
  //     allPlayerProfiles={allPlayerProfiles}
  //     gameState={latestGameSpecificState}
  //     gameActions={gameActions}
  //   >
  //     {gameScreen}
  //   </BfgGameScreenFrame>
  // )
}


export const Route = createFileRoute('/games/$role/$tableId/game-details')({
  component: GameDetailsRoute,
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ role: params.role, tableId: params.tableId }),
  },
})
