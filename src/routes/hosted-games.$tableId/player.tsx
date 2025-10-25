import { z } from 'zod';
import { createFileRoute } from '@tanstack/react-router'
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids';
import { BfgHostedGameBar, HostedGameTabId } from './-components';
import { useP2pHostedGameContext } from '@bfg-engine/hooks/p2p/hosted-p2p-game-context';
import { PlayerGameView } from '@bfg-engine/ui/components/player-game-view';


const paramsSchema = z.object({
  tableId: BfgGameTableId.idSchema,
})


const HostedGamePlayerRoute = () => {

  const hostedGame = useP2pHostedGameContext();
  const {
    gameTable,
    gameActions,
    myPlayerSeat,
    onSelfPlayerActionStr,
    myHostPlayerProfile,
  } = hostedGame;

  const activeTabId: HostedGameTabId = '/hosted-games/$tableId/player';

  return (
    <>
      <BfgHostedGameBar activeTabId={activeTabId} />
      <PlayerGameView
        myPlayerProfile={myHostPlayerProfile}
        myPlayerSeat={myPlayerSeat}
        gameTable={gameTable}
        gameActions={gameActions}
        onPlayerGameAction={onSelfPlayerActionStr}
      />
    </>
  )
}


export const Route = createFileRoute('/hosted-games/$tableId/player')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ tableId: params.tableId }),
  },
  component: HostedGamePlayerRoute,
})
