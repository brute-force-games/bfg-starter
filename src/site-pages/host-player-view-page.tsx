import { GameTabId, getGameTabItems } from "~/routes/games.$role.$tableId/-components";
import { PlayerGameView } from "@bfg-engine/ui/components/player-game-view";
import { BfgGameScreenFrame } from "@bfg-engine/ui/components/bfg-game-screen-frame";
import { useP2pGameRoomAsHost } from "@bfg-engine/hooks/p2p/game/use-bfg-game-room";
import { IHostBfgGameDetails } from "@bfg-engine/hooks/p2p/game/p2p-game-types";


// interface HostGamePlayerViewPageProps {
//   tableId: GameTableId;
//   // myPlayerProfile: PublicPlayerProfile | null;
// }


// export const HostGamePlayerViewPage = ({ tableId }: HostGamePlayerViewPageProps) => {
export const HostGamePlayerViewPage = () => {

  // const p2pGameRoom = useBfgGameRoomForRole('host');
  const p2pGameRoom = useP2pGameRoomAsHost();

  if (!p2pGameRoom) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Game...</h1>
        <div className="text-gray-600">Loading P2P game as host...</div>
      </div>
    )
  }

  // const p2pPlayerGame = p2pGame.p2pDetails;
  // const { p2pDetails } = p2pGame;

  // if (!p2p) {
  //   return <div>P2P game as player not found</div>;
  // }


  const {
    // gameMetadata,
    // gameTable,
    // gameActions,
    // // allPlayerProfiles,
    // myPlayerSeat,
    // myPrivatePlayerKnowledgeStr,
    // peers,
    // peerPlayerIds,
    // onSelfPlayerActionStr,
    p2pDetails,
    publicGameDetails,
    playerGameDetails,
    // myPlayerProfile,
  } = p2pGameRoom;

  if (!publicGameDetails) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Player Profile Required</h1>
        <div className="text-gray-600">A player profile is required to host a game.</div>
      </div>
    )
  }

  if (!playerGameDetails) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Player Profile Required</h1>
        <div className="text-gray-600">You are not playing in this game.</div>
      </div>
    )
  }

  // if (!myPlayerProfile) {
  //   return (
  //     <div className="p-6">
  //       <h1 className="text-3xl font-bold mb-6">Player Profile Required</h1>
  //       <div className="text-gray-600">A player profile is required to host a game.</div>
  //     </div>
  //   )
  // }

  // const {
  //   gameTable,
  //   peers, 
  //   peerPlayers,
  //   allPlayerProfiles,
  //   myPlayerSeat,
  //   myGameTableAccess,
  //   gameActions,
  //   onSelfPlayerActionStr,
  //   myPrivatePlayerKnowledgeStr,
  // } = hostedP2pGame;


  const {
    peers,
    peerPlayerIds,
    allPlayerProfiles,
  } = p2pDetails;

  const {
    gameTable,
    gameActions,
    gameMetadata,
  } = publicGameDetails;

  if (!gameTable) {
    return <div>Game table not found</div>;
  }

  if (p2pGameRoom.maxAllowedAccessRole !== 'host') {
    return <div>You are not the host of this game table</div>;
  }

  if (!gameActions) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Game Actions...</h1>
        <div className="text-gray-600">Loading game action history...</div>
      </div>
    )
  }

  // const gameMetadata = gameRegistry.getGameMetadata(gameTable.gameTitle);
  const latestGameSpecificStateStr = gameActions.length > 0 ? 
    gameActions[gameActions.length - 1].nextGameStateStr :
    null;
  const latestHostGameState = latestGameSpecificStateStr ?
    gameMetadata.encoders.hostGameStateEncoder.decode(latestGameSpecificStateStr) :
    null;

  const activeTabId: GameTabId = '/games/$role/$tableId';

  const gameTabItems = getGameTabItems('host');
  const tabsConfig = {
    tabItems: gameTabItems,
    activeTabId: activeTabId,
    onTabChange: () => { console.log('onTabChange not implemented'); }
  };

  const {
    myPlayerProfile,
    myPlayerSeat,
    myPrivatePlayerKnowledgeStr,
    // onSelfPlayerActionStr,
    onPlayerAction,
  } = playerGameDetails;

  return (
    <BfgGameScreenFrame
      tabsConfig={tabsConfig}
      gameMetadata={gameMetadata}
      gameTable={gameTable}
      allPlayerProfiles={allPlayerProfiles}
      gameState={latestHostGameState}
      gameActions={gameActions}
    >
      {myPlayerSeat ? (
        <PlayerGameView
          myPlayerSeat={myPlayerSeat}
          myPlayerProfile={myPlayerProfile}
          gameTable={gameTable}
          gameActions={gameActions}
          peers={peers}
          peerPlayerIds={peerPlayerIds}
          allPlayerProfiles={allPlayerProfiles}
          myPrivatePlayerKnowledgeStr={myPrivatePlayerKnowledgeStr}
          onPlayerAction={onPlayerAction}
        />
      ) : (
        <div>You are not a player of this game table</div>
      )}
    </BfgGameScreenFrame>
  )
}
