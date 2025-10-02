import { GameLobby } from "~/models/p2p-lobby"
import { PrivatePlayerProfile } from "~/models/private-player-profile"


interface ILobbyPlayerJoinGameComponentProps {
  lobbyState: GameLobby
  currentPlayerProfile?: PrivatePlayerProfile
}

export const LobbyPlayerJoinGameComponent = ({ 
  lobbyState,
  currentPlayerProfile,
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-green-100 mb-4">
          <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        {/* Main Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🎮 Game Has Started!
        </h2>
        
        <p className="text-lg text-gray-600 mb-6">
          The game is now live and ready to play. Click the link below to join the action!
        </p>
        
        {/* Game Link Button */}
        <div className="space-y-4">
          <a 
            href={lobbyState.gameLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Join Game Now
          </a>
          
          {/* Additional Info */}
          <div className="text-sm text-gray-500">
            This link will open in a new tab
          </div>
        </div>
      </div>
    </div>
  )
}
