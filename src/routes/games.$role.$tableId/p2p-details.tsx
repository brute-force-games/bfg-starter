import { z } from 'zod';
import { Container, P2pConnectionComponent, Stack, Typography } from '@bfg-engine';
import { createFileRoute } from '@tanstack/react-router'
import { BfgGameTableId } from '@bfg-engine/models/types/bfg-branded-ids';
import { GameTabId, getGameTabItems } from './-components';
// import { useP2pGameContext } from '@bfg-engine/hooks/p2p/game/p2p-game-context';
import { BfgStarterNavBar } from '@bfg-engine/ui/components/bfg-nav-bar/bfg-starter-nav-bar';
// import { useP2pGameAsPlayer } from '@bfg-engine/hooks/p2p/game/use-p2p-game';
import { GameTableAccessRoleSchema } from '@bfg-engine/models/game-roles';


const paramsSchema = z.object({
  tableId: BfgGameTableId.idSchema,
  role: GameTableAccessRoleSchema,
})

const GameP2pDetailsRoute = () => {

  const activeTabId: GameTabId = '/games/$role/$tableId/p2p-details';

  const { role } = Route.useParams();

  // const p2pGame = useP2pGameContext();
  const p2pGame = useP2pGameAsPlayer();
  if (!p2pGame) {
    return (
      <Container style={{ padding: '24px' }}>
        <Stack spacing={3}>
          <Typography variant="h3">Loading Game...</Typography>
          <Typography variant="body1" color="secondary">
            Loading P2P Game...
          </Typography>
        </Stack>
      </Container>
    )
  }

  const { connectionStatus, connectionEvents, peers, peerPlayerIds, allPlayerProfiles, myPlayerProfile } = p2pGame.p2p;
  // const { connectionStatus, connectionEvents, peers, peerPlayers, refreshConnection, allPlayerProfiles, myGameTableAccess } = p2pGame;

  const refreshConnection = () => {
    console.error('refreshConnection not implemented');
  }

  const gameTabItems = getGameTabItems(role);
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
        peerPlayerIds={peerPlayerIds}
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
