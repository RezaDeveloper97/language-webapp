import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

/* ── Service Worker registration ─────────────────────────────────────────── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(import.meta.env.BASE_URL + 'sw.js', {
        scope: import.meta.env.BASE_URL,
      })
      .then((reg) => {
        // Notify waiting SW to activate when user is ready
        reg.addEventListener('updatefound', () => {
          const sw = reg.installing
          if (!sw) return
          sw.addEventListener('statechange', () => {
            if (sw.state === 'installed' && navigator.serviceWorker.controller) {
              // New version cached — reload to activate
              sw.postMessage({ type: 'SKIP_WAITING' })
              window.location.reload()
            }
          })
        })
      })
      .catch(() => {}) // silently ignore in dev/localhost
  })
}
