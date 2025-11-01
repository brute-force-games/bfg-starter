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

const GamesRoleAndTableIdPage = () => {
  const { role, tableId } = Route.useParams() as RouteParams
  const myPlayerProfile = useRiskyMyDefaultPlayerProfile();

  if (role === 'host') {
    return (
      <HostGamePlayerViewPage
        tableId={tableId}
        myPlayerProfile={myPlayerProfile}
      />
    )  
  }

  if (role === 'play') {
    return (
      <PlayerGamePage
        tableId={tableId}
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
}


export const Route = createFileRoute('/games/$role/$tableId/')({
  component: GamesRoleAndTableIdPage,
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ role: params.role, tableId: params.tableId }),
  },
})
