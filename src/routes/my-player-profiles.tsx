import { createFileRoute } from '@tanstack/react-router'
import { MyPlayerProfilesPage } from '~/pages/my-player-profiles-page'

export const Route = createFileRoute('/my-player-profiles')({
  component: MyPlayerProfilesPage,
})
