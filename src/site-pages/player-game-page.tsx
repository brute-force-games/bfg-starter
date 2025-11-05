import { PlayerP2pGameComponent, useRiskyMyDefaultPlayerProfile, Container, Typography, Stack } from "@bfg-engine";
// import { useP2pGameContext } from "@bfg-engine/hooks/p2p/game/p2p-game-context";
// import { useP2pGameAsPlayer } from "@bfg-engine/hooks/p2p/game/use-p2p-game";
import { GameTableId } from "@bfg-engine/models/types/bfg-branded-ids";
import { BfgGameScreenFrame } from "@bfg-engine/ui/components/bfg-game-screen-frame";
import { GameTabId, getGameTabItems } from "~/routes/games.$role.$tableId/-components";
import { useGameRegistry } from "@bfg-engine/hooks/games-registry/games-registry";
import { useBfgGameRoomForRole, useP2pGameRoomAsPlayer } from "@bfg-engine/hooks/p2p/game/use-bfg-game-room";
import { IPlayerBfgGameDetails } from "@bfg-engine/hooks/p2p/game/p2p-game-types";


// interface IPlayerGamePageProps {
//   tableId: GameTableId;
// }

// export const PlayerGamePage = ({ tableId }: IPlayerGamePageProps) => {

export const PlayerGamePage = () => {

  const p2pGameRoom = useP2pGameRoomAsPlayer();

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

  const playerGameDetails = p2pGameRoom.playerGameDetails;

  const { gameTable, gameActions, gameMetadata, allPlayerProfiles, myPlayerProfile } = playerGameDetails;


  // if (!p2pGame) {
  //   return (
  //     <Container style={{ padding: '24px' }}>
  //       <Stack spacing={3}>
  //         <Typography variant="h3">Loading Game...</Typography>
  //         <Typography variant="body1" color="secondary">
  //           Loading P2P Game...
  //         </Typography>
  //       </Stack>
  //     </Container>
  //   )
  // }

  // const { gameTable, gameActions, gameMetadata, allPlayerProfiles, myPlayerProfile } = p2pGame.p2pDetails;

  // const p2p = p2pGame.p2p;
  // if (!p2p) {
  //   return (
  //     <Container style={{ padding: '24px' }}></Container>
  // if (!gameTable) {
  //   return (
  //     <Container style={{ padding: '24px' }}>
  //       <Stack spacing={3}>
  //         <Typography variant="h3">Loading Game...</Typography>
  //         <Typography variant="body1" color="secondary">
  //           Loading game table...
  //         </Typography>
  //       </Stack>
  //     </Container>
  //   )
  // }

  // if (!gameActions) {
  //   return (
  //     <Container style={{ padding: '24px' }}>
  //       <Stack spacing={3}>
  //         <Typography variant="h3">Loading Game...</Typography>
  //         <Typography variant="body1" color="secondary">
  //           Loading game actions...
  //         </Typography>
  //       </Stack>
  //     </Container>
  //   )
  // }

  // const gameMetadata = gameRegistry.getGameMetadata(gameTable.gameTitle);
  const latestGameSpecificStateStr = gameActions.length > 0 ? 
    gameActions[gameActions.length - 1].nextGameStateStr :
    null;
  const latestGameSpecificState = latestGameSpecificStateStr ?
    gameMetadata.encoders.publicGameStateEncoder.decode(latestGameSpecificStateStr) :
    null;

  const activeTabId: GameTabId = '/games/$role/$tableId';

  const gameTabItems = getGameTabItems('play');
  const tabsConfig = {
    tabItems: gameTabItems,
    activeTabId: activeTabId,
    onTabChange: () => { console.log('onTabChange not implemented'); }
  };

  return (
    <BfgGameScreenFrame
      tabsConfig={tabsConfig}
      gameMetadata={gameMetadata}
      gameTable={gameTable}
      allPlayerProfiles={allPlayerProfiles}
      gameState={latestGameSpecificState}
      gameActions={gameActions}
    >
      <PlayerP2pGameComponent
        // gameTableId={tableId}
        // myPlayerProfile={myPlayerProfile}
        {...playerGameDetails}
      />
    </BfgGameScreenFrame>
  )
}
