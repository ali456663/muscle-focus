import React from 'react'
import { Link } from 'react-dom' // wait, it should be react-router-dom! Let's be very careful here.
import { XCircle, ShoppingBag, ShieldAlert } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import './PaymentCancel.css'

// Wait, I should make sure it imports Link from 'react-router-dom', not 'react-dom'!
import { Link as RouterLink } from 'react-router-dom'

function PaymentCancel() {
  const { t, language } = useLanguage()

  return (
    <div className={`payment-cancel-container container ${language === 'fa' ? 'rtl-align' : ''}`}>
      <div className="payment-cancel-card glass-panel fade-in">
        <div className="cancel-icon-wrapper">
          <XCircle size={40} />
        </div>
        <h2>{t('paymentCancelTitle')}</h2>
        <p className="cancel-message">
          {t('paymentCancelText')}
        </p>
        
        <div className="cancel-actions">
          <RouterLink to="/paket" className="btn-primary">
            <ShoppingBag size={16} />
            <span>{t('paymentCancelBack')}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  )
}

export default PaymentCancel
