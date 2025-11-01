import { ObserverP2pGameComponent } from "@bfg-engine";
import { GameTableId } from "@bfg-engine/models/types/bfg-branded-ids";
import { BfgGameNavBar } from "~/components/bfg-game-nav-bar";
import { GameTabId } from "~/routes/games.$role.$tableId/-components";


interface IObserverGamePageProps {
  tableId: GameTableId;
}

export const ObserverGamePage = ({ tableId }: IObserverGamePageProps) => {

  const activeTabId: GameTabId = '/games/$role/$tableId';

  return (
    <>
      <BfgGameNavBar
        myGameTableAccess="watch"
        activeTabId={activeTabId}
      />
      <ObserverP2pGameComponent
        gameTableId={tableId}
      />
    </>
  )
}
