import { z } from 'zod';
import { GameTableAccessRoleSchema } from '@bfg-engine/models/game-roles';
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids';
import { createFileRoute } from '@tanstack/react-router';
import { useRiskyMyDefaultPlayerProfile } from '@bfg-engine';
import { HostAdminViewPage } from '~/site-pages/host-admin-view-page';


const paramsSchema = z.object({
  role: GameTableAccessRoleSchema,
  tableId: BfgGameTableId.idSchema,
})

type RouteParams = z.infer<typeof paramsSchema>


const HostGameAdminRoute = () => {
  const { role, tableId } = Route.useParams() as RouteParams
  const myPlayerProfile = useRiskyMyDefaultPlayerProfile();

  if (role === 'host') {
    // return <div>You are the host of this game table</div>;
    return (
      <HostAdminViewPage
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

  return <div>You are not the host of this game table</div>;
}

export const Route = createFileRoute('/games2/$role/$tableId/admin')({
  component: HostGameAdminRoute,
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ role: params.role, tableId: params.tableId }),
  },
})

