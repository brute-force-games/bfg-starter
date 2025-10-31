import { z } from 'zod';
import { createFileRoute } from '@tanstack/react-router'
import { BfgPlayerGameBar, PlayerGameTabId } from './-components'
// import { useP2pHostedGameContext } from '@bfg-engine/hooks/p2p/game/hosted-p2p-game-context';
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids';
import { HostedGameDetailsComponent } from '@bfg-engine/ui/components/host-game-details-component';


const paramsSchema = z.object({
  tableId: BfgGameTableId.idSchema,
})

const HostedGameDetailsRoute = () => {
  return <div>Hosted Game Details Route</div>;
  
  // const hostedGame = useP2pHostedGameContext();
  // const { gameTable, gameActions } = hostedGame;

  // const activeTabId: PlayerGameTabId = '/games/$tableId/game-details';

  // return (
  //   <>
  //     <BfgPlayerGameBar activeTabId={activeTabId} />
  //     <HostedGameDetailsComponent
  //       gameTable={gameTable}
  //       gameActions={gameActions}
  //     />
  //   </>
  // )
}


export const Route = createFileRoute('/games/$tableId/game-details')({
  component: HostedGameDetailsRoute,
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ tableId: params.tableId }),
  },
})
