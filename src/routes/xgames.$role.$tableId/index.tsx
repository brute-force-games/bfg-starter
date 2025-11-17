import { createFileRoute, useRouter } from '@tanstack/react-router'
import { PlayerGamePage } from '~/site-pages/player-game-page'
import { ObserverGamePage } from '~/site-pages/observer-game-page'
import { HostGamePlayerViewPage } from '~/site-pages/host-player-view-page'
import { useBfgGameRoomForContextRole } from '@bfg-engine/hooks/p2p/game/use-bfg-game-room'
import { Button, Container, Paper, Stack, Typography } from '@bfg-engine'


const GamesRoleAndTableIdPage = () => {
  const router = useRouter();

  const p2pGameRoom = useBfgGameRoomForContextRole();
  if (!p2pGameRoom) {
    return (
      <Container maxWidth="md" style={{ padding: '32px' }}>
        <Paper elevation={2} style={{
          backgroundColor: '#fff3e0',
          border: '2px solid #ff9800',
          padding: '24px'
        }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h5" color="primary">
              No Game Room Found
            </Typography>
            <Typography variant="body1" color="secondary">
              It looks like this isn't an active game room. Would you like to create a new lobby?
            </Typography>
            <Button
              onClick={() => router.navigate({ to: '/new-lobby' })}
              variant="contained"
              color="primary"
              size="large"
            >
              Create New Lobby
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }
  
  // const { accessRole } = p2pGameRoom;
  const { role, gameRoom } = p2pGameRoom;

  if (role === 'host') {
    return (
      <HostGamePlayerViewPage
        p2pGameRoom={gameRoom}
      />
    )  
  }

  if (role === 'play') {
    return (
      <PlayerGamePage
        {...gameRoom}
      />
    )
  }

  if (role === 'watch') {
    return (
      <ObserverGamePage 
        {...gameRoom}
      />
    )
  }

  return <div>You can not access this game table as a {role}</div>;
}


export const Route = createFileRoute('/games/$role/$tableId/')({
  component: GamesRoleAndTableIdPage,
  // params: {
  //   parse: (params) => paramsSchema.parse(params),
  //   stringify: (params) => ({ role: params.role, tableId: params.tableId }),
  // },
})
