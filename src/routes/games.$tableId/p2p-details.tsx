import { z } from 'zod';
import { useRiskyMyDefaultPlayerProfile } from '@bfg-engine';
import { createFileRoute } from '@tanstack/react-router'
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids';
import { P2pDetailsObserverPage } from '~/site-pages/p2p-details-observer-game-page';
import { P2pDetailsPlayerPage } from '~/site-pages/p2p-details-player-game-page';


const paramsSchema = z.object({
  tableId: BfgGameTableId.idSchema,
})

const GameP2pDetailsRoute = () => {

  const { tableId } = Route.useParams();

  const myPlayerProfile = useRiskyMyDefaultPlayerProfile();

  if (!myPlayerProfile) {
    return (
      <P2pDetailsObserverPage
        tableId={tableId}
      />
    )
  }

  return (
    <P2pDetailsPlayerPage
      tableId={tableId}
      myPlayerProfile={myPlayerProfile}
    />
  )
}


export const Route = createFileRoute('/games/$tableId/p2p-details')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ tableId: params.tableId }),
  },
  component: GameP2pDetailsRoute,
})
