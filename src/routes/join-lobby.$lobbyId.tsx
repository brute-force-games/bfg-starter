import { createFileRoute } from '@tanstack/react-router'
import { PlayerP2pLobbyComponent } from '~/components/p2p/player-p2p-lobby-component'
import { useMyDefaultPlayerProfile } from '~/hooks/stores/use-my-player-profiles-store'


function JoinLobbyComponent() {
  const { lobbyId } = Route.useParams()

  const myPlayerProfile = useMyDefaultPlayerProfile();

  if (!myPlayerProfile) {
    return <div>Loading player profile...</div>
  }

  return (
    <PlayerP2pLobbyComponent
      lobbyId={lobbyId}
      playerProfile={myPlayerProfile}
    />
  )
}


export const Route = createFileRoute('/join-lobby/$lobbyId')({
  component: JoinLobbyComponent,
})