import { GameLobby } from "~/models/p2p-lobby"
import { PrivatePlayerProfile } from "~/models/private-player-profile"


interface ILobbyPlayerJoinGameComponentProps {
  // lobbyOptions: LobbyOptions
  lobbyState: GameLobby
  currentPlayerProfile?: PrivatePlayerProfile

  // onSelectGameChoice: (gameChoice: BfgSupportedGameTitles) => void
  // onTakeSeat: () => void
  // onLeaveSeat: () => void
}

export const LobbyPlayerJoinGameComponent = ({ 
  // lobbyOptions,
  lobbyState,
  currentPlayerProfile,
  // onSelectGameChoice,
  // onTakeSeat,
  // onLeaveSeat,
}: ILobbyPlayerJoinGameComponentProps) => {

  // const handleGameChoice = (gameChoice: BfgSupportedGameTitles) => {
  //   console.log('Selecting game choice:', gameChoice);
  //   onSelectGameChoice(gameChoice);
  // };

  // const handleTakeSeat = () => {
  //   onTakeSeat();
  // };

  // const handleLeaveSeat = () => {
  //   onLeaveSeat();
  // };

  // Check if the current player is already in the lobby
  // const isPlayerAlreadyInLobby = currentPlayerProfile 
  //   ? lobbyState.playerPool.includes(currentPlayerProfile.id)
  //   : false;

  return (
    <div>
      <a href={lobbyState.gameLink} target="_blank" rel="noopener noreferrer">{lobbyState.gameLink}</a>
    </div>
  )
}
