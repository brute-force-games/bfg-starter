import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BruteForceGamesApp } from './BfgApp'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BruteForceGamesApp />
  </StrictMode>,
)
