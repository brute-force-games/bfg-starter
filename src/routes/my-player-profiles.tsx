import { createFileRoute } from '@tanstack/react-router'
import { MyPlayerProfilesPage } from '@bfg-engine/ui/pages/my-player-profiles-page'


export const Route = createFileRoute('/my-player-profiles')({
  component: MyPlayerProfilesPage,
})
