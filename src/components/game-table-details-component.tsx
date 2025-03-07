import { Button } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router";
import { shareGameTableWithFriends } from "~/data/bfg-db-game-tables";
import { ShareWithFriendsDialog } from "~/dialogs/share-with-friends-dialog";
import { useBfgWhoAmIContext } from "~/state/who-am-i/BfgWhoAmIContext";
import { DbGameFriendId, DbGameTableId } from "~/types/core/branded-values/branded-strings";
import { DbGameTable } from "~/types/core/game-table/game-table";


interface IGameTableDetailsComponentProps {
  gameTable: DbGameTable;
}

export const GameTableDetailsComponent = ({ gameTable }: IGameTableDetailsComponentProps) => {

  const { playerId } = useBfgWhoAmIContext();

  const [openShareDialog, setOpenShareDialog] = useState(false);

  console.log("GameTableDetailsComponent: playerId", playerId);
  console.log("GameTableDetailsComponent: gameTable.gameHostPlayerId", gameTable.gameHostPlayerId);


  const handleShare = async(gameTableId: DbGameTableId, friendIds: DbGameFriendId[]) => {
    console.log("Sharing game table", gameTableId, "with friends", friendIds);
    await shareGameTableWithFriends(gameTableId, friendIds);
  };


  return (
    <>
      <div>Game Table Details</div>
      <div>Game Started: {gameTable.createdAt.toLocaleString()}</div>
      <div>Game Phase: {gameTable.tablePhase}</div>
      
      <div><Link to={`/game-tables/${gameTable.id}/seat`}>Take Seat</Link></div>
      <div><Link to={`/game-tables/${gameTable.id}/actions`}>Game Actions</Link></div>
      <div><Link to={`/game-tables/${gameTable.id}/next-action`}>Next Action</Link></div>

      <div>My Table? {gameTable.gameHostPlayerId === playerId ? "Yes" : "No"}</div>
      <div>Shared with: {gameTable.sharedWith.map(friendId => friendId).join(', ')}</div>
      
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenShareDialog(true)}
      >
        Share with Friends
      </Button>

      <p>P1: {gameTable.p1}</p>
      <p>P2: {gameTable.p2}</p>
      <p>P3: {gameTable.p3}</p>
      <p>P4: {gameTable.p4}</p>
      <p>P5: {gameTable.p5}</p>
      <p>P6: {gameTable.p6}</p>
      <p>P7: {gameTable.p7}</p>

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
