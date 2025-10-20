import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import './index.css'
import { router } from './router'
import { initBasicGames } from '@bfg-gdp-basic-games'
import { initPartyGames } from '@bfg-gdp-party-games'


initBasicGames();
initPartyGames();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
