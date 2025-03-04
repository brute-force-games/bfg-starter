import { useLiveLobby } from "~/data/bfg-db-lobbies";
import { Typography } from "@mui/material";
import { DbGameLobbyId } from "~/types/core/branded-values/branded-strings";
import { createLobbyUrl } from "~/router-links";
import { Link } from "react-router";


interface ILobbyDetailsComponentProps {
  lobbyId: DbGameLobbyId;
}

export const LobbyDetailsComponent = ({ lobbyId }: ILobbyDetailsComponentProps) => {

  const lobby = useLiveLobby(lobbyId);

  console.log("LobbyDetailsComponent: lobby", lobby);

  return (
    <div>
      <Typography variant="h4">
        <Link to={createLobbyUrl(lobbyId)}>
          Lobby Details
        </Link>
      </Typography>
      <Typography>Lobby ID: {lobbyId}</Typography>
      <Typography>Lobby Game: {lobby?.gameTitle}</Typography>
      <Typography>Lobby Host: {lobby?.gameHostPlayerId}</Typography>
      <Typography>Lobby Min Players: {lobby?.lobbyMinNumPlayers}</Typography>
      <Typography>Lobby Max Players: {lobby?.lobbyMaxNumPlayers}</Typography>
    </div>
  );
};
