import { createFileRoute } from '@tanstack/react-router'
import { PlayerGamePage } from '~/site-pages/player-game-page'
import { ObserverGamePage } from '~/site-pages/observer-game-page'
import { useRiskyMyDefaultPlayerProfile } from '@bfg-engine'
import { HostGamePlayerViewPage } from '~/site-pages/host-player-view-page'
import { z } from 'zod'
import { GameTableAccessRoleSchema } from '@bfg-engine/models/game-roles'
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids'

const paramsSchema = z.object({
  role: GameTableAccessRoleSchema,
  tableId: BfgGameTableId.idSchema,
})

type RouteParams = z.infer<typeof paramsSchema>

const Games2RoleAndTableIdPage = () => {
  const { role, tableId } = Route.useParams() as RouteParams
  const myPlayerProfile = useRiskyMyDefaultPlayerProfile();

  // const hostedP2pGame = useHostedP2pGameWithStore(tableId, myPlayerProfile);
  // const { gameTable, peers } = hostedP2pGame;

  // const p2pGame = useP2pGameContext();
  // const { myGameTableAccess, myPlayerProfile, hasRequestedTableAccess } = p2pGame;

  // console.log('Games2RoleAndTableIdPage - p2pGame', p2pGame)

  // if (!p2pGame.gameTable) {
  //   return <div>Game table not found: {tableId}</div>;
  // }

  // if (!hasRequestedTableAccess) {
  //   return <div>You are not allowed to access this game table as a {role}</div>;
  // }

  if (role === 'host') {
    // return <div>You are the host of this game table</div>;
    return (
      <HostGamePlayerViewPage
        tableId={tableId}
        myPlayerProfile={myPlayerProfile}
        // myGameTableAccess={myGameTableAccess}
        // activeTabId="/games2/$role/$tableId/"
        // hostedP2pGame={hostedP2pGame}
        // activeTabId="/games2/$role/$tableId/"
        // activeTabId="/games2/$role/$tableId/"
      />
    )  
  }

  if (role === 'play') {
    // return <div>You are a player of this game table</div>;
    return (
      <PlayerGamePage
        tableId={tableId}
        // myPlayerProfile={myPlayerProfile}
        // activeTabId="/games2/$role/$tableId/"
        // hostedP2pGame={hostedP2pGame}
        // activeTabId="/games2/$role/$tableId/"
        // activeTabId="/games2/$role/$tableId/"
      />
    )
  }

  if (role === 'watch') {
    return (
      <ObserverGamePage
        tableId={tableId}
      />
    )
  }

  return <div>You can not access this game table as a {role}</div>;

  // const hostedP2pGame = useHostedP2pGameWithStore(tableId, myPlayerProfile);
  

  
  // return (
  //   // <ProfileGuard>
  //   // </ProfileGuard>
  //   <>
  //     <div>Games2RoleAndTableIdPage: {tableId}</div>
  //     <div>Game Table: {gameTable?.id}</div>
  //     <div>My Player Profile: {myPlayerProfile?.id}</div>
  //     {/* <div>My Player Seat: {myPlayerSeat?.id}</div> */}
  //     {/* <div>Game Actions: {gameActions?.id}</div> */}
  //     <div>Peers: {peers?.length}</div>
  //     {/* <div>Peer Players: {peerPlayers?.length}</div>
  //     <div>All Player Profiles: {allPlayerProfiles?.length}</div> */}
  //   </>
  // )
}


export const Route = createFileRoute('/games2/$role/$tableId/')({
  component: Games2RoleAndTableIdPage,
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ role: params.role, tableId: params.tableId }),
  },
})
