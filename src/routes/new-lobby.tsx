import { createFileRoute } from '@tanstack/react-router'
import { NewLobbyPage } from '~/pages/new-lobby-page';


export const Route = createFileRoute('/new-lobby')({
  // ssr: false,
  component: NewLobbyPage,
})
