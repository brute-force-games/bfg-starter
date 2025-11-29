import { z } from 'zod';
import { createFileRoute } from '@tanstack/react-router'
import { Container, Stack, Typography } from '@bfg-engine';
import { useGameRoomAsHost } from '@bfg-engine/hooks/p2p/game/use-game-room-as-host';
import { HostedGameDetailsPage } from '~/site-pages/host-game-details-page';
import { BfgGameInstanceIdToolbox } from '@bfg-engine/models/types/bfg-branded-uuids';


const paramsSchema = z.object({
  tableId: BfgGameInstanceIdToolbox.idSchema,
})

const GameDetailsRoute = () => {
  
  const p2pGameRoom = useGameRoomAsHost();

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
  
  const { publicGameDetails, allowedLevels, accessLevel } = p2pGameRoom;

  if (!publicGameDetails) {
    return <div>Public game details not found</div>;
  }
    
  if (!allowedLevels.includes(accessLevel)) {
    return <div>You are not allowed to access this game table as '{accessLevel}'</div>;
  }

  if (accessLevel !== 'host') {
    return <div>You are not the host of this game table</div>;
  }

  return (
    <HostedGameDetailsPage
      {...p2pGameRoom}
    />
  )
}


export const Route = createFileRoute('/games/host/$gameId/game-details')({
  component: GameDetailsRoute,
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ tableId: params.tableId }),
  },
})
