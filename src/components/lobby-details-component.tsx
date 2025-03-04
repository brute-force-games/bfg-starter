import { shareLobbyWithFriends, updateLobbyDescription, useLiveLobby, useLiveLobbyField } from "~/data/bfg-db-lobbies";
import { Typography, Button, Stack } from "@mui/material";
import { DbGameLobbyId } from "~/types/core/branded-values/branded-strings";
import { createLobbyUrl } from "~/router-links";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { ShareWithFriendsDialog } from "~/dialogs/share-with-friends-dialog";
import { DbGameFriendId } from "~/types/core/branded-values/branded-strings";
import { bfgDb } from "~/data/bfg-db";


interface ILobbyDetailsComponentProps {
  lobbyId: DbGameLobbyId;
}

export const LobbyDetailsComponent = ({ lobbyId }: ILobbyDetailsComponentProps) => {
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [timer, setTimer] = useState(0);
  const lobby = useLiveLobby(lobbyId);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
      bfgDb.cloud.sync({purpose: 'pull', wait: false}) 
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleShare = async(lobbyId: DbGameLobbyId, friendIds: DbGameFriendId[]) => {
    console.log("Sharing lobby", lobbyId, "with friends", friendIds);
    await shareLobbyWithFriends(lobbyId, friendIds);
  };

  const updateDescription = async () => {
    const description = lobby?.description + "x";
    await updateLobbyDescription(lobbyId, description);
    bfgDb.cloud.sync({purpose: 'push', wait: false}) ;
  }


  const lobbyDescription = useLiveLobbyField(lobbyId, 'description');


  return (
    <div>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h4">
            <Link to={createLobbyUrl(lobbyId)}>
              Lobby Details
            </Link>
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenShareDialog(true)}
          >
            Share with Friends
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={updateDescription}
          >
            Update Description
          </Button>
        </Stack>
        
        <Typography>Timer: {timer} ticks</Typography>
        <Typography>Lobby Game: {lobby?.gameTitle}</Typography>
        <Typography>Lobby Description: [{lobbyDescription?.length}]  {lobbyDescription}</Typography>
        <Typography>Owner: {lobby?.owner}</Typography>
        <Typography>Lobby Host: {lobby?.gameHostPlayerId}</Typography>
        <Typography>Lobby Min Players: {lobby?.lobbyMinNumPlayers}</Typography>
        <Typography>Lobby Max Players: {lobby?.lobbyMaxNumPlayers}</Typography>
      </Stack>

      {openShareDialog && (
        <ShareWithFriendsDialog
          onShare={handleShare}
          onClose={() => setOpenShareDialog(false)}
        />
      )}
    </div>
  );
};
