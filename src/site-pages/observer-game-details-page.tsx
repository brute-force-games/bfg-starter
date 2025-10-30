import { GameTableId } from "@bfg-engine/models/types/bfg-branded-ids";
import { ObserverP2pGameDetailsComponent } from "@bfg-engine/ui/components/observer-p2p-game-details-component";
import { BfgPlayerGameBar } from "~/routes/games.$tableId/-components";


interface IObserverGameDetailsPageProps {
  tableId: GameTableId;
}

export const ObserverGameDetailsPage = ({ tableId }: IObserverGameDetailsPageProps) => {

  // const ObserverGameTabItems: readonly AppBarTabItem<PlayerGameTabId>[] = [
  //   { id: 'player-game', label: 'Observer View' },
  //   { id: 'player-game-details', label: 'Game Details' },
  //   // { id: 'player-p2p-game-details', label: 'P2P Details' },
  // ];
  
  // const [activeTabId, setActiveTabId] = useState<PlayerGameTabId>('player-game');
  const activeTabId = '/games/$tableId/game-details';

  return (
    <>
      {/* <BruteForceGamesAppBar
        tabsConfig={{
          tabItems: ObserverGameTabItems,
          activeTabId: activeTabId,
          onTabChange: setActiveTabId
        }}
      /> */}
      <BfgPlayerGameBar
        activeTabId={activeTabId}
      />
      <ObserverP2pGameDetailsComponent
        gameTableId={tableId}
      />
    </>
  )
}
