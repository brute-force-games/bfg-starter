import { z } from 'zod';
import { P2pConnectionComponent } from '@bfg-engine';
import { createFileRoute } from '@tanstack/react-router'
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids';
import { GameTabId, getGameTabItems } from './-components';
import { useP2pGameContext } from '@bfg-engine/hooks/p2p/game/p2p-game-context';
import { BfgStarterNavBar } from '@bfg-engine/ui/components/bfg-nav-bar/bfg-starter-nav-bar';


const paramsSchema = z.object({
  tableId: BfgGameTableId.idSchema,
})

const GameP2pDetailsRoute = () => {

  const activeTabId: GameTabId = '/games/$role/$tableId/p2p-details';

  const p2pGame = useP2pGameContext();
  const { connectionStatus, connectionEvents, peers, peerPlayers, refreshConnection, allPlayerProfiles, myGameTableAccess } = p2pGame;

  const gameTabItems = getGameTabItems(myGameTableAccess);
  const tabsConfig = {
    tabItems: gameTabItems,
    activeTabId: activeTabId,
    onTabChange: () => { console.log('onTabChange not implemented'); }
  };

  return (
    <>
      <BfgStarterNavBar
        tabsConfig={tabsConfig}
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


export const Route = createFileRoute('/games/$role/$tableId/p2p-details')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ tableId: params.tableId }),
  },
  component: GameP2pDetailsRoute,
})
