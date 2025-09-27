// import { GameTable } from "~/models/game-table/game-table"
// import { DbGameTableAction } from "~/models/game-table/game-table-action"
// import { TrysteroConfig } from "~/p2p/trystero-config"
// import { joinRoom } from "trystero"
// import { useEffect } from "react"
// import { PublicPlayerProfile } from "~/models/public-player-profile"


// interface IHostedP2pGameComponentProps {
//   hostPlayerProfile: PublicPlayerProfile
//   hostedGame: GameTable
//   gameActions: DbGameTableAction[]
// }

// export const HostedP2pGameComponent = ({
//   hostPlayerProfile,
//   hostedGame,
//   gameActions,
// }: IHostedP2pGameComponentProps) => {
//   const gameTableId = hostedGame.id


//   const room = joinRoom(TrysteroConfig, gameTableId);

//   const hostedP2pDetails: IHostedP2pPublicDetails = {
//     hostPlayerProfile: hostPlayerProfile,
//     hostedGame: hostedGame,
//     gameActions: gameActions,
//   }

//   const [sendPublicHostData, getPublicHostData] = room.makeAction<IHostedP2pPublicDetails>('host-data')


//   useEffect(() => {
//     sendPublicHostData(hostedP2pDetails)
//   }, [sendPublicHostData, hostedP2pDetails])


//   return (
//     <div>
//       Hosted P2p Game - {hostedGame.gameTitle}, {gameActions.length} action - {gameTableId}
//     </div>
//   )
// }
