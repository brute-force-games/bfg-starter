import { z } from 'zod'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { BfgGameInstanceIdToolbox } from '@bfg-engine/models/types/bfg-branded-uuids'
import { P2pRawRoomContextProvider } from '../../../modules/bfg-engine/src/hooks/p2p/game/p2p-raw-room-context'
import { UnknownSourceGameRoomProvider } from '../../../modules/bfg-engine/src/hooks/unknown-source-game-room-provider'
import { HostedGameRoomContextProvider } from '../../../modules/bfg-engine/src/hooks/p2p/game/hosted-game-room-context'


const paramsSchema = z.object({
  gameId: BfgGameInstanceIdToolbox.idSchema,
})


const WatchGameParentRoute = () => {
  const { gameId } = Route.useParams()
  
  // For watch routes, we don't require the game instance mapping
  // Observers can connect via P2P even if they don't have the hosted game locally
  
  return (
    <HostedGameRoomContextProvider
      gameInstanceId={gameId}
      requestedRole="observer"
      hostMode="host+p2p"
    >
      <P2pRawRoomContextProvider
        gameInstanceId={gameId}
        requestedAction="watch"
      >
        <UnknownSourceGameRoomProvider
          gameInstanceId={gameId}
          requestedAction="watch"
        >
          <Outlet />
        </UnknownSourceGameRoomProvider>
      </P2pRawRoomContextProvider>
    </HostedGameRoomContextProvider>
  );
}


export const Route = createFileRoute('/games/watch/$gameId')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ gameId: params.gameId }),
  },
  component: WatchGameParentRoute,
})

