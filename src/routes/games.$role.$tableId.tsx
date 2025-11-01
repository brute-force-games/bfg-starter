import { createFileRoute, Outlet } from '@tanstack/react-router'
import { z } from 'zod'
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids'
import { P2pGameContextProvider } from '@bfg-engine/hooks/p2p/game/p2p-game-context'
import { useRiskyMyDefaultPlayerProfile } from '@bfg-engine'
import { ProfileGuard } from '@bfg-engine/ui/components/profile-guard'
import { GameTableAccessRoleSchema } from '@bfg-engine/models/game-roles'


const paramsSchema = z.object({
  role: GameTableAccessRoleSchema,
  tableId: BfgGameTableId.idSchema,
})


const GamesParentRoute = () => {
  const { role, tableId } = Route.useParams()
  const myPlayerProfile = useRiskyMyDefaultPlayerProfile()

  return (
    <ProfileGuard>
      <P2pGameContextProvider
        gameTableId={tableId}
        myPlayerProfile={myPlayerProfile}
        requestedRole={role}
      >
        <Outlet />
      </P2pGameContextProvider>
    </ProfileGuard>
  )
}


export const Route = createFileRoute('/games/$role/$tableId')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ role: params.role, tableId: params.tableId }),
  },
  component: GamesParentRoute,
})



