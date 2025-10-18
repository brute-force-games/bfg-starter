import { useState } from 'react';
import { GameTableId } from '@bfg-engine/models/types/bfg-branded-ids'
import { HostedP2pGameComponent } from '@bfg-engine/ui/components/hosted-p2p-game-component'
import { HostedGameTabId } from '@bfg-engine/ui/components/bfg-tabs';
import { AppBarTabItem } from '@bfg-engine/ui/components/bfg-app-bar/tab-item-hook';
import { BruteForceGamesAppBar } from '@bfg-engine/ui/components/bfg-app-bar/app-bar';


interface HostedGamePageProps {
  tableId: GameTableId;
}

export const HostedGamePage = ({ tableId }: HostedGamePageProps) => {

  const HostedGameTabItems: readonly AppBarTabItem<HostedGameTabId>[] = [
    { id: 'game-admin', label: 'Game Admin' },
    { id: 'player-game', label: 'Player Game' },
    { id: 'hosted-game-details', label: 'Game Details' },
    { id: 'host-p2p-details', label: 'P2P Details' },
  ];

  const [activeTabId, setActiveTabId] = useState<HostedGameTabId>('game-admin');

  return (
    <>
      <BruteForceGamesAppBar
        tabsConfig={{
          tabItems: HostedGameTabItems,
          activeTabId: activeTabId,
          onTabChange: setActiveTabId
        }}
      />
      <HostedP2pGameComponent
        gameTableId={tableId}
        activeTabId={activeTabId}
      />
    </>
  )
}
