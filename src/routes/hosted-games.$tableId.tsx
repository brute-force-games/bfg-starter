import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { HostedP2pGameComponent } from '~/components/p2p/hosted-p2p-game-component'
import { useGameActions } from '~/hooks/stores/use-game-actions-store'
import { useHostedGame } from '~/hooks/stores/use-hosted-games-store'
import { createJoinGameUrl } from '~/router-links'
import { GameTableId } from '~/types/core/branded-values/bfg-branded-ids'


export const Route = createFileRoute('/hosted-games/$tableId')({
  component: HostedGamePage,
})


function HostedGamePage() {
  const { tableId } = Route.useParams();
  const gameTableId = tableId as GameTableId;

  const hostedGame = useHostedGame(gameTableId);
  const gameActions = useGameActions(gameTableId);
  const [copySuccess, setCopySuccess] = useState(false);

  const joinLink = createJoinGameUrl(gameTableId);
  const fullJoinUrl = `${window.location.origin}${joinLink}`;

  const copyJoinUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullJoinUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Hosted Game</h1>

      <HostedP2pGameComponent
        gameTableId={gameTableId}
      />

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Game Details</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Game Title:</span>
                <span className="ml-2">{hostedGame?.gameTitle}</span>
              </div>
              <div>
                <span className="font-medium">Game ID:</span>
                <span className="ml-2 font-mono text-sm">{hostedGame?.id}</span>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <span className="ml-2">{hostedGame?.currentStatusDescription}</span>
              </div>
              <div>
                <span className="font-medium">Phase:</span>
                <span className="ml-2">{hostedGame?.tablePhase}</span>
              </div>
              <div>
                <span className="font-medium">Created:</span>
                <span className="ml-2">{ hostedGame ? new Date(hostedGame.createdAt).toLocaleString() : ''}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Game Actions</h2>
            <div className="space-y-3">
              {gameActions.map((action, index) => (
                <div key={index}>{action.actionType} [{action.source}] - {action.actionJson}</div>
              ))}
            </div>
            <div className="space-y-3">
              {/* Copy Join Link Button */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Join Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={fullJoinUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
                  />
                  <button
                    onClick={copyJoinUrlToClipboard}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      copySuccess
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {copySuccess ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* {hostedGame.tablePhase === 'table-phase-lobby' && (
                <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Manage Lobby
                </button>
              )} */}
              
              {/* {hostedGame.tablePhase === 'table-phase-game-in-progress' && (
                <button className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Continue Game
                </button>
              )}
              
              <button className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                Share Game
              </button>
              
              <button className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                End Game
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
