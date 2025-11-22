import { z } from 'zod'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { BfgGameTableIdToolbox } from '@bfg-engine/models/types/bfg-branded-uuids'
import { P2pGameRoomContextProvider } from '@bfg-engine/hooks/p2p/game/p2p-game-room-context'
import { useLatestHostedGameIdentifiers } from '@bfg-engine/tb-store/game-instance-store'


const paramsSchema = z.object({
  tableId: BfgGameTableIdToolbox.idSchema,
})


const WatchGameParentRoute = () => {
  const { tableId } = Route.useParams()
  
  const { gameInstanceId, gameTableId, gameRoomId } = useLatestHostedGameIdentifiers(tableId);
  
  return (
    <P2pGameRoomContextProvider
      gameInstanceId={gameInstanceId}
      gameTableId={gameTableId}
      gameRoomId={gameRoomId}
      requestedRole="watch"
    >
      <Outlet />
    </P2pGameRoomContextProvider>
  );
}


export const Route = createFileRoute('/games/watch/$tableId')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ tableId: params.tableId }),
  },
  component: WatchGameParentRoute,
})

