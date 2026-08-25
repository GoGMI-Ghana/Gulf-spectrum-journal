import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { BookmarksProvider } from './context/BookmarksContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <BookmarksProvider>
        <App />
      </BookmarksProvider>
    </BrowserRouter>
  </StrictMode>,
)
