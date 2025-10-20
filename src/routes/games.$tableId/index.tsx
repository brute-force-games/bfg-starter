import { createFileRoute } from '@tanstack/react-router'
import { PlayerGamePage } from '../../site-pages/player-game-page'
import { ProfileGuard } from '@bfg-engine/ui/components/profile-guard';


const PlayerGameRoute = () => {
  const { tableId } = Route.useParams();

  return (
    <ProfileGuard>
      <PlayerGamePage tableId={tableId} />
    </ProfileGuard>
  )
}


export const Route = createFileRoute('/games/$tableId/')({
  component: PlayerGameRoute,
})

