import { z } from 'zod';
import { P2pConnectionComponent } from '@bfg-engine';
import { createFileRoute } from '@tanstack/react-router'
import { BfgHostedGameBar, HostedGameTabId } from './-components';
import { useP2pHostedGameContext } from '@bfg-engine/hooks/p2p/game/hosted-p2p-game-context';
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids';


const paramsSchema = z.object({
  tableId: BfgGameTableId.idSchema,
})

const HostedGameP2pDetailsRoute = () => {

  const activeTabId: HostedGameTabId = '/hosted-games/$tableId/p2p-details';

  const hostedGame = useP2pHostedGameContext();
  const { connectionStatus, connectionEvents, peers, peerPlayers, refreshConnection, allPlayerProfiles } = hostedGame;

  return (
    <>
      <BfgHostedGameBar 
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


export const Route = createFileRoute('/hosted-games/$tableId/p2p-details')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ tableId: params.tableId }),
  },
  component: HostedGameP2pDetailsRoute,
})
