import { z } from "zod"
import { HostedGameView } from "~/components/hosted-game-view/hosted-game-view"
import { matchPlayerToSeat } from "~/data/game-table-ops/player-seat-utils"
import { useP2pGame } from "~/hooks/p2p/use-p2p-game"
import { useGameActions } from "~/hooks/stores/use-game-actions-store"
import { useHostedGame } from "~/hooks/stores/use-hosted-games-store"
import { useMyDefaultPlayerProfile } from "~/hooks/stores/use-my-player-profiles-store"
import { PlayerP2pGameMove } from "~/models/p2p-details"
import { GameTableId } from "~/types/core/branded-values/bfg-branded-ids"


interface HostedP2pGameComponentProps {
  gameTableId: GameTableId
}


export const HostedP2pGameComponent = <GameSpecificAction extends z.ZodTypeAny>({ gameTableId }: HostedP2pGameComponentProps) => {

  const hostPlayerProfile = useMyDefaultPlayerProfile()
  const hostedGame = useHostedGame(gameTableId)
  const gameActions = useGameActions(gameTableId)
  const p2pGame = useP2pGame(gameTableId, hostPlayerProfile);

  if (!hostPlayerProfile) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Profile...</h1>
        <div className="text-gray-600">Loading profile details...</div>
      </div>
    )
  }

  if (!hostedGame) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Loading Game...</h1>
        <div className="text-gray-600">Loading game details...</div>
      </div>
    )
  }

  const myPlayerSeat = matchPlayerToSeat(hostPlayerProfile.id, hostedGame);

  if (!myPlayerSeat) {
    console.log("You are not at this game table")
    console.log("hostedGame", hostedGame)
    console.log("myPlayerSeat", myPlayerSeat)
    console.log("hostPlayerProfile.id", hostPlayerProfile.id)
    console.log("hostedGame.gameHostPlayerProfileId", hostedGame.gameHostPlayerProfileId)
    return <div>You are not at this game table</div>;
  }

  const onPlayerGameAction = (playerAction: z.infer<GameSpecificAction>) => {
    p2pGame.sendPlayerMove(playerAction);
  }

  const { getPlayerMove } = p2pGame;

  getPlayerMove(async (move: PlayerP2pGameMove, peer: string) => {
    console.log('Received player move from peer:', peer, move);
  })

  return (

    <HostedGameView
      myPlayerProfile={hostPlayerProfile}
      onPlayerGameAction={onPlayerGameAction}
      myPlayerSeat={myPlayerSeat}
      hostedGame={hostedGame}
      gameActions={gameActions}
      // p2pGame={p2pGame}
    />
  )
}