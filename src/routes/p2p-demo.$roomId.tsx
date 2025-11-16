import { z } from 'zod'
import {joinRoom} from 'trystero'
import {useState} from 'react'
import { createFileRoute } from '@tanstack/react-router'


const trysteroConfig = {appId: 'gbthurn-und-taxis-99'}


const paramsSchema = z.object({
  roomId: z.string(),
})

export const P2pDemoRoute = () => {
  const { roomId } = Route.useParams();
  
  const room = joinRoom(trysteroConfig, roomId)
  const [sendColor, getColor] = room.makeAction('color')
  const [myColor, setMyColor] = useState('#c0ffee')
  const [peerColors, setPeerColors] = useState({})

  // whenever new peers join the room, send my color to them:
  room.onPeerJoin(peer => sendColor(myColor, peer))

  // listen for peers sending their colors and update the state accordingly:
  getColor((color, peer) =>
    setPeerColors(peerColors => ({...peerColors, [peer]: color}))
  )

  const updateColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target

    // when updating my own color, broadcast it to all peers:
    sendColor(value)
    setMyColor(value)
  }

  return (
    <>
      <h1>Trystero + React</h1>

      <h2>My color:</h2>
      <input type="color" value={myColor} onChange={updateColor} />

      <h2>Peer colors:</h2>
      <ul>
        {Object.entries(peerColors).map(([peerId, color]: [string, unknown]) => (
          <li key={peerId} style={{backgroundColor: color as string}}>
            {peerId}: {color as string}
          </li>
        ))}
      </ul>
    </>
  )
}


export const Route = createFileRoute('/p2p-demo/$roomId')({
  params: {
    parse: (params) => paramsSchema.parse(params),
    stringify: (params) => ({ roomId: params.roomId }),
  },
  component: P2pDemoRoute,
})

// params: {
//   parse: (params) => paramsSchema.parse(params),
//   stringify: (params) => ({ lobbyId: params.lobbyId }),
// },
// validateSearch: searchSchema, // Standard Schema validation
// component: JoinLobbyRoute,