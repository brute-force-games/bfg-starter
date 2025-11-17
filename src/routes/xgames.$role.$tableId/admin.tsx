import { createFileRoute, useRouter } from '@tanstack/react-router';
import { HostAdminViewPage } from '~/site-pages/host-admin-view-page';
import { useBfgGameRoomForContextRole } from '@bfg-engine/hooks/p2p/game/use-bfg-game-room';
import { Button, Container, Paper, Stack, Typography } from '@bfg-engine';


// const paramsSchema = z.object({
//   role: GameTableAccessRoleSchema,
//   tableId: BfgGameTableId.idSchema,
// })

// type RouteParams = z.infer<typeof paramsSchema>


const HostGameAdminRoute = () => {
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
  if (role !== 'host') {
    return <div>You are not the host of this game table</div>;
  }

  return (
    <HostAdminViewPage
      {...gameRoom}
    />
  )
}


export const Route = createFileRoute('/games/$role/$tableId/admin')({
  component: HostGameAdminRoute,
  // params: {
  //   parse: (params) => paramsSchema.parse(params),
  //   stringify: (params) => ({ role: params.role, tableId: params.tableId }),
  // },
})
