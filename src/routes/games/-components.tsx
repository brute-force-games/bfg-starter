import { AppBarTabItem } from "@bfg-engine/ui/components/bfg-app-bar/tab-item-hook";
import { type GameTableAccessLevel } from "../../../modules/bfg-engine/src/models/internal/user-game-perspective";
import { ChildRoutesOf } from "../-utils";


export type HostGameTabId = ChildRoutesOf<'/games/host/$gameId'>;
export type PlayerGameTabId = ChildRoutesOf<'/games/play/$gameId'>;
export type ObserverGameTabId = ChildRoutesOf<'/games/watch/$gameId'>;
export type GameTabId = HostGameTabId | PlayerGameTabId | ObserverGameTabId;


const HostGameTabItems: readonly AppBarTabItem<HostGameTabId>[] = [
  { id: '/games/host/$gameId/admin', label: 'Admin', link: { to: '/games/host/$gameId/admin' } },
  { id: '/games/host/$gameId', label: 'Host Player', link: { to: '/games/host/$gameId' } },
  { id: '/games/host/$gameId/game-details', label: 'Game Details', link: { to: '/games/host/$gameId/game-details' } },
  { id: '/games/host/$gameId/p2p-details', label: 'P2P Details', link: { to: '/games/host/$gameId/p2p-details' } },
];

const PlayerGameTabItems: readonly AppBarTabItem<PlayerGameTabId>[] = [
  { id: '/games/play/$gameId', label: 'Player View', link: { to: '/games/play/$gameId' } },
  { id: '/games/play/$gameId/game-details', label: 'Game Details', link: { to: '/games/play/$gameId/game-details' } },
  { id: '/games/play/$gameId/p2p-details', label: 'P2P Details', link: { to: '/games/play/$gameId/p2p-details' } },
];

const ObsertverGameTabItems: readonly AppBarTabItem<ObserverGameTabId>[] = [
  { id: '/games/watch/$gameId/game-details', label: 'Game Details', link: { to: '/games/watch/$gameId/game-details' } },
  { id: '/games/watch/$gameId/p2p-details', label: 'P2P Details', link: { to: '/games/watch/$gameId/p2p-details' } },
];


export const getGameTabItems = (myGameTableAccess: GameTableAccessLevel): readonly AppBarTabItem<GameTabId>[] => {
  if (myGameTableAccess === 'host') {
    return HostGameTabItems;
  }
  if (myGameTableAccess === 'player') {
    return PlayerGameTabItems;
  }
  return ObsertverGameTabItems;
}
