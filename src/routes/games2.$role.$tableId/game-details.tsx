import { z } from 'zod';
import { createFileRoute } from '@tanstack/react-router'
import { BfgGameBar, GameTabId } from './-components'
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids';
import { useP2pGameContext } from '@bfg-engine/hooks/p2p/game/p2p-game-context';
import { GameTableAccessRoleSchema } from '@bfg-engine/models/game-roles';
import { HostedGameDetailsComponent } from '@bfg-engine/ui/components/host-game-details-component';
import { PlayerGameDetailsComponent } from '@bfg-engine/ui/components/player-game-details-component';
import { ObserverP2pGameDetailsComponent } from '@bfg-engine';


const paramsSchema = z.object({
  role: GameTableAccessRoleSchema,
  tableId: BfgGameTableId.idSchema,
})

const GameDetailsRoute = () => {
  const { role, tableId } = Route.useParams()
  
  const p2pGame = useP2pGameContext();
  const { gameTable, gameActions, myGameTableAccess, hasRequestedTableAccess } = p2pGame;

  const activeTabId: GameTabId = '/games2/$role/$tableId/game-details';

  if (!gameTable) {
    return <div>Game table not found: {tableId}</div>;
  }

  if (!hasRequestedTableAccess) {
    return <div>You are not allowed to access this game table as a {role}</div>;
  }

  if (myGameTableAccess === 'host') {
    // return <div>You are the host of this game table</div>;
    return (
      <>
        <BfgGameBar
          myGameTableAccess={myGameTableAccess}
          activeTabId={activeTabId}
        />
        <HostedGameDetailsComponent
          gameTable={gameTable}
          gameActions={gameActions}
          // myPlayerProfile={myPlayerProfile}
          // myGameTableAccess={myGameTableAccess}
          // activeTabId="/games2/$role/$tableId/"
          // hostedP2pGame={hostedP2pGame}
          // activeTabId="/games2/$role/$tableId/"
          // activeTabId="/games2/$role/$tableId/"
        />
      </>
    )  
  }

  if (myGameTableAccess === 'player') {
    // return <div>You are a player of this game table</div>;
    return (
      <>
        <BfgGameBar
          myGameTableAccess={myGameTableAccess}
          activeTabId={activeTabId}
        />
        <PlayerGameDetailsComponent
          // gameTable={gameTable}
          // gameActions={gameActions}
          // myPlayerProfile={myPlayerProfile}
          // activeTabId="/games2/$role/$tableId/"
          // hostedP2pGame={hostedP2pGame}
          // activeTabId="/games2/$role/$tableId/"
          // activeTabId="/games2/$role/$tableId/"
        />
      </>
    )
  }

  // if (myGameTableAccess === 'observer') {
    return (
      <>
        <BfgGameBar
          myGameTableAccess={myGameTableAccess}
          activeTabId={activeTabId}
        />
        <ObserverP2pGameDetailsComponent
          gameTableId={tableId}
        />
      </>
    )
  // }

  // return (
  //   <>
  //     <BfgGameBar myGameTableAccess={myGameTableAccess} activeTabId={activeTabId} />
  //     <GameDetailsComponent
  //       gameTable={gameTable}
  //       gameActions={gameActions}
  //     />
  //   </>
  // )
}


export const Route = createFileRoute('/games2/$role/$tableId/game-details')({
  component: GameDetailsRoute,
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ role: params.role, tableId: params.tableId }),
  },
})
