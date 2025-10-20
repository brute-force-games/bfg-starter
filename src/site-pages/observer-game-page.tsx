import { ObserverP2pGameComponent } from "@bfg-engine";
import { GameTableId } from "@bfg-engine/models/types/bfg-branded-ids";
import { BruteForceGamesAppBar } from "@bfg-engine/ui/components/bfg-app-bar/app-bar";
import { AppBarTabItem } from "@bfg-engine/ui/components/bfg-app-bar/tab-item-hook";
import { PlayerGameTabId } from "@bfg-engine/ui/components/bfg-tabs";
import { useState } from "react";


interface IObserverGamePageProps {
  tableId: GameTableId;
}

export const ObserverGamePage = ({ tableId }: IObserverGamePageProps) => {

  const ObserverGameTabItems: readonly AppBarTabItem<PlayerGameTabId>[] = [
    { id: 'player-game', label: 'Observer View' },
    { id: 'player-game-details', label: 'Game Details' },
    { id: 'player-p2p-game-details', label: 'P2P Details' },
  ];
  
  const [activeTabId, setActiveTabId] = useState<PlayerGameTabId>('player-game');

  return (
    <>
      <BruteForceGamesAppBar
        tabsConfig={{
          tabItems: ObserverGameTabItems,
          activeTabId: activeTabId,
          onTabChange: setActiveTabId
        }}
      />
      <ObserverP2pGameComponent
        gameTableId={tableId}
        activeTabId={activeTabId}
      />
    </>
  )
}
