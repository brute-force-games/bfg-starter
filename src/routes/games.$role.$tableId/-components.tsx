import { AppBarTabItem } from "@bfg-engine/ui/components/bfg-app-bar/tab-item-hook";
import { GameTableAccessRole } from "@bfg-engine/models/game-roles";
import { BfgGameNavBar } from "~/components/bfg-game-nav-bar";
import { ChildRoutesOf } from "../-utils";


export type GameTabId = ChildRoutesOf<'/games/$role/$tableId'>;

interface BfgGameBarProps {
  myGameTableAccess: GameTableAccessRole;
  activeTabId: GameTabId;
}

const HostGameTabItems: readonly AppBarTabItem<GameTabId>[] = [
  { id: '/games/$role/$tableId/admin', label: 'Admin', link: { to: '/games/$role/$tableId/admin' } },
  { id: '/games/$role/$tableId', label: 'Host View', link: { to: '/games/$role/$tableId' } },
  { id: '/games/$role/$tableId/game-details', label: 'Game Details', link: { to: '/games/$role/$tableId/game-details' } },
  { id: '/games/$role/$tableId/p2p-details', label: 'P2P Details', link: { to: '/games/$role/$tableId/p2p-details' } },
];

const PlayerGameTabItems: readonly AppBarTabItem<GameTabId>[] = [
  { id: '/games/$role/$tableId', label: 'Player View', link: { to: '/games/$role/$tableId' } },
  { id: '/games/$role/$tableId/game-details', label: 'Game Details', link: { to: '/games/$role/$tableId/game-details' } },
  { id: '/games/$role/$tableId/p2p-details', label: 'P2P Details', link: { to: '/games/$role/$tableId/p2p-details' } },
];

const ObsertverGameTabItems: readonly AppBarTabItem<GameTabId>[] = [
  { id: '/games/$role/$tableId/game-details', label: 'Game Details', link: { to: '/games/$role/$tableId/game-details' } },
  { id: '/games/$role/$tableId/p2p-details', label: 'P2P Details', link: { to: '/games/$role/$tableId/p2p-details' } },
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

  return (
    <BfgGameNavBar<GameTabId>
      myGameTableAccess={myGameTableAccess}
      activeTabId={activeTabId}
    />
  )
}
