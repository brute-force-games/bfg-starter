import { createFileRoute } from '@tanstack/react-router'
import { MyPlayerProfilesPage } from '@bfg-engine/ui/pages/my-player-profiles-page'


const MyPlayerProfilesRoute = () => {
  return <MyPlayerProfilesPage />
}

export const Route = createFileRoute('/my-player-profiles')({
  component: MyPlayerProfilesRoute,
})
