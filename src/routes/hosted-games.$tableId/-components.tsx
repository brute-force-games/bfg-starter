import { BruteForceGamesAppBar } from "@bfg-engine/ui/components/bfg-app-bar/app-bar"
import { AppBarTabItem } from "@bfg-engine/ui/components/bfg-app-bar/tab-item-hook";
import { ChildRoutesOf } from "../-utils";


export type HostedGameTabId = ChildRoutesOf<'/hosted-games/$tableId'>;

interface BfgHostedGameBarProps {
  activeTabId: HostedGameTabId;
}

export const BfgHostedGameBar = ({ activeTabId }: BfgHostedGameBarProps) => {

  const HostedGameTabItems: readonly AppBarTabItem<HostedGameTabId>[] = [
    { id: '/hosted-games/$tableId', label: 'Host View', link: { to: '/hosted-games/$tableId' } },
    { id: '/hosted-games/$tableId/player', label: 'Host Player Game', link: { to: '/hosted-games/$tableId/player' } },
    { id: '/hosted-games/$tableId/p2p-details', label: 'P2P Details', link: { to: '/hosted-games/$tableId/p2p-details' } },
    { id: '/hosted-games/$tableId/game-details', label: 'Game Details', link: { to: '/hosted-games/$tableId/game-details' } },
  ];

  return (
    <BruteForceGamesAppBar 
      tabsConfig={{
        tabItems: HostedGameTabItems,
        activeTabId: activeTabId,
      }}
    />
  )
}