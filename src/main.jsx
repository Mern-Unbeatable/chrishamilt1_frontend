import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { router } from '@/app/router'
import { AuthProvider } from '@/auth/AuthProvider'
import { TradeCategoriesProvider } from '@/context/TradeCategoriesProvider'
import { disableBrowserScrollRestoration } from '@/helpers/scrollToTop'
import '@/styles/index.css'

disableBrowserScrollRestoration()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <TradeCategoriesProvider>
        <RouterProvider router={router} />
      </TradeCategoriesProvider>
    </AuthProvider>
  </StrictMode>,
)
