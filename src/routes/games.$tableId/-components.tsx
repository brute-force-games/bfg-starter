import { BruteForceGamesAppBar } from "@bfg-engine/ui/components/bfg-app-bar/app-bar"
import { AppBarTabItem } from "@bfg-engine/ui/components/bfg-app-bar/tab-item-hook";
import { ChildRoutesOf } from "../-utils";


export type PlayerGameTabId = ChildRoutesOf<'/games/$tableId'>;

interface BfgPlayerGameBarProps {
  activeTabId: PlayerGameTabId;
}

export const BfgPlayerGameBar = ({ activeTabId }: BfgPlayerGameBarProps) => {

  const PlayerGameTabItems: readonly AppBarTabItem<PlayerGameTabId>[] = [
    { id: '/games/$tableId', label: 'Player Game', link: { to: '/games/$tableId' } },
    { id: '/games/$tableId/observe', label: 'Observer View', link: { to: '/games/$tableId/observe' } },
  ];

  return (
    <BruteForceGamesAppBar 
      tabsConfig={{
        tabItems: PlayerGameTabItems,
        activeTabId: activeTabId,
      }}
    />
  )
}