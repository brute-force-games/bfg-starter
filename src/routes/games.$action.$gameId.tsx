import { createFileRoute, Outlet } from '@tanstack/react-router'
import { z } from 'zod'
import { BfgGameInstanceIdToolbox } from '@bfg-engine/models/types/bfg-branded-uuids'
import { useLatestHostedGameIdentifiers } from '../../modules/bfg-engine/src/tb-store/game-instance-store'
import { P2pRawRoomContextProvider } from '../../modules/bfg-engine/src/hooks/p2p/game/p2p-raw-room-context'
import { GameTableAccessActionSchema, type GameTableAccessAction } from '../../modules/bfg-engine/src/models/internal/user-game-perspective'
import { UnknownSourceGameRoomProvider } from '../../modules/bfg-engine/src/hooks/unknown-source-game-room-provider'
import { HostedGameRoomContextProvider } from '../../modules/bfg-engine/src/hooks/p2p/game/hosted-game-room-context'


const paramsSchema = z.object({
  action: GameTableAccessActionSchema,
  gameId: BfgGameInstanceIdToolbox.idSchema,
})


const GamesParentRoute = () => {
  const { action, gameId } = Route.useParams();

  const gameInstanceMapping = useLatestHostedGameIdentifiers(gameId);
  if (!gameInstanceMapping) {
    return <div>Not hosting this game: {gameId}</div>;
  }
  
  return (
    <HostedGameRoomContextProvider
      gameInstanceId={gameId}
      requestedRole={action}
      hostMode="host+p2p"
    >
      <P2pRawRoomContextProvider
          gameInstanceId={gameId}
          requestedAction={action}
        >
        <UnknownSourceGameRoomProvider
          gameInstanceId={gameId}
          requestedAction={action}
        >
          <Outlet />
        </UnknownSourceGameRoomProvider>
      </P2pRawRoomContextProvider>
    </HostedGameRoomContextProvider>
    // <P2pRawRoomContextProvider
    //   gameInstanceId={gameId}
    //   requestedAction={action}
    // >
    //   <Outlet />
    // </P2pRawRoomContextProvider>
  );
}


export const Route = createFileRoute('/games/$action/$gameId')({
  params: {
    parse: (params) => paramsSchema.parse({ action: params.action as GameTableAccessAction, gameId: params.gameId }),
    stringify: (params) => ({ action: params.action, gameId: params.gameId }),
  },
  component: GamesParentRoute,
})
