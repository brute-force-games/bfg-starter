// import { z } from 'zod'
// import { createFileRoute } from '@tanstack/react-router'
// import { BfgGameInstanceIdToolbox } from '@bfg-engine/models/types/bfg-branded-uuids'
// import { useLatestHostedGameIdentifiers } from '@bfg-engine/tb-store/game-instance-store'
// import { P2pRawRoomContextProvider } from '../../modules/bfg-engine/src/hooks/p2p/game/p2p-raw-room-context'
// import { useP2pGameRoom } from '../../modules/bfg-engine/src/hooks/p2p/game/p2p-game-room-hook'


// const paramsSchema = z.object({
//   gameId: BfgGameInstanceIdToolbox.idSchema,
// })


// export const P2pGameRoom = () => {
//   const p2pGameRoomContext = useP2pGameRoom();
//   // const p2pGameRoomContext = useP2pRawRoomContext();
//   // const gameRoom = adaptToGameRoomAsHost(gameRoomUnknown);

//   return (
//     <div>
//       <h1>P2p Game Room</h1>
//       <p>Game Instance ID: {p2pGameRoomContext.gameInstanceId}</p>
//     </div>
//   )
// }

// export const P2pGameRoomRoute = () => {
//   const { gameId } = Route.useParams();

//   const hostedGameIdentifiers = useLatestHostedGameIdentifiers(gameId);
//   if (!hostedGameIdentifiers) {
//     return <div>Not hosting this game: {gameId}</div>;
//   }
//   // const { gameTableId, gameRoomId } = hostedGameIdentifiers;

//   return (
//     <P2pRawRoomContextProvider
//       gameInstanceId={gameId}
//       requestedAction="watch"
//     >
//       <P2pGameRoom />
//     </P2pRawRoomContextProvider>
//   )
  
//   // const room = joinRoom(trysteroConfig, roomId)
//   // const [sendColor, getColor] = room.makeAction('color')
//   // const [myColor, setMyColor] = useState('#c0ffee')
//   // const [peerColors, setPeerColors] = useState({})

//   // // whenever new peers join the room, send my color to them:
//   // room.onPeerJoin(peer => sendColor(myColor, peer))

//   // // listen for peers sending their colors and update the state accordingly:
//   // getColor((color, peer) =>
//   //   setPeerColors(peerColors => ({...peerColors, [peer]: color}))
//   // )

//   // const updateColor = e => {
//   //   const {value} = e.target

//   //   // when updating my own color, broadcast it to all peers:
//   //   sendColor(value)
//   //   setMyColor(value)
//   // }

//   // return (
//   //   <>
//   //     <h1>Trystero + React</h1>

//   //     <h2>My color:</h2>
//   //     <input type="color" value={myColor} onChange={updateColor} />

//   //     <h2>Peer colors:</h2>
//   //     <ul>
//   //       {Object.entries(peerColors).map(([peerId, color]) => (
//   //         <li key={peerId} style={{backgroundColor: color}}>
//   //           {peerId}: {color}
//   //         </li>
//   //       ))}
//   //     </ul>
//   //   </>
//   // )
// }


// export const Route = createFileRoute('/p2p-game-room/$gameId')({
//   params: {
//     parse: (params) => paramsSchema.parse(params),
//     stringify: (params) => ({ gameId: params.gameId }),
//   },
//   component: P2pGameRoomRoute,
// })

// // params: {
// //   parse: (params) => paramsSchema.parse(params),
// //   stringify: (params) => ({ lobbyId: params.lobbyId }),
// // },
// // validateSearch: searchSchema, // Standard Schema validation
// // component: JoinLobbyRoute,