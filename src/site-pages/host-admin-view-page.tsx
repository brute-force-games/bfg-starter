import { HostedGameView, HostedGameViewProps } from "@bfg-engine/ui/components/hosted-game-view";
import { GameTableSeat } from "@bfg-engine/models/game-table/game-table";
import { GameTabId, getGameTabItems } from "~/routes/games.$role.$tableId/-components";
import { BfgGameScreenFrame } from "@bfg-engine/ui/components/bfg-game-screen-frame";
import { IBfgGameRoomForHost } from "@bfg-engine/hooks/p2p/game/p2p-game-types";


// interface HostAdminViewPageProps {
//   tableId: GameTableId;
//   myPlayerProfile: PublicPlayerProfile | null;
// }

// export const HostAdminViewPage = ({ tableId, myPlayerProfile }: HostAdminViewPageProps) => {
export const HostAdminViewPage = (props: IBfgGameRoomForHost) => {

  // const hostedP2pGame = useHostedP2pGameWithStore(tableId, myPlayerProfile);
  // const gameRegistry = useGameRegistry();
  
  // if (!p2pGameRoom) {
  //   return (
  //     <div className="p-6">
  //       <h1 className="text-3xl font-bold mb-6">Loading Game...</h1>
  //       <div className="text-gray-600">Loading P2P game details...</div>
  //     </div>
  //   )
  // }

  // if (!myPlayerProfile) {
  //   return (
  //     <div className="p-6">
  //       <h1 className="text-3xl font-bold mb-6">Player Profile Required</h1>
  //       <div className="text-gray-600">A player profile is required to host a game.</div>
  //     </div>
  //   )
  // }

  const { p2pDetails, playerGameDetails, hostGameDetails } = props;
  const { allPlayerProfiles } = p2pDetails;

  const {
    gameTable,
    gameMetadata,
    // peers, 
    // peerPlayers,
    // allPlayerProfiles,
    // myPlayerSeat,
    // myGameTableAccess,
    gameActions,
    // onHostActionStr,
  } = hostGameDetails;

  if (!gameTable) {
    return <div>Game table not found</div>;
  }

  // if (myGameTableAccess !== 'host') {
  //   return <div>You are not the host of this game table</div>;
  // }

  if (!gameActions) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Game Actions...</h1>
        <div className="text-gray-600">Loading game action history...</div>
      </div>
    )
  }

  const activeTabId: GameTabId = '/games/$role/$tableId/admin';

  const onActingAsPlayerGameAction = (_actingAsPlayerSeat: GameTableSeat, _playerAction: any) => {
    throw new Error('Not implemented');
  }

  const gameTabItems = getGameTabItems('host');
  const tabsConfig = {
    tabItems: gameTabItems,
    activeTabId: activeTabId,
    onTabChange: () => { console.log('onTabChange not implemented'); }
  };


  const latestGameSpecificStateStr = gameActions.length > 0 ? 
    gameActions[gameActions.length - 1].nextGameStateStr :
    null;
  const latestGameSpecificState = latestGameSpecificStateStr ?
    gameMetadata.encoders.hostGameStateEncoder.decode(latestGameSpecificStateStr) :
    null;

  const hostedGameViewProps: HostedGameViewProps = {
    ...p2pDetails,
    ...playerGameDetails,
    ...hostGameDetails,
    hostedGame: gameTable,
    onActingAsPlayerGameAction: onActingAsPlayerGameAction,
    onHostGameAction: hostGameDetails.onHostAction,
  }

  return (
    <BfgGameScreenFrame
      tabsConfig={tabsConfig}
      gameMetadata={gameMetadata}
      gameTable={gameTable}
      allPlayerProfiles={allPlayerProfiles}
      gameState={latestGameSpecificState}
      gameActions={gameActions}
    >
      <HostedGameView
        // hostedGame={gameTable}
        // myPlayerProfile={myPlayerProfile}
        // myPlayerSeat={myPlayerSeat}
        // gameActions={gameActions}
        // peers={peers}
        // peerPlayers={peerPlayers}
        // allPlayerProfiles={allPlayerProfiles}
        // onActingAsPlayerGameAction={onActingAsPlayerGameAction}
        // onHostGameAction={onHostActionStr}
        // {...props}
        {...hostedGameViewProps}
      />
    </BfgGameScreenFrame>
  )
}
