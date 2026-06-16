import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Check, ShieldAlert, Sparkles, Loader2 } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { verifyPayment } from '../services/api'
import './PaymentSuccess.css'

function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { t, language } = useLanguage()
  const [status, setStatus] = useState('loading') // 'loading', 'success', 'error'
  const [details, setDetails] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      setErrorMessage(language === 'fa' ? 'Session-ID saknas' : 'Session ID is missing')
      return
    }

    const checkPayment = async () => {
      try {
        const res = await verifyPayment(sessionId)
        if (res.status === 'success') {
          setDetails(res)
          setStatus('success')
        } else {
          setStatus('error')
          setErrorMessage(res.message || 'Kunde inte verifiera betalningen.')
        }
      } catch (err) {
        setStatus('error')
        setErrorMessage(err.message || 'Ett nätverksfel uppstod.')
      }
    }

    checkPayment()
  }, [sessionId, language])

  if (status === 'loading') {
    return (
      <div className={`payment-status-container container ${language === 'fa' ? 'rtl-align' : ''}`}>
        <div className="payment-status-card glass-panel loading-state">
          <div className="loading-orbit">
            <div className="loading-planet"></div>
            <Loader2 className="loading-spinner" size={48} />
          </div>
          <h2>{language === 'fa' ? 'Verifierar betalning...' : language === 'en' ? 'Verifying payment...' : 'Verifierar betalning...'}</h2>
          <p className="loading-text">
            {language === 'fa' ? 'Vänligen vänta medan vi bekräftar din betalning med Stripe.' : 
             language === 'en' ? 'Please wait while we confirm your transaction with Stripe.' : 
             'Vänligen vänta medan vi bekräftar din betalning med Stripe.'}
          </p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className={`payment-status-container container ${language === 'fa' ? 'rtl-align' : ''}`}>
        <div className="payment-status-card glass-panel error-card fade-in">
          <div className="status-icon-wrapper error-icon">
            <ShieldAlert size={40} />
          </div>
          <h2>{language === 'fa' ? 'Verifiering misslyckades' : language === 'en' ? 'Verification Failed' : 'Verifiering misslyckades'}</h2>
          <p className="status-message">{errorMessage}</p>
          <p className="error-tip">
            {language === 'fa' ? 'Om du har betalat och ser detta fel, kontakta Ali på info.musclefocus@gmail.com med ditt session-ID.' : 
             language === 'en' ? 'If you made a payment and see this error, please contact Ali at info.musclefocus@gmail.com with your session ID.' : 
             'Om du har betalat och ser detta fel, vänligen kontakta Ali på info.musclefocus@gmail.com med ditt session-ID.'}
          </p>
          <div className="action-buttons">
            <Link to="/paket" className="btn-secondary">{t('paymentCancelBack')}</Link>
          </div>
        </div>
      </div>
    )
  }

  // Success State
  return (
    <div className={`payment-status-container container ${language === 'fa' ? 'rtl-align' : ''}`}>
      <div className="payment-status-card glass-panel success-card fade-in">
        <div className="success-particles">
          <Sparkles className="particle p1" size={16} />
          <Sparkles className="particle p2" size={20} style={{ color: 'var(--accent-neon)' }} />
          <Sparkles className="particle p3" size={14} />
        </div>
        <div className="status-icon-wrapper success-icon">
          <Check size={40} />
        </div>
        <h2>{t('paymentSuccessTitle')}</h2>
        
        <p className="success-message">
          {t('paymentSuccessText')
            .replace('{name}', details?.fullName || '')
            .replace('{wish}', details?.trainingWish || '')}
        </p>

        <div className="payment-info-box">
          <div className="info-row">
            <span>{language === 'fa' ? 'Betalt belopp:' : language === 'en' ? 'Amount Paid:' : 'Betalt belopp:'}</span>
            <strong className="amount-text">{details?.amountPaid} SEK</strong>
          </div>
          <div className="info-row">
            <span>Status:</span>
            <span className="payment-badge-paid">BETALD</span>
          </div>
        </div>

        <p className="success-subtext">
          {language === 'fa' ? 
            `یک ایمیل تایید ارسال شد. علی به زودی با شما تماس خواهد گرفت تا برنامه تمرینی را آغاز کنید.` :
            language === 'en' ? 
            `A confirmation has been sent, and Ali will contact you shortly to kickstart your training journey.` :
            `En bekräftelse har skickats till din e-post, och Ali kommer att kontakta dig inom kort för att starta din träningsresa.`
          }
        </p>

        <div className="action-buttons">
          <Link to="/" className="btn-primary">{t('paymentSuccessBack')}</Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
