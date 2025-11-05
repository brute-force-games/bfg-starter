// import { P2pConnectionComponent } from "@bfg-engine/ui/components/p2p-connection-component"
// import { GameTableId } from "@bfg-engine/models/types/bfg-branded-ids"
// import { BfgPlayerGameBar, PlayerGameTabId } from "~/routes/games.$tableId/-components";
// import { PrivatePlayerProfile } from "@bfg-engine/models/player-profile/private-player-profile";
// import { usePlayerP2pGame } from "@bfg-engine/hooks/p2p/game/use-player-p2p-game";
// import { useP2pGameRoomAsPlayer } from "@bfg-engine/hooks/p2p/game/use-bfg-game-room";


// interface IP2pDetailsPlayerPageProps {
//   tableId: GameTableId;
//   myPlayerProfile: PrivatePlayerProfile;
// }

// export const P2pDetailsPlayerPage = ({ tableId, myPlayerProfile }: IP2pDetailsPlayerPageProps) => {

//   const activeTabId: PlayerGameTabId = '/games/$tableId/p2p-details';

//   // const p2pGame = usePlayerP2pGame(tableId, myPlayerProfile);
//   const p2pGame = useP2pGameRoomAsPlayer();
//   if (!p2pGame) {
//     return <div>Loading P2P game...</div>;
//   }

//   const { connectionStatus, connectionEvents, peers, peerPlayerIds, allPlayerProfiles } = p2pGame.p2pDetails;

//   const refreshConnection = () => {
//     console.error('refreshConnection not implemented');
//   }

//   return (
//     <>
//       <BfgPlayerGameBar 
//         activeTabId={activeTabId}
//       />
//       <P2pConnectionComponent
//         connectionStatus={connectionStatus}
//         connectionEvents={connectionEvents}
//         peers={peers}
//         myPeerPlayer={myPlayerProfile}
//         peerPlayerIds={peerPlayerIds}
//         allPlayerProfiles={allPlayerProfiles}
//         onRefreshConnection={refreshConnection}
//       />
//     </>
//   )
// }
