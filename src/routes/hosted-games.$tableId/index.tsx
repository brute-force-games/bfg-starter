import { createFileRoute } from '@tanstack/react-router'
import { ProfileGuard } from '@bfg-engine/ui/components/profile-guard';
import { BfgHostedGameBar, HostedGameTabId } from './-components';
import { HostedGameView } from '@bfg-engine/ui/components/hosted-game-view';
import { useP2pHostedGameContext } from '@bfg-engine/hooks/p2p/hosted-p2p-game-context';


const HostedGameIndexRoute = () => {

  // const { tableId } = Route.useParams();
  const p2pHostedGame = useP2pHostedGameContext();
  const {
    gameTable,
    peerProfiles,
    // otherPlayerProfiles,
    allPlayerProfiles,
    myPlayerSeat,
    gameActions,
    myHostPlayerProfile,
    handlePlayerMove,
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

    console.log('HostedGamesIndexRoute - gameTableId:', gameTableId);

  return (
    <ProfileGuard>
      <BfgHostedGameBar activeTabId={activeTabId} />
      {/* <LobbyHostStateComponent
        playerProfiles={allPlayerProfiles}
        lobbyState={lobbyState}
        lobbyOptions={lobbyOptions}
        setLobbyOptions={setLobbyOptions}
        updateLobbyState={updateLobbyState}
        setLobbyPlayerPool={setLobbyPlayerPool}
      /> */}
      <div>Hosted Game: {gameTableId}</div>

      {/* <HostedP2pGameComponent
        gameTableId={tableId}
        activeTabId={activeTabId}
      /> */}

      <HostedGameView
        hostedGame={gameTable}
        myPlayerProfile={myHostPlayerProfile}
        myPlayerSeat={myPlayerSeat}
        gameActions={gameActions}
        peerProfiles={peerProfiles}
        playerProfiles={allPlayerProfiles}
        onPlayerGameAction={handlePlayerMove}

        // activeTabId={activeTabId}
        
        // myPlayerProfile={myHostPlayerProfile}
        // onPlayerGameAction={handlePlayerMove}
        // myPlayerSeat={myPlayerSeat}
        // hostedGame={hostedGame}
        // gameActions={gameActions}
        // peerProfiles={peerProfiles}
        // playerProfiles={playerProfiles}
      />
    </ProfileGuard>
  )
}

export const Route = createFileRoute('/hosted-games/$tableId/')({
  component: HostedGameIndexRoute,

})
