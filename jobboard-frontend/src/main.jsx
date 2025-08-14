import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Start MSW worker in development
if (import.meta.env.DEV) {
  import('./mocks/browser.js').then(({ worker }) => {
    worker.start()
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
