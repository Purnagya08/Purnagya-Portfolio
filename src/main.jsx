import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from '@core/providers/AppProviders'
import { AppRouter } from '@core/routing/AppRouter'
import '@shared/styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </StrictMode>,
)
