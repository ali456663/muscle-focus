import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext.jsx'
import App from './App.jsx'
import './index.css'

// Global: add spin animation to dumbbell icon on any button click
const btnSelectors = '.btn-primary, .btn-secondary, .btn-readmore, .btn-book, .btn-normal, .btn-campaign, .btn-buddy-contact'
document.addEventListener('click', (e) => {
  const btn = e.target.closest(btnSelectors)
  if (btn) {
    btn.classList.remove('btn-dumbbell-spinning')
    // Force reflow to restart animation
    void btn.offsetWidth
    btn.classList.add('btn-dumbbell-spinning')
    setTimeout(() => btn.classList.remove('btn-dumbbell-spinning'), 650)
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
