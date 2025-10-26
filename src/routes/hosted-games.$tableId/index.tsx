import { createFileRoute } from '@tanstack/react-router'
import { ProfileGuard } from '@bfg-engine/ui/components/profile-guard';
import { BfgHostedGameBar, HostedGameTabId } from './-components';
import { HostedGameView } from '@bfg-engine/ui/components/hosted-game-view';
import { useP2pHostedGameContext } from '@bfg-engine/hooks/p2p/hosted-p2p-game-context';
import { GameTableSeat } from '@bfg-engine/models/game-table/game-table';


const HostedGameIndexRoute = () => {

  const p2pHostedGame = useP2pHostedGameContext();
  const {
    gameTable,
    peerProfiles,
    allPlayerProfiles,
    myPlayerSeat,
    gameActions,
    myHostPlayerProfile,
    onHostActionStr,
  } = p2pHostedGame;

  if (!gameTable) {
    return <div>Game table not found</div>;
  }

  const gameTableId = gameTable.id;
  
  const activeTabId: HostedGameTabId = '/hosted-games/$tableId';

  // const updateLobbyState = (lobbyState: GameLobby) => {
  //   lobbyActions.updateLobby(lobbyState.id, lobbyState);
  // }

  // const setLobbyPlayerPool = (playerPool: PlayerProfileId[]) => {
  //   lobbyActions.updateLobbyPlayerPool(lobbyState.id, playerPool);
  // }

  // console.log('HostedGamesIndexRoute - gameTableId:', gameTableId);

  // const onMyPlayerGameAction = (playerAction: any) => {
  //   console.log('🎮 HOST SENDING SELF PLAYER ACTION:', playerAction);
  //   onSelfPlayerActionStr(playerAction);
  // }

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
        peerProfiles={peerProfiles}
        playerProfiles={allPlayerProfiles}
        onActingAsPlayerGameAction={onActingAsPlayerGameAction}
        onHostGameAction={onHostActionStr}
      />
    </ProfileGuard>
  )
}

export const Route = createFileRoute('/hosted-games/$tableId/')({
  component: HostedGameIndexRoute,

})
