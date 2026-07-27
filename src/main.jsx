import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const renderApp = () => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

if (document.fonts && document.fonts.ready) {
  Promise.race([
    document.fonts.ready,
    new Promise(resolve => setTimeout(resolve, 500))
  ]).then(renderApp).catch(renderApp)
} else {
  renderApp()
}
