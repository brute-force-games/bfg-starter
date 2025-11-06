import { createFileRoute } from '@tanstack/react-router';
import { HostAdminViewPage } from '~/site-pages/host-admin-view-page';
import { useBfgGameRoomForContextRole } from '@bfg-engine/hooks/p2p/game/use-bfg-game-room';


// const paramsSchema = z.object({
//   role: GameTableAccessRoleSchema,
//   tableId: BfgGameTableId.idSchema,
// })

// type RouteParams = z.infer<typeof paramsSchema>


const HostGameAdminRoute = () => {

  const p2pGameRoom = useBfgGameRoomForContextRole();
  if (!p2pGameRoom) {
    return <div>Loading game room...</div>;
  }
  
  const { accessRole } = p2pGameRoom;
  if (accessRole !== 'host') {
    return <div>You are not the host of this game table</div>;
  }

  return (
    <HostAdminViewPage
      {...p2pGameRoom}
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
