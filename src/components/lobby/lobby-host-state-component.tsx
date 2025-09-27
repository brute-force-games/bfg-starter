import { GameLobby } from "~/models/p2p-lobby"
import { createPlayerGameUrl } from "~/router-links"
import { BfgGameTableId, PlayerProfileId } from "~/types/core/branded-values/bfg-branded-ids"
import { PublicPlayerProfile } from "~/models/public-player-profile"
import { asHostStartNewGame } from "~/data/game-table-ops/as-host-start-game"
import { useState } from "react"


interface ILobbyStateComponentProps {
  playerProfiles: Map<PlayerProfileId, PublicPlayerProfile>
  lobbyState: GameLobby
  updateLobbyState: (lobbyState: GameLobby) => void
  setLobbyPlayerPool: (playerPool: PlayerProfileId[]) => void
}

export const LobbyStateComponent = ({
  playerProfiles,
  lobbyState,
  updateLobbyState,
  setLobbyPlayerPool,
}: ILobbyStateComponentProps) => {
  const [isStartingGame, setIsStartingGame] = useState(false);

  const startGame = async () => {
    if (!lobbyState.gameTitle) {
      alert('Please select a game title first');
      return;
    }

    // Prevent multiple calls
    if (isStartingGame) {
      console.log("Game is already starting, ignoring duplicate request");
      return;
    }

    setIsStartingGame(true);
    
    try {
      const newGameTableId = BfgGameTableId.createId();
      
      console.log("starting game", lobbyState);
      const gameTable = await asHostStartNewGame(lobbyState, newGameTableId);
      // const gameTableId = gameTable.id;
      console.log("NEW GAME TABLE", gameTable);

      const gameLink = createPlayerGameUrl(newGameTableId);
      updateLobbyState({ ...lobbyState, gameLink, gameTableId: newGameTableId });
    } catch (error) {
      console.error("Error starting game:", error);
    } finally {
      setIsStartingGame(false);
    }
  }

  const playerPoolHandles = lobbyState.playerPool.map(playerId => {
    const playerProfile = playerProfiles.get(playerId);
    if (!playerProfile) {
      // console.error('Player profile not found for player ID:', playerId);
      // console.error('playerProfiles', playerProfiles);

      return (
        <div key={playerId}>
          {playerId} (name not available)
        </div>
      );
    }
    return (
      <div key={playerId}>
        {playerProfile.handle}
      </div>
    )
  })

  const isGameStarted = lobbyState.gameLink !== undefined;
  const hostingLink = `${window.location.origin}/hosted-games/${lobbyState.gameTableId}`;

  return (
    <>
      <div>
        Lobby State {lobbyState.lobbyName}
      </div>
      <div> 
        Game Title - {lobbyState.gameTitle}
      </div>
      <div>
        Game Link - {lobbyState.gameLink}
      </div>
      <div>
        Hosting Link - <a href={hostingLink} target="_blank" rel="noopener noreferrer">{hostingLink}</a>
      </div>
      <div>
        Player Pool - 
        <>{playerPoolHandles}</>
      </div>
      <div>
        <button 
          onClick={() => updateLobbyState({ ...lobbyState, gameTitle: undefined })}
          disabled={isGameStarted}
        >
          Clear Game
        </button>
        <button
          onClick={() => setLobbyPlayerPool([])}
          disabled={isGameStarted}
        >
          Clear Seats
        </button>
        <button 
          onClick={() => startGame()}
          // disabled={isGameStarted || isStartingGame}
        >
          {isStartingGame ? "Starting Game..." : "Start Game"}
        </button>
      </div>
    </>
  )
}
