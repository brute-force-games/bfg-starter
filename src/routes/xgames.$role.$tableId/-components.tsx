import { AppBarTabItem } from "@bfg-engine/ui/components/bfg-app-bar/tab-item-hook";
import { GameTableAccessRole } from "@bfg-engine/models/game-roles";
import { ChildRoutesOf } from "../-utils";


export type GameTabId = ChildRoutesOf<'/xgames/$role/$tableId'>;


const HostGameTabItems: readonly AppBarTabItem<GameTabId>[] = [
  { id: '/xgames/$role/$tableId/admin', label: 'Admin', link: { to: '/games/$role/$tableId/admin' } },
  { id: '/xgames/$role/$tableId', label: 'Host Player', link: { to: '/games/$role/$tableId' } },
  { id: '/xgames/$role/$tableId/game-details', label: 'Game Details', link: { to: '/games/$role/$tableId/game-details' } },
  { id: '/xgames/$role/$tableId/p2p-details', label: 'P2P Details', link: { to: '/games/$role/$tableId/p2p-details' } },
];

const PlayerGameTabItems: readonly AppBarTabItem<GameTabId>[] = [
  { id: '/xgames/$role/$tableId', label: 'Player View', link: { to: '/games/$role/$tableId' } },
  { id: '/xgames/$role/$tableId/game-details', label: 'Game Details', link: { to: '/games/$role/$tableId/game-details' } },
  { id: '/xgames/$role/$tableId/p2p-details', label: 'P2P Details', link: { to: '/games/$role/$tableId/p2p-details' } },
];

const ObsertverGameTabItems: readonly AppBarTabItem<GameTabId>[] = [
  { id: '/xgames/$role/$tableId/game-details', label: 'Game Details', link: { to: '/games/$role/$tableId/game-details' } },
  { id: '/xgames/$role/$tableId/p2p-details', label: 'P2P Details', link: { to: '/games/$role/$tableId/p2p-details' } },
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
