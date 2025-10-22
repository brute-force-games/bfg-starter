// import { useState } from "react";
// import { GameLobbyId } from "@bfg-engine/models/types/bfg-branded-ids";
// import { HostedLobbyComponent } from "@bfg-engine/ui/components/hosted-lobby-component";
// import { AppBarTabItem } from "@bfg-engine/ui/components/bfg-app-bar/tab-item-hook";
// import { HostedLobbyTabId } from "@bfg-engine/ui/components/bfg-tabs";
// import { BruteForceGamesAppBar } from "@bfg-engine/ui/components/bfg-app-bar/app-bar";


// interface HostedLobbyPageProps {
//   lobbyId: GameLobbyId;
// }

// export const HostedLobbyPage = ({ lobbyId }: HostedLobbyPageProps) => {
  
//   const HostedLobbyTabItems: readonly AppBarTabItem<HostedLobbyTabId>[] = [
//     { id: 'lobby-admin', label: 'Lobby Admin' },
//     { id: 'player-lobby', label: 'Player Lobby' },
//     { id: 'host-p2p-lobby-details', label: 'P2P Details' },
//   ];

//   const [activeTabId, setActiveTabId] = useState<HostedLobbyTabId>('lobby-admin');


//   return (
//     <>
//       <BruteForceGamesAppBar
//         tabsConfig={{
//           tabItems: HostedLobbyTabItems,
//           activeTabId: activeTabId,
//           onTabChange: setActiveTabId
//         }}
//       />
//       <HostedLobbyComponent
//         lobbyId={lobbyId}
//         activeTabId={activeTabId}
//       />
//     </>
//   )
// }
