import { z } from 'zod';
import { createFileRoute } from '@tanstack/react-router'
// import { useP2pHostedGameContext } from '@bfg-engine/hooks/p2p/game/hosted-p2p-game-context';
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids';


const paramsSchema = z.object({
  tableId: BfgGameTableId.idSchema,
})

const HostedGameDetailsRoute = () => {
  return <div>Hosted Game Details Route</div>;

  // const hostedGame = useP2pHostedGameContext();
  // const { gameTable, gameActions } = hostedGame;

  // const activeTabId: HostedGameTabId = '/hosted-games/$tableId/game-details';

  // return (
  //   <>
  //     <BfgHostedGameBar activeTabId={activeTabId} />
  //     <HostedGameDetailsComponent
  //       gameTable={gameTable}
  //       gameActions={gameActions}
  //     />
  //   </>
  // )
}


export const Route = createFileRoute('/hosted-games/$tableId/game-details')({
  component: HostedGameDetailsRoute,
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ tableId: params.tableId }),
  },
})
