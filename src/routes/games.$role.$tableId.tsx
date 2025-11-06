import { createFileRoute, Outlet } from '@tanstack/react-router'
import { z } from 'zod'
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids'
import { GameTableAccessRoleSchema } from '@bfg-engine/models/game-roles'
import { P2pGameRoomContextProvider } from '@bfg-engine/hooks/p2p/game/p2p-game-room-context'


const paramsSchema = z.object({
  role: GameTableAccessRoleSchema,
  tableId: BfgGameTableId.idSchema,
})


const GamesParentRoute = () => {
  const { role, tableId } = Route.useParams()
  
  return (
    <P2pGameRoomContextProvider
      gameTableId={tableId}
      requestedRole={role}
    >
      <Outlet />
    </P2pGameRoomContextProvider>
  );
}


export const Route = createFileRoute('/games/$role/$tableId')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ role: params.role, tableId: params.tableId }),
  },
  component: GamesParentRoute,
})
