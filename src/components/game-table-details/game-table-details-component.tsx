import { Button } from "@mui/material";
import { useState } from "react";
import { shareGameTableWithFriends } from "~/data/bfg-db-game-tables";
import { ShareWithFriendsDialog } from "~/dialogs/share-with-friends-dialog";
import { useBfgWhoAmIContext } from "~/state/who-am-i/BfgWhoAmIContext";
import { DbGameFriendId, DbGameTableId } from "~/types/core/branded-values/branded-strings";
import { DbGameTable } from "~/types/core/game-table/game-table";
import { GameTablePlayerOptionsComponent } from "./game-table-player-options-component";
import { getBfgGameMetadata } from "~/types/bfg-game-engines/bfg-game-engines";
import { GameTableSeatDetailsComponent } from "./game-seat-details-component";


interface IGameTableDetailsComponentProps {
  gameTable: DbGameTable;
}

export const GameTableDetailsComponent = ({ gameTable }: IGameTableDetailsComponentProps) => {

  const { playerId } = useBfgWhoAmIContext();

  const [openShareDialog, setOpenShareDialog] = useState(false);

  if (!playerId) {
    return <div>Loading Player ID...</div>;
  }

  console.log("GameTableDetailsComponent: playerId", playerId);
  console.log("GameTableDetailsComponent: gameTable.gameHostPlayerId", gameTable.gameHostPlayerId);

  const gameEngineMetadata = getBfgGameMetadata(gameTable);
  const maxNumPlayers = gameEngineMetadata.definition.maxNumPlayersForGame;


  const handleShare = async(gameTableId: DbGameTableId, friendIds: DbGameFriendId[]) => {
    console.log("Sharing game table", gameTableId, "with friends", friendIds);
    await shareGameTableWithFriends(gameTableId, friendIds);
  };


  // const SeatDetailsComponent = ({ gameSeat }: { gameSeat: GameTableSeat }) => {
  //   if (gameTable.tablePhase === "table-phase-lobby") {
  //     switch (gameSeat) {
  //       case "p1":
  //         return (
  //           <p>P1: {gameTable.p1}</p>
  //         )
  //       case "p2":
  //         return (
  //           maxNumPlayers > 1 && (
  //             <p>P2: {gameTable.p2}</p>
  //           )
  //         )
  //       case "p3":
  //         return (
  //           maxNumPlayers > 2 && (
  //             <p>P3: {gameTable.p3}</p>
  //           )
  //         )
  //       case "p4":
  //         return (
  //           maxNumPlayers > 3 && (
  //             <p>P4: {gameTable.p4}</p>
  //           )
  //         )
  //       case "p5":
  //         return (
  //           maxNumPlayers > 4 && (
  //             <p>P5: {gameTable.p5}</p>
  //           )
  //         )
  //       case "p6":
  //         return (
  //           maxNumPlayers > 5 && (
  //             <p>P6: {gameTable.p6}</p>
  //           )
  //         )
  //       case "p7":
  //         return (
  //           maxNumPlayers > 6 && (
  //             <p>P7: {gameTable.p7}</p>
  //           )
  //         )
  //       case "p8":
  //         return (
  //           maxNumPlayers > 7 && (
  //             <p>P8: {gameTable.p8}</p>
  //           )
  //         )
  //       default:
  //         return null;
  //     }
  //   }

  //   if (gameTable.tablePhase === "table-phase-game-in-progress") {
  //     const playerSeat = gameTable[gameSeat];

  //     if (!playerSeat) {
  //       return null;
  //     }
      
  //     return (
  //       <p>Game in progress - {gameSeat.toUpperCase()}</p>
  //     )
  //   }
    
  //   return (
  //     <div>
  //       <p>P1: {gameTable.p1}</p>
  //     </div>
  //   );
  // }


  return (
    <>
      <div>Game Table Details for {gameTable.gameTitle}</div>
      <div>Game Started: {gameTable.createdAt.toLocaleString()}</div>
      <div>Game Phase: {gameTable.tablePhase}</div>

      <GameTablePlayerOptionsComponent myPlayerId={playerId} gameTable={gameTable} />
      
      {/* <div><Link to={`/game-tables/${gameTable.id}/seat`}>Take Seat</Link></div>
      <div><Link to={`/game-tables/${gameTable.id}/actions`}>Game Actions</Link></div>
      <div><Link to={`/game-tables/${gameTable.id}/next-action`}>Next Action</Link></div> */}

      <div>My Table? {gameTable.gameHostPlayerId === playerId ? "Yes" : "No"}</div>
      <div>Shared with: {gameTable.sharedWith.map(friendId => friendId).join(', ')}</div>
      
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenShareDialog(true)}
      >
        Share with Friends
      </Button>

      <GameTableSeatDetailsComponent gameSeat="p1" gameTable={gameTable} maxNumPlayers={maxNumPlayers} />
      <GameTableSeatDetailsComponent gameSeat="p2" gameTable={gameTable} maxNumPlayers={maxNumPlayers} />
      <GameTableSeatDetailsComponent gameSeat="p3" gameTable={gameTable} maxNumPlayers={maxNumPlayers} />
      <GameTableSeatDetailsComponent gameSeat="p4" gameTable={gameTable} maxNumPlayers={maxNumPlayers} />
      <GameTableSeatDetailsComponent gameSeat="p5" gameTable={gameTable} maxNumPlayers={maxNumPlayers} />
      <GameTableSeatDetailsComponent gameSeat="p6" gameTable={gameTable} maxNumPlayers={maxNumPlayers} />
      <GameTableSeatDetailsComponent gameSeat="p7" gameTable={gameTable} maxNumPlayers={maxNumPlayers} />
      <GameTableSeatDetailsComponent gameSeat="p8" gameTable={gameTable} maxNumPlayers={maxNumPlayers} />
      
{/* 
      <p>P1: {gameTable.p1}</p>
      {
        maxNumPlayers > 1 && (
          <p>P2: {gameTable.p2}</p>
        )
      }
      {
        maxNumPlayers > 2 && (
          <p>P3: {gameTable.p3}</p>
        )
      }
      {
        maxNumPlayers > 3 && (
          <p>P4: {gameTable.p4}</p>
        )
      }
      {
        maxNumPlayers > 4 && (
          <p>P5: {gameTable.p5}</p>
        )
      }
      {
        maxNumPlayers > 5 && (
          <p>P6: {gameTable.p6}</p>
        )
      }
      {
        maxNumPlayers > 6 && (
          <p>P7: {gameTable.p7}</p>
        )
      }
      {
        maxNumPlayers > 7 && (
          <p>P8: {gameTable.p8}</p>
        )
      } */}
      

      {
        openShareDialog && (
          <ShareWithFriendsDialog
            onShare={handleShare}
            onClose={() => setOpenShareDialog(false)}
          />
        )
      }
    </>
  );
}
