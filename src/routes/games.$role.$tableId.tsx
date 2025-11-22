import { createFileRoute, Outlet } from '@tanstack/react-router'
import { z } from 'zod'
import { BfgGameInstanceIdToolbox } from '@bfg-engine/models/types/bfg-branded-uuids'
import { GameTableAccessRoleSchema } from '@bfg-engine/models/game-roles'
import { P2pGameRoomContextProvider } from '@bfg-engine/hooks/p2p/game/p2p-game-room-context'
import { useLatestHostedGameIdentifiers } from '../../modules/bfg-engine/src/tb-store/game-instance-store'


const paramsSchema = z.object({
  role: GameTableAccessRoleSchema,
  tableId: BfgGameInstanceIdToolbox.idSchema,
})


const GamesParentRoute = () => {
  const { role, tableId } = Route.useParams();

  const { gameInstanceId, gameTableId, gameRoomId } = useLatestHostedGameIdentifiers(tableId);
  
  return (
    <P2pGameRoomContextProvider
      gameInstanceId={gameInstanceId}
      gameTableId={gameTableId}
      gameRoomId={gameRoomId}
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
