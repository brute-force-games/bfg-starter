import { z } from 'zod';
import { createFileRoute } from '@tanstack/react-router'
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids';


const paramsSchema = z.object({
  tableId: BfgGameTableId.idSchema,
})


const HostedGamePlayerRoute = () => {

  return <div>Hosted Game Player Route</div>;

  // const hostedGame = useP2pHostedGameContext();
  // const {
  //   gameTable,
  //   allPlayerProfiles,
  //   peers,
  //   peerPlayers,
  //   gameActions,
  //   myPlayerSeat,
  //   onSelfPlayerActionStr,
  //   myHostPlayerProfile,
  // } = hostedGame;

  // const activeTabId: HostedGameTabId = '/hosted-games/$tableId/player';

  // return (
  //   <>
  //     <BfgHostedGameBar
  //       activeTabId={activeTabId}
  //     />
  //     <PlayerGameView
  //       allPlayerProfiles={allPlayerProfiles}
  //       myPlayerProfile={myHostPlayerProfile}
  //       myPlayerSeat={myPlayerSeat}
  //       gameTable={gameTable}
  //       peers={peers}
  //       peerPlayers={peerPlayers}
  //       gameActions={gameActions}
  //       onPlayerGameAction={onSelfPlayerActionStr}
  //     />
  //   </>
  // )
}


export const Route = createFileRoute('/hosted-games/$tableId/player')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ tableId: params.tableId }),
  },
  component: HostedGamePlayerRoute,
})
