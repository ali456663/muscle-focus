import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { submitLead, isBackendOnline } from '../services/api'
import { Check, Mail, Phone, MapPin, Send, AlertCircle, Dumbbell, CreditCard } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import './Apply.css'

function Apply() {
  const [searchParams] = useSearchParams()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  usePageTitle('apply')
  const [isStudentOrSenior, setIsStudentOrSenior] = useState(false)
  const { t, language } = useLanguage()

  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Kvinna',
    age: '',
    city: '',
    email: '',
    phoneNumber: '',
    trainingWish: '',
    message: ''
  })

  // Check backend status on load
  useEffect(() => {
    const checkBackend = async () => {
      const online = await isBackendOnline()
      setIsOffline(!online)
    }
    checkBackend()
  }, [])

  // List of available packages dynamically populated from translatable package data
  const pkgTranslations = t('packagesData')
  const packagesList = Object.values(pkgTranslations).map(pkg => `${pkg.title} (${pkg.duration})`)

  useEffect(() => {
    const paketParam = searchParams.get('paket')
    if (paketParam) {
      // Find package title match in translations
      const matchedPkg = Object.values(pkgTranslations).find(p => p.title.toLowerCase() === paketParam.toLowerCase())
      if (matchedPkg) {
        setFormData(prev => ({ ...prev, trainingWish: `${matchedPkg.title} (${matchedPkg.duration})` }))
      } else {
        setFormData(prev => ({ ...prev, trainingWish: paketParam }))
      }
    }
  }, [searchParams, pkgTranslations])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e, payNow) => {
    if (e) e.preventDefault()
    setError('')
    setLoading(true)

    // Basic validation
    if (!formData.fullName || !formData.age || !formData.city || !formData.email || !formData.phoneNumber || !formData.trainingWish) {
      setError(t('applyErrorFields') || 'Vänligen fyll i alla obligatoriska fält.')
      setLoading(false)
      return
    }

    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age, 10),
        payNow: payNow,
        priceOption: isStudentOrSenior ? 'discounted' : 'regular'
      }
      
      const res = await submitLead(payload)
      
      if (res._offline) {
        // Backend is down — saved locally
        setIsOffline(true)
        if (payNow) {
          setError(language === 'fa' 
            ? 'پرداخت آنلاین در حالت آفلاین امکان‌پذیر نیست. لطفاً دوباره تلاش کنید یا تماس بگیرید.' 
            : language === 'en' 
            ? 'Online payment is not available in offline mode. Please try again or contact us.' 
            : 'Onlinebetalning är inte tillgänglig i offline-läge. Försök igen eller kontakta oss.')
          setLoading(false)
          return
        }
        setSubmitted(true)
        return
      }
      
      if (payNow && res.stripeCheckoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = res.stripeCheckoutUrl
      } else {
        setSubmitted(true)
      }
    } catch (err) {
      setError(err.message || 'Ett fel uppstod när ansökan skickades. Kontrollera att servern körs.')
    } finally {
      setLoading(false)
    }
  }

  // Determine if the selected wish is a package that offers student/youth/senior discount
  const showDiscountToggle = formData.trainingWish && (
    formData.trainingWish.toLowerCase().includes('projekt') ||
    formData.trainingWish.toLowerCase().includes('project') ||
    formData.trainingWish.toLowerCase().includes('teknik') ||
    formData.trainingWish.toLowerCase().includes('tech') ||
    formData.trainingWish.includes('پروژه') ||
    formData.trainingWish.includes('تکنیک')
  )

  if (submitted) {
    return (
      <div className={`apply-success container ${language === 'fa' ? 'rtl-align' : ''}`}>
        <div className="success-card glass-panel">
          <div className="success-icon-wrapper">
            <Check size={40} className="success-icon" />
          </div>
          <h2>{t('applySuccessTitle')}</h2>
          <p>
            {t('applySuccessText')
              .replace('{name}', formData.fullName)
              .replace('{wish}', formData.trainingWish)}
          </p>
          <p className="success-subtext">
            {t('applySuccessSubtext')
              .replace('{email}', formData.email)
              .replace('{phone}', formData.phoneNumber)}
          </p>
          <div className="success-actions">
            <Link to="/" className="btn-primary">{t('applySuccessBack')}</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`apply-page container ${language === 'fa' ? 'rtl-align' : ''}`}>
      <div className="apply-grid">
        {/* Form Intro and Contact Info */}
        <div className="apply-info">
          <span className="subtitle">{t('applySubtitle')}</span>
          <h2>{t('applyTitle')}</h2>
          <p className="info-desc">
            {t('applyIntro')}
          </p>

          <div className="contact-info-list">
            <div className="contact-info-item">
              <Mail className="info-icon" />
              <div>
                <h4>{t('applyContactEmailTitle')}</h4>
                <p>info.musclefocus@gmail.com</p>
              </div>
            </div>
            <div className="contact-info-item">
              <Phone className="info-icon" />
              <div>
                <h4>{t('applyContactPhoneTitle')}</h4>
                <p>+46 (0) 70-036 12 89</p>
              </div>
            </div>
            <div className="contact-info-item">
              <MapPin className="info-icon" />
              <div>
                <h4>{t('applyContactLocationTitle')}</h4>
                <p>{t('applyContactLocationText')}</p>
              </div>
            </div>
          </div>

          <div className="apply-disclaimer">
            <Dumbbell size={16} className="disclaimer-icon" />
            <p>{t('applyDisclaimer')}</p>
          </div>
        </div>

        {/* Application Form */}
        <div className="apply-form-container glass-panel">
          {/* Offline Badge */}
          {isOffline && (
            <div className="offline-badge apply-offline-badge">
              <AlertCircle size={16} />
              <span>
                {language === 'fa'
                  ? 'حالت آفلاین: اطلاعات به صورت محلی ذخیره می‌شوند. سرور در دسترس نیست.'
                  : language === 'en'
                  ? 'Offline Mode: Details are saved locally. Server is not available.'
                  : 'Offline-läge: Uppgifter sparas lokalt. Servern är inte tillgänglig.'}
              </span>
            </div>
          )}

          {error && (
            <div className="form-error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={(e) => handleFormSubmit(e, false)} className="apply-form">
            <div className="form-group">
              <label htmlFor="fullName">{t('applyLabelFullName')}</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder={t('applyPlaceholderFullName')}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gender">{t('applyLabelGender')}</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="Kvinna">{t('applyOptionFemale')}</option>
                  <option value="Man">{t('applyOptionMale')}</option>
                  <option value="Annat">{t('applyOptionOther')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="age">{t('applyLabelAge')}</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="12"
                  max="100"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder={t('applyPlaceholderAge')}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="city">{t('applyLabelCity')}</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder={t('applyPlaceholderCity')}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">{t('applyLabelEmail')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('applyPlaceholderEmail')}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">{t('applyLabelPhone')}</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder={t('applyPlaceholderPhone')}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="trainingWish">{t('applyLabelWish')}</label>
              <select
                id="trainingWish"
                name="trainingWish"
                value={formData.trainingWish}
                onChange={handleChange}
                required
              >
                <option value="">{t('applyPlaceholderWish')}</option>
                {packagesList.map((pkg, idx) => (
                  <option key={idx} value={pkg}>{pkg}</option>
                ))}
              </select>
            </div>

            {showDiscountToggle && (
              <div className="form-group checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px', marginBottom: '15px' }}>
                <input
                  type="checkbox"
                  id="isStudentOrSenior"
                  checked={isStudentOrSenior}
                  onChange={(e) => setIsStudentOrSenior(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-cyan)' }}
                />
                <label htmlFor="isStudentOrSenior" style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-silver)', margin: 0, userSelect: 'none' }}>
                  {t('applyLabelStudentDiscount')}
                </label>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="message">{t('applyLabelMessage')}</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t('applyPlaceholderMessage')}
                rows="4"
              ></textarea>
            </div>

            <div className="form-actions-row" style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={(e) => handleFormSubmit(e, false)}
                disabled={loading}
                style={{ flex: 1, padding: '12px 16px', fontSize: '0.9rem', justifyContent: 'center' }}
              >
                {loading ? (
                  <span>{t('applyBtnSending')}</span>
                ) : (
                  <>
                    <Send size={14} />
                    <span>{t('applyBtnSubmit')}</span>
                  </>
                )}
              </button>
              
              <button 
                type="button" 
                className="btn-primary" 
                onClick={(e) => handleFormSubmit(e, true)}
                disabled={loading}
                style={{ flex: 1.2, padding: '12px 16px', fontSize: '0.9rem', gap: '6px', justifyContent: 'center', minWidth: '200px' }}
              >
                {loading ? (
                  <span>{t('applyBtnSending')}</span>
                ) : (
                  <>
                    <CreditCard size={14} />
                    <span>{t('applyBtnPayWithStripe')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Apply
