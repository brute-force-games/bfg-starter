import { createFileRoute, useRouter } from '@tanstack/react-router'
import { ObserverGamePage } from '~/site-pages/observer-game-page'
import { Button, Container, Paper, Stack, Typography } from '@bfg-engine'
import { useGameRoomWithUnknownAccessMode } from '../../../../modules/bfg-engine/src/hooks/p2p/game/use-game-room-with-unknown-access-mode'
import { adaptToGameRoomAsObserver } from '../../../../modules/bfg-engine/src/hooks/p2p/game/watcher/adapt-to-game-room-as-observer'


const ObserverGameIndexPage = () => {
  const router = useRouter();

  const gameRoomUnknown = useGameRoomWithUnknownAccessMode();
  const gameRoom = adaptToGameRoomAsObserver(gameRoomUnknown);
  
  if (!gameRoom) {
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
  
  const { accessLevel } = gameRoom;

  // TypeScript narrowing - parent route already scopes to watch, but TypeScript doesn't know that
  if (accessLevel !== 'observer') {
    return <div>You are not a watcher at this game table</div>;
  }

  return (
    <ObserverGamePage 
      {...gameRoom}
    />
  );
}


export const Route = createFileRoute('/games/watch/$gameId/')({
  component: ObserverGameIndexPage,
})
