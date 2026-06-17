import React from 'react'
import { Link } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import './NotFound.css'

function NotFound() {
  const { t } = useLanguage()
  usePageTitle('notFound')

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-icon">
          <AlertTriangle size={64} />
        </div>
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">{t('notFoundTitle')}</h2>
        <p className="not-found-text">{t('notFoundText')}</p>
        <Link to="/" className="btn-primary not-found-btn">
          <Home size={18} />
          {t('notFoundBtn')}
        </Link>
      </div>
    </div>
  )
}

export default NotFound
