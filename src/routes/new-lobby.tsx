import { createFileRoute } from '@tanstack/react-router'
import { NewLobbyPage } from '../site-pages/new-lobby-page';
import { ProfileGuard } from '@bfg-engine/ui/components/profile-guard';


const NewLobbyRoute = () => {
  return (
    <ProfileGuard>
      <NewLobbyPage />
    </ProfileGuard>
  )
}

export const Route = createFileRoute('/new-lobby')({
  component: NewLobbyRoute,
})
