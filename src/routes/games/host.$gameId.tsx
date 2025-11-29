import { z } from 'zod'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { BfgGameInstanceIdToolbox } from '@bfg-engine/models/types/bfg-branded-uuids'
import { useLatestHostedGameIdentifiers } from '../../../modules/bfg-engine/src/tb-store/game-instance-store'
import { HostedGameRoomContextProvider } from '../../../modules/bfg-engine/src/hooks/p2p/game/hosted-game-room-context'
import { P2pRawRoomContextProvider } from '../../../modules/bfg-engine/src/hooks/p2p/game/p2p-raw-room-context'


const paramsSchema = z.object({
  gameId: BfgGameInstanceIdToolbox.idSchema,
})

const searchSchema = z.object({
  disableP2p: z.boolean().default(false).optional(),
}).optional()


const HostGameParentRoute = () => {
  const { gameId } = Route.useParams()
  const { disableP2p } = Route.useSearch()
  
  const gameInstanceMapping = useLatestHostedGameIdentifiers(gameId);
  if (!gameInstanceMapping) {
    return <div>Not hosting this game: {gameId}</div>;
  }

  const hostMode = disableP2p ? 'host-only' : 'host+p2p';

  return (
      <HostedGameRoomContextProvider
        gameInstanceId={gameId}
        requestedRole="host"
        hostMode={hostMode}
      >
        <P2pRawRoomContextProvider
          gameInstanceId={gameId}
          requestedAction="host"
        >
          <Outlet />
        </P2pRawRoomContextProvider>
      </HostedGameRoomContextProvider>
  );
}


export const Route = createFileRoute('/games/host/$gameId')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ gameId: params.gameId }),
  },
  validateSearch: searchSchema,
  component: HostGameParentRoute,
})

