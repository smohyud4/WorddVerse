import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Analytics } from "@vercel/analytics/react"
import { WordListProvider } from './context/WordListContext'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Analytics/>
    <WordListProvider>
      <App />
    </WordListProvider>
  </StrictMode>,
)
