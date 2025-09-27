import { TrysteroConfig } from "~/p2p/trystero-config"
import { joinRoom } from "trystero"
import { IPlayerP2pPublicDetails } from "~/models/p2p-details"
import { useEffect } from "react"
import { PublicPlayerProfile } from "~/models/public-player-profile"
import { GameTableId } from "~/types/core/branded-values/bfg-branded-ids"


interface IPlayerP2pGameComponentProps {
  // hostedGame: GameTable
  // gameActions: DbGameTableAction[]
  gameTableId: GameTableId
  playerProfile: PublicPlayerProfile
}

export const PlayerP2pGameComponent = ({ gameTableId, playerProfile }: IPlayerP2pGameComponentProps) => {
  // const gameTableId = hostedGame.id


  const room = joinRoom(TrysteroConfig, gameTableId);

  const playerP2pDetails: IPlayerP2pPublicDetails = {
    playerProfile: playerProfile,
  }

  const [sendPublicPlayerData, getPublicPlayerData] = room.makeAction<IPlayerP2pPublicDetails>('player-data')


  useEffect(() => {
    sendPublicPlayerData(playerP2pDetails)
  }, [sendPublicPlayerData, playerP2pDetails])


  return (
    <div>
      Player P2p Game - {playerProfile.handle} - {gameTableId}
    </div>
  )
}
