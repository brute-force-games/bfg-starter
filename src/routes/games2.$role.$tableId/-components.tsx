import { AppBarTabItem } from "@bfg-engine/ui/components/bfg-app-bar/tab-item-hook";
import { ChildRoutesOf } from "../-utils";
import { GameTableAccessRole } from "@bfg-engine/models/game-roles";
import { BfgGameNavBar } from "~/components/bfg-game-nav-bar";


export type GameTabId = ChildRoutesOf<'/games2/$role/$tableId'>;

interface BfgGameBarProps {
  myGameTableAccess: GameTableAccessRole;
  activeTabId: GameTabId;
}

const HostGameTabItems: readonly AppBarTabItem<GameTabId>[] = [
  { id: '/games2/$role/$tableId/admin', label: 'Admin', link: { to: '/games2/$role/$tableId/admin' } },
  { id: '/games2/$role/$tableId', label: 'Host View', link: { to: '/games2/$role/$tableId' } },
  { id: '/games2/$role/$tableId/game-details', label: 'Game Details', link: { to: '/games2/$role/$tableId/game-details' } },
  { id: '/games2/$role/$tableId/p2p-details', label: 'P2P Details', link: { to: '/games2/$role/$tableId/p2p-details' } },
];

const PlayerGameTabItems: readonly AppBarTabItem<GameTabId>[] = [
  { id: '/games2/$role/$tableId', label: 'Player View', link: { to: '/games2/$role/$tableId' } },
  { id: '/games2/$role/$tableId/game-details', label: 'Game Details', link: { to: '/games2/$role/$tableId/game-details' } },
  { id: '/games2/$role/$tableId/p2p-details', label: 'P2P Details', link: { to: '/games2/$role/$tableId/p2p-details' } },
];

const ObsertverGameTabItems: readonly AppBarTabItem<GameTabId>[] = [
  { id: '/games2/$role/$tableId/game-details', label: 'Game Details', link: { to: '/games2/$role/$tableId/game-details' } },
  { id: '/games2/$role/$tableId/p2p-details', label: 'P2P Details', link: { to: '/games2/$role/$tableId/p2p-details' } },
];


export const getGameTabItems = (myGameTableAccess: GameTableAccessRole): readonly AppBarTabItem<GameTabId>[] => {
  if (myGameTableAccess === 'host') {
    return HostGameTabItems;
  }
  if (myGameTableAccess === 'play') {
    return PlayerGameTabItems;
  }
  return ObsertverGameTabItems;
}


export const BfgGameBar = ({ myGameTableAccess, activeTabId }: BfgGameBarProps) => {

  // const gameTabItems = getGameTabItems(myGameTableAccess);

  return (
    // <BruteForceGamesAppBar 
    //   tabsConfig={{
    //     tabItems: gameTabItems,
    //     activeTabId: activeTabId,
    //   }}
    // />
      <BfgGameNavBar<GameTabId>
        myGameTableAccess={myGameTableAccess}
        activeTabId={activeTabId}
      />
  )


  // if (myGameTableAccess === 'observer') {
  //   return (
  //     <BruteForceGamesAppBar 
  //       tabsConfig={{
  //         tabItems: gameTabItems,
  //         activeTabId: activeTabId,
  //       }}
  //     />
  //   )
  // }

  // if (myGameTableAccess === 'player') {
  //   return (
  //     <BruteForceGamesAppBar 
  //       tabsConfig={{
  //         tabItems: gameTabItems,
  //         activeTabId: activeTabId,
  //       }}
  //     />
  //   )
  // }

  // return (
  //   <BruteForceGamesAppBar 
  //     tabsConfig={{
  //       tabItems: HostGameTabItems,
  //       activeTabId: activeTabId,
  //     }}
  //   />
  // )
}


  // const GameTabItems: readonly AppBarTabItem<GameTabId>[] = [
  //   { id: '/games2/$role/$tableId', label: 'Host View', link: { to: '/games2/$role/$tableId' } },
  //   { id: '/games2/$role/$tableId/player', label: 'Host Player Game', link: { to: '/games2/$role/$tableId/player' } },
  //   { id: '/games2/$role/$tableId/observe', label: 'Observer View', link: { to: '/games2/$role/$tableId/observe' } },
  //   { id: '/games2/$role/$tableId/game-details', label: 'Game Details', link: { to: '/games2/$role/$tableId/game-details' } },
  //   { id: '/games2/$role/$tableId/p2p-details', label: 'P2P Details', link: { to: '/games2/$role/$tableId/p2p-details' } },
  // ];

  // return (
  //   <BruteForceGamesAppBar 
  //     tabsConfig={{
  //       tabItems: HostedGameTabItems,
  //       activeTabId: activeTabId,
  //     }}
  //   />
  // )
// }