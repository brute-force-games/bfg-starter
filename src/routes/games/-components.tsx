import { AppBarTabItem } from "@bfg-engine/ui/components/bfg-app-bar/tab-item-hook";
import { GameTableAccessRole } from "@bfg-engine/models/game-roles";
import { ChildRoutesOf } from "../-utils";


export type HostGameTabId = ChildRoutesOf<'/games/host/$tableId'>;
export type PlayerGameTabId = ChildRoutesOf<'/games/play/$tableId'>;
export type ObserverGameTabId = ChildRoutesOf<'/games/watch/$tableId'>;
export type GameTabId = HostGameTabId | PlayerGameTabId | ObserverGameTabId;


const HostGameTabItems: readonly AppBarTabItem<HostGameTabId>[] = [
  { id: '/games/host/$tableId/admin', label: 'Admin', link: { to: '/games/host/$tableId/admin' } },
  { id: '/games/host/$tableId', label: 'Host Player', link: { to: '/games/host/$tableId' } },
  { id: '/games/host/$tableId/game-details', label: 'Game Details', link: { to: '/games/host/$tableId/game-details' } },
  { id: '/games/host/$tableId/p2p-details', label: 'P2P Details', link: { to: '/games/host/$tableId/p2p-details' } },
];

const PlayerGameTabItems: readonly AppBarTabItem<PlayerGameTabId>[] = [
  { id: '/games/play/$tableId', label: 'Player View', link: { to: '/games/play/$tableId' } },
  { id: '/games/play/$tableId/game-details', label: 'Game Details', link: { to: '/games/play/$tableId/game-details' } },
  { id: '/games/play/$tableId/p2p-details', label: 'P2P Details', link: { to: '/games/play/$tableId/p2p-details' } },
];

const ObsertverGameTabItems: readonly AppBarTabItem<ObserverGameTabId>[] = [
  { id: '/games/watch/$tableId/game-details', label: 'Game Details', link: { to: '/games/watch/$tableId/game-details' } },
  { id: '/games/watch/$tableId/p2p-details', label: 'P2P Details', link: { to: '/games/watch/$tableId/p2p-details' } },
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
