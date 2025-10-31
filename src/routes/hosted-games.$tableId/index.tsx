import { createFileRoute } from '@tanstack/react-router'
// import { useP2pHostedGameContext } from '@bfg-engine/hooks/p2p/game/hosted-p2p-game-context';


const HostedGameIndexRoute = () => {

  return <div>Hosted Game Index Route</div>;

  // const p2pHostedGame = useP2pHostedGameContext();
  // const {
  //   gameTable,
  //   peers, 
  //   peerPlayers,
  //   allPlayerProfiles,
  //   myPlayerSeat,
  //   gameActions,
  //   myHostPlayerProfile,
  //   onHostActionStr,
  // } = p2pHostedGame;

  // if (!gameTable) {
  //   return <div>Game table not found</div>;
  // }

  // const activeTabId: HostedGameTabId = '/hosted-games/$tableId';

  // const onActingAsPlayerGameAction = (_actingAsPlayerSeat: GameTableSeat, _playerAction: any) => {
  //   throw new Error('Not implemented');
  // }

  // return (
  //   <ProfileGuard>
  //     <BfgHostedGameBar activeTabId={activeTabId} />
  //     <HostedGameView
  //       hostedGame={gameTable}
  //       myPlayerProfile={myHostPlayerProfile}
  //       myPlayerSeat={myPlayerSeat}
  //       gameActions={gameActions}
  //       peers={peers}
  //       peerPlayers={peerPlayers}
  //       allPlayerProfiles={allPlayerProfiles}
  //       onActingAsPlayerGameAction={onActingAsPlayerGameAction}
  //       onHostGameAction={onHostActionStr}
  //     />
  //   </ProfileGuard>
  // )
}

export const Route = createFileRoute('/hosted-games/$tableId/')({
  component: HostedGameIndexRoute,
})
