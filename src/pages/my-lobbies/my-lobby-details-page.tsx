import { useLiveLobby } from "~/data/bfg-db-lobbies";
import { useParams } from "react-router-dom";
import { GameLobbyId } from "~/types/core/branded-values/bfg-branded-ids";
import { LobbyDetailsComponent } from "~/components/lobby-details-component";


export const MyLobbyDetailsPage = () => {
  const { lobbyId } = useParams();

  if (!lobbyId) {
    throw new Error("Lobby ID is required");
  }

  const dbGameLobbyId = GameLobbyId.parseId(lobbyId);

  const lobby = useLiveLobby(dbGameLobbyId);


  // // Monitor a single field
  // const lobbyStatus = useLiveLobbyField(lobbyId, 'status');

  // // Monitor multiple fields
  // const { status, description } = useLiveLobbyFields(lobbyId, ['status', 'description']) || {};

  // // Monitor all lobbies with a specific status
  // const activeLobbies = useLiveLobbiesByField('status', 'lobby-status-valid');

  return (
    <>
      <div>My Lobby Details</div>
      <LobbyDetailsComponent lobbyId={dbGameLobbyId} />
      <div>
        <pre>
          {JSON.stringify(lobby, null, 2)}
        </pre>
      </div>
    </>
  );
}
