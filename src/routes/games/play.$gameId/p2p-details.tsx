import { Container, P2pConnectionComponent, Stack, Typography } from '@bfg-engine';
import { createFileRoute } from '@tanstack/react-router'
import { GameTabId, getGameTabItems } from '../-components';
import { BfgStarterNavBar } from '@bfg-engine/ui/components/bfg-nav-bar/bfg-starter-nav-bar';
import { useGameRoomAsPlayer } from '@bfg-engine/hooks/p2p/game/use-game-room-as-player';


// const paramsSchema = z.object({
//   tableId: BfgGameTableId.idSchema,
//   role: GameTableAccessLevelSchema,
// })

const GameP2pDetailsRoute = () => {

  const p2pGameRoom = useGameRoomAsPlayer();
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
  const { accessLevel, p2pDetails } = p2pGameRoom;

  // const refreshConnection = () => {
  //   console.error('refreshConnection not implemented');
  // }

  const activeTabId: GameTabId = '/games/play/$gameId/p2p-details';

  const gameTabItems = getGameTabItems(accessLevel);
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


export const Route = createFileRoute('/games/play/$gameId/p2p-details')({
  // params: {
  //   parse: (params) => paramsSchema.parse(params),
  //   stringify: (params) => ({ tableId: params.tableId }),
  // },
  component: GameP2pDetailsRoute,
})
