import { z } from 'zod';
import { createFileRoute } from '@tanstack/react-router'
import { BfgHostedGameBar, HostedGameTabId } from './-components'
import { useP2pHostedGameContext } from '@bfg-engine/hooks/p2p/game/hosted-p2p-game-context';
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids';
import { HostedGameDetailsComponent } from '@bfg-engine/ui/components/host-game-details-component';


const paramsSchema = z.object({
  tableId: BfgGameTableId.idSchema,
})

const HostedGameDetailsRoute = () => {
  const hostedGame = useP2pHostedGameContext();
  const { gameTable, gameActions } = hostedGame;

  const activeTabId: HostedGameTabId = '/hosted-games/$tableId/game-details';

  return (
    <>
      <BfgHostedGameBar activeTabId={activeTabId} />
      <HostedGameDetailsComponent
        hostedGame={gameTable}
        gameActions={gameActions}
      />
    </>
  )
}


export const Route = createFileRoute('/hosted-games/$tableId/game-details')({
  component: HostedGameDetailsRoute,
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ tableId: params.tableId }),
  },
})
