import { z } from 'zod';
import { createFileRoute } from '@tanstack/react-router'
import { GameTableAccessRoleSchema } from '@bfg-engine/models/game-roles';
import { Container, Stack, Typography } from '@bfg-engine';
import { useP2pGameRoomAsObserver } from '@bfg-engine/hooks/p2p/game/use-p2p-game-room-as-observer';
import { ObserverGameDetailsPage } from '~/site-pages/observer-game-details-page';
import { BfgGameTableIdToolbox } from '@bfg-engine/models/types/bfg-branded-uuids';


const paramsSchema = z.object({
  role: GameTableAccessRoleSchema,
  tableId: BfgGameTableIdToolbox.idSchema,
})

const GameDetailsRoute = () => {
  
  const p2pGameRoom = useP2pGameRoomAsObserver();

  if (!p2pGameRoom) {
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
  
  // const { publicGameDetails, allowedRoles, accessRole } = bfgGameRoom;
  // const { gameRoom } = p2pGameRoom;
  const { publicGameDetails, allowedRoles, accessRole } = p2pGameRoom;

  if (!publicGameDetails) {
    return <div>Public game details not found</div>;
  }

  if (!allowedRoles.includes(accessRole)) {
    return <div>You are not allowed to access this game table as a {accessRole}</div>;
  }


  if (accessRole !== 'watch') {
    return <div>You are not a watcher at this game table</div>;
  }

  // if (accessRole === 'host') {
    
  //   return (
  //     <HostedGameDetailsPage
  //       {...gameRoom}
  //     />
  //   )
  // }

  // if (accessRole === 'play') {
    
  //   return (
  //     <PlayerGameDetailsPage
  //       {...gameRoom}
  //     />
  //   )
  // }

  // if (accessRole === 'watch') {
    return (
      <ObserverGameDetailsPage
        {...p2pGameRoom}
      />
    )
  // }

  // throw new Error(`Invalid game table access role: ${accessRole}`);
}


export const Route = createFileRoute('/games/watch/$tableId/game-details')({
  component: GameDetailsRoute,
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ role: params.role, tableId: params.tableId }),
  },
})
