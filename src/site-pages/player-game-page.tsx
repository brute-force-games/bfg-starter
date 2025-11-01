import { PlayerP2pGameComponent, useRiskyMyDefaultPlayerProfile, Container, Typography, Stack } from "@bfg-engine";
import { GameTableId } from "@bfg-engine/models/types/bfg-branded-ids";
import { BfgGameBar, GameTabId } from "~/routes/games.$role.$tableId/-components";


interface IPlayerGamePageProps {
  tableId: GameTableId;
}

export const PlayerGamePage = ({ tableId }: IPlayerGamePageProps) => {

  const activeTabId: GameTabId = '/games/$role/$tableId';

  const myPlayerProfile = useRiskyMyDefaultPlayerProfile();

  if (!myPlayerProfile) {
    return (
      <Container style={{ padding: '24px' }}>
        <Stack spacing={3}>
          <Typography variant="h3">Loading Game...</Typography>
          <Typography variant="body1" color="secondary">
            Loading game ee details...
          </Typography>
        </Stack>
      </Container>
    )
  }

  return (
    <>
      {/* <BruteForceGamesAppBar
        tabsConfig={{
          tabItems: PlayerGameTabItems,
          activeTabId: activeTabId,
          onTabChange: setActiveTabId
        }}
      /> */}
      {/* <BfgPlayerGameBar
        activeTabId={activeTabId}
      /> */}
      <BfgGameBar
        myGameTableAccess="play"
        activeTabId={activeTabId}
      />

      <PlayerP2pGameComponent
        gameTableId={tableId}
        playerProfile={myPlayerProfile}
        mode="player-game"
      />
    </>
  )
}
