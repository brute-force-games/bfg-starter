import { Container, P2pConnectionComponent, Stack, Typography } from '@bfg-engine';
import { createFileRoute } from '@tanstack/react-router'
import { GameTabId, getGameTabItems } from '../-components';
import { BfgStarterNavBar } from '@bfg-engine/ui/components/bfg-nav-bar/bfg-starter-nav-bar';
import { useP2pGameRoomAsHost } from '@bfg-engine/hooks/p2p/game/use-p2p-game-room-as-host';


// const paramsSchema = z.object({
//   tableId: BfgGameTableId.idSchema,
//   role: GameTableAccessRoleSchema,
// })

const GameP2pDetailsRoute = () => {

  const p2pGameRoom = useP2pGameRoomAsHost();
  if (!p2pGameRoom) {
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

  // const { accessRole, p2pDetails } = bfgGameRoom;
  // const { gameRoom } = p2pGameRoom;
  const { accessRole, p2pDetails } = p2pGameRoom;

  // const refreshConnection = () => {
  //   console.error('refreshConnection not implemented');
  // }

  const activeTabId: GameTabId = '/games/host/$tableId/p2p-details';

  const gameTabItems = getGameTabItems(accessRole);
  const tabsConfig = {
    tabItems: gameTabItems,
    activeTabId: activeTabId,
    onTabClicked: () => { console.log('onTabClicked not implemented'); }
  };

  return (
    <>
      <BfgStarterNavBar
        tabsConfig={tabsConfig}
      />
      <P2pConnectionComponent
        {...p2pDetails}
        // onRefreshConnection={refreshConnection}
      />
    </>
  )
}


export const Route = createFileRoute('/games/host/$tableId/p2p-details')({
  // params: {
  //   parse: (params) => paramsSchema.parse(params),
  //   stringify: (params) => ({ tableId: params.tableId }),
  // },
  component: GameP2pDetailsRoute,
})
