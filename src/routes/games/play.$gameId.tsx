import { z } from 'zod'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { BfgGameInstanceIdToolbox } from '@bfg-engine/models/types/bfg-branded-uuids'
import { useLatestHostedGameIdentifiers } from '../../../modules/bfg-engine/src/tb-store/game-instance-store'
import { P2pRawRoomContextProvider } from '../../../modules/bfg-engine/src/hooks/p2p/game/p2p-raw-room-context'


const paramsSchema = z.object({
  gameId: BfgGameInstanceIdToolbox.idSchema,
})


const PlayGameParentRoute = () => {
  const { gameId } = Route.useParams();

  const gameInstanceMapping = useLatestHostedGameIdentifiers(gameId);
  if (!gameInstanceMapping) {
    return <div>Not hosting this game: {gameId}</div>;
  }

  // const { gameTableId, gameRoomId } = gameInstanceMapping;
  
  return (
    <P2pRawRoomContextProvider
      gameInstanceId={gameId}
      // gameTableId={gameTableId}
      // gameRoomId={gameRoomId}
      requestedAction="play"
    >
      <Outlet />
    </P2pRawRoomContextProvider>
  );
}


export const Route = createFileRoute('/games/play/$gameId')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ gameId: params.gameId }),
  },
  component: PlayGameParentRoute,
})
