import { createFileRoute } from '@tanstack/react-router'
import { HostObserverGamePage } from '~/site-pages/host-observer-game-page';


export const Route = createFileRoute('/hosted-games/$tableId/observe')({
  component: HostObserverGamePage,
})
