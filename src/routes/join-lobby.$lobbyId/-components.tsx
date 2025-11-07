import { AppBarTabItem } from "@bfg-engine/ui/components/bfg-app-bar/tab-item-hook";
import { ChildRoutesOf } from "../-utils";
import { BfgStarterNavBar } from "@bfg-engine/ui/components/bfg-nav-bar/bfg-starter-nav-bar";



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

  const setActiveTabId = (_tabId: JoinLobbyTabId) => {
    console.warn('setActiveTabId not implemented');
  }

  return (
    // <BruteForceGamesAppBar 
    //   tabsConfig={{
    //     tabItems: JoinLobbyTabItems,
    //     activeTabId: activeTabId,
    //     onTabClicked: setActiveTabId
    //   }}
    // />
    <BfgStarterNavBar<JoinLobbyTabId>
      tabsConfig={{
        tabItems: JoinLobbyTabItems,
        activeTabId: activeTabId,
        onTabClicked: setActiveTabId
      }}
    />

  )
}