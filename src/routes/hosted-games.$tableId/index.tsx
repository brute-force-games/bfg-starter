import { createFileRoute } from '@tanstack/react-router'
import { ProfileGuard } from '@bfg-engine/ui/components/profile-guard';
import { BfgHostedGameBar, HostedGameTabId } from './-components';
import { HostedGameView } from '@bfg-engine/ui/components/hosted-game-view';
import { useP2pHostedGameContext } from '@bfg-engine/hooks/p2p/game/hosted-p2p-game-context';
import { GameTableSeat } from '@bfg-engine/models/game-table/game-table';


const HostedGameIndexRoute = () => {

  const p2pHostedGame = useP2pHostedGameContext();
  const {
    gameTable,
    peers, 
    peerPlayers,
    allPlayerProfiles,
    myPlayerSeat,
    gameActions,
    myHostPlayerProfile,
    onHostActionStr,
  } = p2pHostedGame;

  if (!gameTable) {
    return <div>Game table not found</div>;
  }

  const activeTabId: HostedGameTabId = '/hosted-games/$tableId';

  const onActingAsPlayerGameAction = (_actingAsPlayerSeat: GameTableSeat, _playerAction: any) => {
    throw new Error('Not implemented');
  }

  return (
    <ProfileGuard>
      <BfgHostedGameBar activeTabId={activeTabId} />
      <HostedGameView
        hostedGame={gameTable}
        myPlayerProfile={myHostPlayerProfile}
        myPlayerSeat={myPlayerSeat}
        gameActions={gameActions}
        peers={peers}
        peerPlayers={peerPlayers}
        allPlayerProfiles={allPlayerProfiles}
        onActingAsPlayerGameAction={onActingAsPlayerGameAction}
        onHostGameAction={onHostActionStr}
      />
    </ProfileGuard>
  )
}

export const Route = createFileRoute('/hosted-games/$tableId/')({
  component: HostedGameIndexRoute,
})
