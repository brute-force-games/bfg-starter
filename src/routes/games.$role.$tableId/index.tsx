import { createFileRoute } from '@tanstack/react-router'
import { PlayerGamePage } from '~/site-pages/player-game-page'
import { ObserverGamePage } from '~/site-pages/observer-game-page'
import { HostGamePlayerViewPage } from '~/site-pages/host-player-view-page'
import { useBfgGameRoomForContextRole } from '@bfg-engine/hooks/p2p/game/use-bfg-game-room'


const GamesRoleAndTableIdPage = () => {

  const p2pGameRoom = useBfgGameRoomForContextRole();
  if (!p2pGameRoom) {
    return <div>Loading game room...</div>;
  }
  
  const { accessRole } = p2pGameRoom;

  if (accessRole === 'host') {
    return (
      <HostGamePlayerViewPage
        p2pGameRoom={p2pGameRoom}
      />
    )  
  }

  if (accessRole === 'play') {
    return (
      <PlayerGamePage
        p2pGameRoom={p2pGameRoom}
      />
    )
  }

  if (accessRole === 'watch') {
    return (
      <ObserverGamePage 
        p2pGameRoom={p2pGameRoom}
      />
    )
  }

  return <div>You can not access this game table as a {accessRole}</div>;
}


export const Route = createFileRoute('/games/$role/$tableId/')({
  component: GamesRoleAndTableIdPage,
  // params: {
  //   parse: (params) => paramsSchema.parse(params),
  //   stringify: (params) => ({ role: params.role, tableId: params.tableId }),
  // },
})
