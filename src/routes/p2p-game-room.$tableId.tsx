import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { P2pGameRoomContextProvider, useP2pGameRoomContext } from '@bfg-engine/hooks/p2p/game/p2p-game-room-context'
import { BfgGameTableIdToolbox } from '@bfg-engine/models/types/bfg-branded-uuids'
import { useLatestHostedGameIdentifiers } from '@bfg-engine/tb-store/game-instance-store'


// const trysteroConfig = {appId: 'gbthurn-und-taxis-99'}


const paramsSchema = z.object({
  tableId: BfgGameTableIdToolbox.idSchema,
})


export const P2pGameRoom = () => {
  const p2pGameRoomContext = useP2pGameRoomContext();

  return (
    <div>
      <h1>P2p Game Room</h1>
      <p>Table ID: {p2pGameRoomContext.gameTableId}</p>
    </div>
  )
}

export const P2pGameRoomRoute = () => {
  const { tableId } = Route.useParams();

  const { gameInstanceId, gameTableId, gameRoomId } = useLatestHostedGameIdentifiers(tableId);

  return (
    <P2pGameRoomContextProvider
      gameInstanceId={gameInstanceId}
      gameTableId={gameTableId}
      gameRoomId={gameRoomId}
      requestedRole="watch"
    >
      <P2pGameRoom />
    </P2pGameRoomContextProvider>
  )
  
  // const room = joinRoom(trysteroConfig, roomId)
  // const [sendColor, getColor] = room.makeAction('color')
  // const [myColor, setMyColor] = useState('#c0ffee')
  // const [peerColors, setPeerColors] = useState({})

  // // whenever new peers join the room, send my color to them:
  // room.onPeerJoin(peer => sendColor(myColor, peer))

  // // listen for peers sending their colors and update the state accordingly:
  // getColor((color, peer) =>
  //   setPeerColors(peerColors => ({...peerColors, [peer]: color}))
  // )

  // const updateColor = e => {
  //   const {value} = e.target

  //   // when updating my own color, broadcast it to all peers:
  //   sendColor(value)
  //   setMyColor(value)
  // }

  // return (
  //   <>
  //     <h1>Trystero + React</h1>

  //     <h2>My color:</h2>
  //     <input type="color" value={myColor} onChange={updateColor} />

  //     <h2>Peer colors:</h2>
  //     <ul>
  //       {Object.entries(peerColors).map(([peerId, color]) => (
  //         <li key={peerId} style={{backgroundColor: color}}>
  //           {peerId}: {color}
  //         </li>
  //       ))}
  //     </ul>
  //   </>
  // )
}


export const Route = createFileRoute('/p2p-game-room/$tableId')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ tableId: params.tableId }),
  },
  component: P2pGameRoomRoute,
})

// params: {
//   parse: (params) => paramsSchema.parse(params),
//   stringify: (params) => ({ lobbyId: params.lobbyId }),
// },
// validateSearch: searchSchema, // Standard Schema validation
// component: JoinLobbyRoute,