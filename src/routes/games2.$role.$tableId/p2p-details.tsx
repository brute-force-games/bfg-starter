import { z } from 'zod';
import { P2pConnectionComponent } from '@bfg-engine';
import { createFileRoute } from '@tanstack/react-router'
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids';
import { BfgGameBar, GameTabId } from './-components';
import { useP2pGameContext } from '@bfg-engine/hooks/p2p/game/p2p-game-context';


const paramsSchema = z.object({
  tableId: BfgGameTableId.idSchema,
})

const GameP2pDetailsRoute = () => {

  const activeTabId: GameTabId = '/games2/$role/$tableId/p2p-details';

  const p2pGame = useP2pGameContext();
  const { connectionStatus, connectionEvents, peers, peerPlayers, refreshConnection, allPlayerProfiles, myGameTableAccess } = p2pGame;

  return (
    <>
      <BfgGameBar 
        myGameTableAccess={myGameTableAccess}
        activeTabId={activeTabId}
      />
      <P2pConnectionComponent
        connectionStatus={connectionStatus}
        connectionEvents={connectionEvents}
        peers={peers}
        peerPlayers={peerPlayers}
        allPlayerProfiles={allPlayerProfiles}
        onRefreshConnection={refreshConnection}
      />
    </>
  )
}


export const Route = createFileRoute('/games2/$role/$tableId/p2p-details')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ tableId: params.tableId }),
  },
  component: GameP2pDetailsRoute,
})
