import { z } from 'zod'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { BfgGameInstanceIdToolbox } from '@bfg-engine/models/types/bfg-branded-uuids'
import { P2pGameRoomContextProvider } from '@bfg-engine/hooks/p2p/game/p2p-game-room-context'
import { useLatestHostedGameIdentifiers } from '../../../modules/bfg-engine/src/tb-store/game-instance-store'


const paramsSchema = z.object({
  tableId: BfgGameInstanceIdToolbox.idSchema,
})


const HostGameParentRoute = () => {
  const { tableId } = Route.useParams()
  
  // const { gameTableId, gameRoomId } = useGameAndRoomIdsFromGameInstanceId(tableId);
  const gameInstanceMapping = useLatestHostedGameIdentifiers(tableId);
  const { gameInstanceId, gameTableId, gameRoomId } = gameInstanceMapping;

  return (
    <P2pGameRoomContextProvider
      gameRoomId={gameRoomId}
      gameTableId={gameTableId}
      gameInstanceId={gameInstanceId}
      requestedRole="host"
    >
      <Outlet />
    </P2pGameRoomContextProvider>
  );
}


export const Route = createFileRoute('/games/host/$tableId')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ tableId: params.tableId }),
  },
  component: HostGameParentRoute,
})

