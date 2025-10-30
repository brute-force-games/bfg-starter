import { BruteForceGamesAppBar } from "@bfg-engine/ui/components/bfg-app-bar/app-bar"
import { AppBarTabItem } from "@bfg-engine/ui/components/bfg-app-bar/tab-item-hook";
import { ChildRoutesOf } from "../-utils";


// Utility type to extract all child routes of a specific path
// type ChildRoutesOf<TPath extends string> = Extract<
//   keyof FileRoutesByTo,
//   `${TPath}${string}`
// >;

// Automatically includes ALL child routes under /join-lobby/$lobbyId
export type JoinLobbyTabId = ChildRoutesOf<'/join-lobby/$lobbyId'>;

interface BfgJoinLobbyAppBarProps {
  // tabItems: readonly AppBarTabItem<JoinLobbyTabId>[];
  activeTabId: JoinLobbyTabId;
}

export const BfgJoinLobbyAppBar = ({ activeTabId }: BfgJoinLobbyAppBarProps) => {

  const JoinLobbyTabItems: readonly AppBarTabItem<JoinLobbyTabId>[] = [
    {
      id: '/join-lobby/$lobbyId',
      label: 'Player Lobby',
      link: { to: '/join-lobby/$lobbyId' },
    },
    { 
      id: '/join-lobby/$lobbyId/p2p-details',
      label: 'P2P Details', 
      link: { to: '/join-lobby/$lobbyId/p2p-details' },
    },
  ];

  const setActiveTabId = (tabId: JoinLobbyTabId) => {
    console.log('setActiveTabId', tabId);
  }

  return (
    <BruteForceGamesAppBar 
      tabsConfig={{
        tabItems: JoinLobbyTabItems,
        activeTabId: activeTabId,
        onTabChange: setActiveTabId
      }}
    />
  )
}