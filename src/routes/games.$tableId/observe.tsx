import { createFileRoute } from '@tanstack/react-router'
import { ObserverGamePage } from '../../site-pages/observer-game-page'


const ObserverGameRoute = () => {
  const { tableId } = Route.useParams();

  return (
    <ObserverGamePage tableId={tableId} />
  )
}


export const Route = createFileRoute('/games/$tableId/observe')({
  component: ObserverGameRoute,
})
