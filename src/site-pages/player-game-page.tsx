import { PlayerP2pGameComponent, useMyDefaultPlayerProfile, Container, Typography, Stack } from "@bfg-engine";
import { GameTableId } from "@bfg-engine/models/types/bfg-branded-ids";
import { BruteForceGamesAppBar } from "@bfg-engine/ui/components/bfg-app-bar/app-bar";
import { AppBarTabItem } from "@bfg-engine/ui/components/bfg-app-bar/tab-item-hook";
import { PlayerGameTabId } from "@bfg-engine/ui/components/bfg-tabs";
import { useState } from "react";


interface IPlayerGamePageProps {
  tableId: GameTableId;
}

export const PlayerGamePage = ({ tableId }: IPlayerGamePageProps) => {

  const PlayerGameTabItems: readonly AppBarTabItem<PlayerGameTabId>[] = [
    { id: 'player-game', label: 'Player Game' },
    { id: 'player-game-details', label: 'Game Details' },
    { id: 'player-p2p-game-details', label: 'P2P Details' },
  ];
  
  const myPlayerProfile = useMyDefaultPlayerProfile();
  const [activeTabId, setActiveTabId] = useState<PlayerGameTabId>('player-game');

  if (!myPlayerProfile) {
    return (
      <Container style={{ padding: '24px' }}>
        <Stack spacing={3}>
          <Typography variant="h3">Loading Game...</Typography>
          <Typography variant="body1" color="secondary">
            Loading game details...
          </Typography>
        </Stack>
      </Container>
    )
  }

  return (
    <>
      <BruteForceGamesAppBar
        tabsConfig={{
          tabItems: PlayerGameTabItems,
          activeTabId: activeTabId,
          onTabChange: setActiveTabId
        }}
      />
      <PlayerP2pGameComponent
        gameTableId={tableId}
        playerProfile={myPlayerProfile}
        activeTabId={activeTabId}
      />
    </>
  )
}
