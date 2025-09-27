import { createFileRoute } from '@tanstack/react-router'
import { useMyDefaultPlayerProfile } from '~/hooks/stores/use-my-player-profiles-store'
import { GameTableId } from '~/types/core/branded-values/bfg-branded-ids'
import { PlayerP2pGameComponent } from '~/components/p2p/player-p2p-game-component'


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
  

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Player Game</h1>
      <PlayerP2pGameComponent
        gameTableId={gameTableId}
        playerProfile={myPlayerProfile}
      />
    </div>
  )
}
