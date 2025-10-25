import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { NewLobbyPage } from '../site-pages/new-lobby-page';
import { ProfileGuard } from '@bfg-engine/ui/components/profile-guard';
import { BfgSupportedGameTitleSchema } from '@bfg-engine/models/game-box-definition';

// Search params schema for game title pre-selection
const searchSchema = z.object({
  gameTitle: BfgSupportedGameTitleSchema.optional(),
}).optional()

const NewLobbyRoute = () => {
  return (
    <ProfileGuard>
      <NewLobbyPage />
    </ProfileGuard>
  )
}

export const Route = createFileRoute('/new-lobby')({
  validateSearch: searchSchema,
  component: NewLobbyRoute,
})
