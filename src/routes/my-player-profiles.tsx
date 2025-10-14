import { createFileRoute } from '@tanstack/react-router'
import { MyPlayerProfilesPage } from '~/site-pages/my-player-profiles-page'


export const Route = createFileRoute('/my-player-profiles')({
  component: MyPlayerProfilesPage,
})
