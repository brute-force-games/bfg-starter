import { createFileRoute } from '@tanstack/react-router'
import { useMyDefaultPlayerProfile } from '~/hooks/stores/use-my-player-profiles-store'
import { usePlayerP2pGame } from '~/hooks/p2p/use-player-p2p-game'
import { GameTableId } from '~/types/core/branded-values/bfg-branded-ids'


export const Route = createFileRoute('/games/$tableId')({
  component: PlayerGamePage,
})

function PlayerGamePage() {
  const { tableId } = Route.useParams()
  const gameTableId = tableId as GameTableId
  
  const myPlayerProfile = useMyDefaultPlayerProfile();

  if (!myPlayerProfile) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Game...</h1>
        <div className="text-gray-600">Loading game details...</div>
      </div>
    )
  }
  

  const p2pGame = usePlayerP2pGame(gameTableId, myPlayerProfile)


  // if (!hostedGame) {
  //   return (
  //     <div className="p-6">
  //       <h1 className="text-3xl font-bold mb-6">Loading Game...</h1>
  //       <div className="text-gray-600">Loading game details...</div>
  //     </div>
  //   )
  // }

  // const joinLink = createJoinGameUrl(gameTableId);
  // const fullJoinUrl = `${window.location.origin}${joinLink}`;

  // const copyToClipboard = async () => {
  //   try {
  //     await navigator.clipboard.writeText(fullJoinUrl);
  //     setCopySuccess(true);
  //     setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
  //   } catch (err) {
  //     console.error('Failed to copy: ', err);
  //   }
  // };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Player Game</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Game Details</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Game Title:</span>
                {/* <span className="ml-2">{hostedGame.gameTitle}</span> */}
              </div>
              <div>
                <span className="font-medium">Game ID:</span>
                {/* <span className="ml-2 font-mono text-sm">{hostedGame.id}</span> */}
              </div>
              <div>
                <span className="font-medium">Status:</span>
                {/* <span className="ml-2">{hostedGame.currentStatusDescription}</span> */}
              </div>
              <div>
                <span className="font-medium">Phase:</span>
                {/* <span className="ml-2">{hostedGame.tablePhase}</span> */}
              </div>
              <div>
                <span className="font-medium">Created:</span>
                {/* <span className="ml-2">{new Date(hostedGame.createdAt).toLocaleString()}</span> */}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
