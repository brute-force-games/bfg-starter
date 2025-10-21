import { BruteForceGamesAppBar } from "@bfg-engine/ui/components/bfg-app-bar/app-bar"
import { AppBarTabItem } from "@bfg-engine/ui/components/bfg-app-bar/tab-item-hook";
import { ChildRoutesOf } from "../-utils";


export type HostedLobbyTabId = ChildRoutesOf<'/hosted-lobby/$lobbyId'>;

interface BfgHostedLobbyAppBarProps {
  activeTabId: HostedLobbyTabId;
}

export const BfgHostedLobbyAppBar = ({ activeTabId }: BfgHostedLobbyAppBarProps) => {

  const HostedLobbyTabItems: readonly AppBarTabItem<HostedLobbyTabId>[] = [
    { id: '/hosted-lobby/$lobbyId', label: 'Lobby Admin', link: { to: '/hosted-lobby/$lobbyId' } },
    { id: '/hosted-lobby/$lobbyId/player', label: 'Host Player Lobby', link: { to: '/hosted-lobby/$lobbyId/player' } },
    { id: '/hosted-lobby/$lobbyId/p2p-details', label: 'P2P Details', link: { to: '/hosted-lobby/$lobbyId/p2p-details' } },
  ];

  return (
    <BruteForceGamesAppBar 
      tabsConfig={{
        tabItems: HostedLobbyTabItems,
        activeTabId: activeTabId,
      }}
    />
  )
}