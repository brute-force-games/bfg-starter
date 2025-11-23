import { z } from 'zod';
import { createFileRoute } from '@tanstack/react-router'
import { Container, Stack, Typography } from '@bfg-engine';
import { useP2pGameRoomAsHost } from '@bfg-engine/hooks/p2p/game/use-p2p-game-room-as-host';
import { HostedGameDetailsPage } from '~/site-pages/host-game-details-page';
import { BfgGameInstanceIdToolbox } from '@bfg-engine/models/types/bfg-branded-uuids';


const paramsSchema = z.object({
  tableId: BfgGameInstanceIdToolbox.idSchema,
})

const GameDetailsRoute = () => {
  
  const p2pGameRoom = useP2pGameRoomAsHost();

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


  if (accessRole !== 'host') {
    return <div>You are not the host of this game table</div>;
  }

  // if (accessRole === 'host') {
    
    return (
      <HostedGameDetailsPage
        {...p2pGameRoom}
      />
    )
  // }

  // if (accessRole === 'play') {
    
  //   return (
  //     <PlayerGameDetailsPage
  //       {...gameRoom}
  //     />
  //   )
  // }
  // if (accessRole === 'watch') {
  //   return (
  //     <ObserverGameDetailsPage
  //       {...gameRoom}
  //     />
  //   )
  // }

  // throw new Error(`Invalid game table access role: ${accessRole}`);
}


export const Route = createFileRoute('/games/host/$tableId/game-details')({
  component: GameDetailsRoute,
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ tableId: params.tableId }),
  },
})
