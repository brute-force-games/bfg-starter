import { z } from 'zod';
import { createFileRoute } from '@tanstack/react-router'
import { Container, Stack, Typography } from '@bfg-engine';
import { useGameRoomAsPlayer } from '@bfg-engine/hooks/p2p/game/use-game-room-as-player';
import { PlayerGameDetailsPage } from '~/site-pages/player-game-details-page';
import { BfgGameTableIdToolbox } from '@bfg-engine/models/types/bfg-branded-uuids';


const paramsSchema = z.object({
  tableId: BfgGameTableIdToolbox.idSchema,
})

const GameDetailsRoute = () => {
  
  const p2pGameRoom = useGameRoomAsPlayer();

  if (!p2pGameRoom) {
    return (
      <Container style={{ padding: '24px' }}>
        <Stack spacing={3}>
          <Typography variant="h3">Loading Game...</Typography>
          <Typography variant="body1" color="secondary">
            Loading P2P Game for player...
          </Typography>
        </Stack>
      </Container>
    )
  }
  
  // const { publicGameDetails, allowedRoles, accessRole } = bfgGameRoom;
  //  const { gameRoom } = p2pGameRoom;
  const { publicGameDetails, allowedLevels, accessLevel } = p2pGameRoom;

  if (!publicGameDetails) {
    return <div>Public game details not found</div>;
  }

  if (!allowedLevels.includes(accessLevel)) {
    return <div>You are not allowed to access this game table as a {accessLevel}</div>;
  }

  if (accessLevel !== 'player') {
    return <div>You are not a player at this game table</div>;
  }

  // if (accessRole === 'host') {
    
  //   return (
  //     <HostedGameDetailsPage
  //       {...gameRoom}
  //     />
  //   )
  // }

  // if (accessRole === 'play') {
    
    return (
      <PlayerGameDetailsPage
        {...p2pGameRoom}
      />
    )
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


export const Route = createFileRoute('/games/play/$gameId/game-details')({
  component: GameDetailsRoute,
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ tableId: params.tableId }),
  },
})
