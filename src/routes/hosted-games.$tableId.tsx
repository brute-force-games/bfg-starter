import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids'
import { ProfileGuard } from '@bfg-engine/ui/components/profile-guard'
import { Outlet } from '@tanstack/react-router'
// import { P2pHostedGameContextProvider } from '@bfg-engine/hooks/p2p/game/hosted-p2p-game-context'
import { useMyDefaultPlayerProfile } from '@bfg-engine/hooks/stores/use-my-player-profiles-store'
import { Typography } from '@bfg-engine'


const paramsSchema = z.object({
  tableId: BfgGameTableId.idSchema,
})

// Search params schema using Standard Schema
const searchSchema = z.object({
  // debug: z.boolean().optional(),
  // autoStart: z.boolean().optional(),
}).optional()


const HostedGameRoute = () => {
  // const { tableId } = Route.useParams()
  const { tableId } = Route.useParams();

  const myHostPlayerProfile = useMyDefaultPlayerProfile();
  if (!myHostPlayerProfile) {
    return <Typography variant="body1">Loading player profile...</Typography>
  }

  return (
    <ProfileGuard>
      {/* <P2pHostedGameContextProvider
        gameTableId={tableId}
        hostPlayerProfile={myHostPlayerProfile}
      > */}
        <Outlet />
      {/* </P2pHostedGameContextProvider> */}
      {/* <HostedGamePage
        tableId={tableId}
      /> */}
    </ProfileGuard>
  )
}

export const Route = createFileRoute('/hosted-games/$tableId')({
  params: {
    parse: (params) => ({
      ...params,
      ...paramsSchema.parse(params),
    }),
    stringify: (params) => ({ tableId: params.tableId }),
  },
  validateSearch: searchSchema, // Standard Schema validation
  component: HostedGameRoute,
})

