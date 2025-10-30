import { HostObserverP2pGameComponent } from "@bfg-engine/ui/components/host-observer-p2p-game-component";
import { BfgHostedGameBar, HostedGameTabId } from "~/routes/hosted-games.$tableId/-components";
import { useP2pHostedGameContext } from "@bfg-engine/hooks/p2p/game/hosted-p2p-game-context";


export const HostObserverGamePage = () => {

  const activeTabId: HostedGameTabId = '/hosted-games/$tableId/observe';

  const hostedGame = useP2pHostedGameContext();
  const { gameTable, gameActions } = hostedGame;

  return (
    <>
      <BfgHostedGameBar activeTabId={activeTabId} />
      <HostObserverP2pGameComponent
        hostedGame={gameTable}
        gameActions={gameActions}
      />
    </>
  )
}
