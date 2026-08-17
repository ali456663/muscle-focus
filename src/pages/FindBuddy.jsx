import React, { useState, useEffect } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import { User, Calendar, MapPin, Dumbbell, MessageSquare, Search, Send, CheckCircle2, AlertCircle, Mail, Globe } from 'lucide-react'
import { submitBuddy, fetchBuddies, isBackendOnline, syncStoredBuddies, clearOfflineData, getOfflineStats } from '../services/api'
import './FindBuddy.css'

const REGIONS = ['all', 'europe', 'asia', 'africa', 'americas', 'oceania']

function FindBuddy() {
  const { t, language } = useLanguage()
  usePageTitle('findBuddy')
  const [buddies, setBuddies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [isOffline, setIsOffline] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  // Form states
  const [fullName, setFullName] = useState('')
  const [age, setAge] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('europe')
  const [gym, setGym] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [revealedContacts, setRevealedContacts] = useState({})
  const [syncStatus, setSyncStatus] = useState(null)

  // Check backend on load + poll every 30s for auto-sync
  useEffect(() => {
    checkBackendAndLoad()
    const interval = setInterval(async () => {
      const online = await isBackendOnline()
      if (online && isOffline) {
        // Backend came back online - sync!
        const stats = getOfflineStats()
        if (stats.buddiesCount > 0) {
          setSyncStatus('syncing')
          const result = await syncStoredBuddies()
          setSyncStatus(result.failed === 0 ? 'synced' : 'partial')
          loadBuddies()
        }
        setIsOffline(false)
      } else if (!online) {
        setIsOffline(true)
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [isOffline])

  const checkBackendAndLoad = async () => {
    const online = await isBackendOnline()
    setIsOffline(!online)
    loadBuddies()
  }

  const loadBuddies = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchBuddies()
      setBuddies(data)
    } catch (err) {
      setError(language === 'fa' ? 'خطا در بارگذاری هم‌تمرینی‌ها.' : language === 'en' ? 'Error loading training buddies.' : 'Kunde inte ladda träningskompisar.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess(false)

    if (!agreeToTerms) {
      setError(language === 'fa' ? 'لطفاً شرایط و مقررات را بپذیرید.' : language === 'en' ? 'Please agree to the terms and safety rules.' : 'Vänligen godkänn användarvillkoren och säkerhetsreglerna.')
      setSubmitting(false)
      return
    }

    const ageNum = parseInt(age)
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      setError(language === 'fa' ? 'لطفاً سن معتبری وارد کنید.' : language === 'en' ? 'Please enter a valid age.' : 'Vänligen ange en giltig ålder.')
      setSubmitting(false)
      return
    }

    try {
      const result = await submitBuddy({
        fullName,
        age: ageNum,
        city: `${city}, ${country}`,
        gym,
        contactInfo,
        message: `[${region.toUpperCase()}] ${message}`,
        status: 'APPROVED'
      })
      setSuccess(true)
      if (result._offline) {
        setIsOffline(true)
      }
      setFullName('')
      setAge('')
      setCity('')
      setCountry('')
      setRegion('europe')
      setGym('')
      setContactInfo('')
      setMessage('')
      setAgreeToTerms(false) // Reset checkbox
      // Reload list to show the new post
      loadBuddies()
    } catch (err) {
      setError(err.message || (language === 'fa' ? 'خطا در ثبت اطلاعات.' : language === 'en' ? 'Error submitting details.' : 'Kunde inte skicka din profil.'))
    } finally {
      setSubmitting(false)
    }
  }

  const toggleContactReveal = (id) => {
    setRevealedContacts(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Get region label for display
  const getRegionLabel = (regionKey) => {
    const map = {
      all: t('buddyRegionAll'),
      europe: t('buddyRegionEurope'),
      asia: t('buddyRegionAsia'),
      africa: t('buddyRegionAfrica'),
      americas: t('buddyRegionAmericas'),
      oceania: t('buddyRegionOceania'),
    }
    return map[regionKey] || regionKey
  }

  // Extract region tag from message if present
  const getBuddyRegion = (buddy) => {
    const match = buddy.message && buddy.message.match(/^\[([A-Z]+)\]/)
    return match ? match[1].toLowerCase() : null
  }

  // Filter buddies based on search query and region
  const filteredBuddies = buddies.filter(buddy => {
    const query = searchQuery.toLowerCase()
    const matchesSearch = (
      buddy.city.toLowerCase().includes(query) ||
      buddy.gym.toLowerCase().includes(query) ||
      buddy.fullName.toLowerCase().includes(query)
    )
    const buddyRegion = getBuddyRegion(buddy)
    const matchesRegion = selectedRegion === 'all' || buddyRegion === selectedRegion
    return matchesSearch && matchesRegion
  })

  return (
    <div className="buddy-page-wrapper container">
      {/* Offline Badge */}
      {isOffline && (
        <div className="offline-badge glass-panel">
          <AlertCircle size={16} />
          <span>
            {language === 'fa'
              ? 'حالت آفلاین: پروفایل‌ها به صورت محلی ذخیره می‌شوند. سرور در دسترس نیست.'
              : language === 'en'
              ? 'Offline Mode: Profiles are saved locally. Server is not available.'
              : 'Offline-läge: Profiler sparas lokalt. Servern är inte tillgänglig.'}
          </span>
        </div>
      )}

      {/* Page Header */}
      <div className="buddy-header-section text-center">
        <div className="global-badge">
          <Globe size={16} />
          <span>{language === 'fa' ? 'شبکه جهانی' : language === 'en' ? 'Global Network' : 'Globalt nätverk'}</span>
        </div>
        <h1 className="text-gradient-neon buddy-title">{t('buddyFinderTitle')}</h1>
        <p className="buddy-subtitle">{t('buddyFinderDesc')}</p>
        
        {/* Region Filter Tabs */}
        <div className="region-filter-tabs">
          {REGIONS.map(r => (
            <button
              key={r}
              className={`region-tab ${selectedRegion === r ? 'active' : ''}`}
              onClick={() => setSelectedRegion(r)}
            >
              {getRegionLabel(r)}
            </button>
          ))}
        </div>
      </div>

      <div className="buddy-grid">
        {/* Left Column: Register Form */}
        <div className="buddy-form-column">
          <div className="glass-panel buddy-form-card">
            <h2 className="buddy-card-title">{t('buddyFormTitle')}</h2>
            
            {success && (
              <div className="buddy-success-message fade-in">
                <CheckCircle2 size={18} />
                <span>{t('buddyFormSuccess')}</span>
              </div>
            )}

            {error && (
              <div className="buddy-error-message">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="buddy-form">
              <div className="form-group">
                <label htmlFor="fullName">{t('buddyFormFullName')} *</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'fa' ? 'مثال: علی رضایی' : language === 'en' ? 'e.g. John Doe' : 't.ex. Johan Andersson'}
                    className="buddy-input"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="age">{t('buddyFormAge')} *</label>
                  <div className="input-with-icon">
                    <Calendar size={18} className="input-icon" />
                    <input
                      type="number"
                      id="age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="28"
                      className="buddy-input"
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="region">{t('buddyFormRegion')} *</label>
                  <div className="input-with-icon">
                    <Globe size={18} className="input-icon" />
                    <select
                      id="region"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="buddy-input buddy-select"
                      required
                      disabled={submitting}
                    >
                      <option value="europe">{t('buddyRegionEurope')}</option>
                      <option value="asia">{t('buddyRegionAsia')}</option>
                      <option value="africa">{t('buddyRegionAfrica')}</option>
                      <option value="americas">{t('buddyRegionAmericas')}</option>
                      <option value="oceania">{t('buddyRegionOceania')}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="country">{t('buddyFormCountry')} *</label>
                  <div className="input-with-icon">
                    <MapPin size={18} className="input-icon" />
                    <input
                      type="text"
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder={t('buddyCountryPlaceholder')}
                      className="buddy-input"
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="city">{t('buddyFormCity')} *</label>
                  <div className="input-with-icon">
                    <MapPin size={18} className="input-icon" />
                    <input
                      type="text"
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder={language === 'fa' ? 'تهران' : language === 'en' ? 'Stockholm' : 'Stockholm'}
                      className="buddy-input"
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="gym">{t('buddyFormGym')} *</label>
                <div className="input-with-icon">
                  <Dumbbell size={18} className="input-icon" />
                  <input
                    type="text"
                    id="gym"
                    value={gym}
                    onChange={(e) => setGym(e.target.value)}
                    placeholder="SATS Odenplan, Friskis, Hemma, etc."
                    className="buddy-input"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contactInfo">{t('buddyFormContact')} *</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="text"
                    id="contactInfo"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder={language === 'fa' ? 'ایمیل / اینستاگرام / اسنپ‌چت / تلفن' : language === 'en' ? 'Email / Instagram / Snapchat / Phone' : 'E-post / Instagram / Snapchat / Mobilnummer'}
                    className="buddy-input"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">{t('buddyFormMessage')}</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={language === 'fa' ? 'مثال: من به دنبال هم‌تمرینی برای جلسات بدنسازی ۳ بار در هفته هستم...' : language === 'en' ? 'e.g. Looking for a partner to lift weights 3 times a week, focus on strength...' : 't.ex. Söker någon att köra styrketräning med 3 gånger i veckan. Kör tungt och fokuserat...'}
                  className="buddy-input buddy-textarea"
                  rows="4"
                  disabled={submitting}
                />
              </div>

              {/* Terms Checkbox */}
              <div className="form-group terms-checkbox-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '15px', marginBottom: '15px' }}>
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  style={{ marginTop: '4px', cursor: 'pointer' }}
                  required
                />
                <label htmlFor="agreeToTerms" style={{ fontSize: '0.88rem', color: 'var(--text-silver)', cursor: 'pointer', lineHeight: '1.4' }}>
                  {language === 'fa' ? 'من ' : language === 'en' ? 'I agree to the ' : 'Jag godkänner '}
                  <button 
                    type="button" 
                    onClick={() => setShowTermsModal(true)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', textDecoration: 'underline', padding: 0, cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit', fontWeight: 'bold' }}
                  >
                    {language === 'fa' ? 'قوانین و مقررات ایمنی' : language === 'en' ? 'terms & safety rules' : 'användarvillkoren & säkerhetsreglerna'}
                  </button>
                  {language === 'fa' ? ' را می‌پذیرم (حداقل ۱۶ سال، مسئولیت شخصی، قرار در مکان عمومی).' : language === 'en' ? ' (min. 16 years old, personal responsibility, public meetup).*' : ' (minst 16 år, eget ansvar, träffas på offentlig plats).*'}
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary btn-buddy-submit"
              >
                <Send size={16} />
                <span>{submitting ? (language === 'fa' ? 'در حال ثبت...' : language === 'en' ? 'Submitting...' : 'Publicerar...') : t('buddyFormSubmit')}</span>
              </button>

              {/* Sync status & clear buttons */}
              {syncStatus === 'syncing' && (
                <div className="sync-status syncing">
                  <span>{language === 'fa' ? 'در حال همگام‌سازی...' : language === 'en' ? 'Syncing...' : 'Synkar...'}</span>
                </div>
              )}
              {syncStatus === 'synced' && (
                <div className="sync-status synced">
                  <CheckCircle2 size={14} />
                  <span>{language === 'fa' ? 'با موفقیت همگام شد!' : language === 'en' ? 'Synced successfully!' : 'Synkroniserad!'}</span>
                </div>
              )}
              {(isOffline || getOfflineStats().buddiesCount > 0) && (
                <button
                  type="button"
                  className="btn-clear-offline"
                  onClick={() => {
                    clearOfflineData()
                    loadBuddies()
                    setSyncStatus(null)
                  }}
                >
                  {language === 'fa' ? 'پاک کردن داده‌های آفلاین' : language === 'en' ? 'Clear Offline Data' : 'Rensa offline-data'}
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: Buddies Feed */}
        <div className="buddy-feed-column">
          <div className="buddy-feed-header glass-panel">
            <h2 className="feed-title">{t('buddyListTitle')}</h2>
            
            {/* Search Input */}
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('buddySearchPlaceholder')}
                className="search-input"
              />
            </div>
          </div>

          {loading ? (
            <div className="buddy-loading-state text-center">
              <div className="spinner"></div>
              <p>{language === 'fa' ? 'در حال بارگذاری لیست...' : language === 'en' ? 'Loading list...' : 'Laddar lista...'}</p>
            </div>
          ) : filteredBuddies.length === 0 ? (
            <div className="glass-panel buddy-empty-card text-center">
              <MessageSquare size={40} className="empty-icon" />
              <h3>{language === 'fa' ? 'هیچ هم‌تمرینی یافت نشد' : language === 'en' ? 'No buddies found' : 'Inga träningskompisar hittades'}</h3>
              <p>{t('buddyListEmpty')}</p>
            </div>
          ) : (
            <div className="buddy-list">
              {filteredBuddies.map(buddy => {
                const buddyRegion = getBuddyRegion(buddy)
                // Clean message by removing the region tag
                const cleanMessage = buddy.message ? buddy.message.replace(/^\[[A-Z]+\]\s*/, '') : ''
                
                return (
                  <div key={buddy.id} className="buddy-feed-card glass-panel fade-in">
                    <div className="buddy-card-top">
                      <div className="buddy-avatar-container">
                        <div className="buddy-avatar">
                          {buddy.fullName.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      
                      <div className="buddy-main-meta">
                        <h3 className="buddy-card-name">{buddy.fullName}</h3>
                        <div className="buddy-tags-row">
                          <span className="buddy-card-tag age">
                            <Calendar size={12} />
                            <span>{buddy.age} {t('buddyAgeLabel')}</span>
                          </span>
                          <span className="buddy-card-tag city">
                            <MapPin size={12} />
                            <span>{buddy.city}</span>
                          </span>
                          {buddyRegion && (
                            <span className="buddy-card-tag region">
                              <Globe size={12} />
                              <span>{getRegionLabel(buddyRegion)}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="buddy-card-details">
                      <div className="buddy-detail-row">
                        <Dumbbell size={14} className="detail-icon" />
                        <span className="detail-label">{t('buddyGymLabel')}:</span>
                        <span className="detail-value">{buddy.gym}</span>
                      </div>

                      {cleanMessage && (
                        <div className="buddy-card-message">
                          <p>{cleanMessage}</p>
                        </div>
                      )}
                    </div>

                    <div className="buddy-card-footer">
                      <button
                        onClick={() => toggleContactReveal(buddy.id)}
                        className={`btn-buddy-contact ${revealedContacts[buddy.id] ? 'active' : ''}`}
                      >
                        <span>{t('buddyContactBtn')}</span>
                      </button>

                      {revealedContacts[buddy.id] && (
                        <div className="revealed-contact-box fade-in">
                          <strong>{t('buddyFormContact')}:</strong>
                          <p className="contact-value">{buddy.contactInfo}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Terms & Safety Modal */}
      {showTermsModal && (
        <div className="terms-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="terms-modal-content glass-panel" style={{ maxWidth: '650px', width: '100%', maxHeight: '85vh', overflowY: 'auto', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-glass)', padding: '32px', position: 'relative', boxShadow: 'var(--shadow-dark)' }}>
            <button 
              type="button" 
              onClick={() => setShowTermsModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.06)', border: 'none', color: 'var(--text-silver)', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
            >
              ✕
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <ShieldAlert size={28} style={{ color: 'var(--accent-gold)' }} />
              <h2 style={{ fontSize: '1.7rem', color: 'var(--text-white)', margin: 0, fontFamily: 'var(--font-heading)' }}>
                {language === 'fa' ? 'قوانین و مقررات ایمنی' : language === 'en' ? 'Terms & Safety Rules' : 'Användarvillkor & Säkerhet'}
              </h2>
            </div>

            <div className="terms-scrollable-body" style={{ color: 'var(--text-silver)', fontSize: '0.95rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontWeight: '600', color: 'var(--accent-gold)' }}>
                {language === 'fa' 
                  ? 'لطفاً قبل از ایجاد پروفایل، قوانین زیر را با دقت بخوانید. ایمنی شما اولویت ماست.'
                  : language === 'en' 
                  ? 'Please read the following safety rules and disclaimers carefully. Your safety is our priority.'
                  : 'Vänligen läs igenom våra säkerhetsregler och villkor noggrant innan du publicerar din profil. Din säkerhet är vår prioritet.'}
              </p>

              <div style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '12px', margin: '8px 0', backgroundColor: 'rgba(184, 149, 71, 0.05)', padding: '12px', borderRadius: '4px' }}>
                <h4 style={{ color: 'var(--text-white)', margin: '0 0 6px 0' }}>
                  {language === 'fa' ? '۱. سن و اهلیت (اجباری)' : language === 'en' ? '1. Age Requirements (Mandatory)' : '1. Åldersgräns (Obligatorisk)'}
                </h4>
                <p style={{ margin: 0 }}>
                  {language === 'fa'
                    ? 'برای استفاده از این پلتفرم باید حداقل ۱۶ سال سن داشته باشید. هیچ استثنایی وجود ندارد.'
                    : language === 'en'
                    ? 'You must be at least 16 years old to use this matchmaking platform. No exceptions.'
                    : 'Du måste vara minst 16 år fyllda för att få använda denna matchningstjänst. Inga undantag accepteras.'}
                </p>
              </div>

              <div style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '12px', margin: '8px 0', backgroundColor: 'rgba(184, 149, 71, 0.05)', padding: '12px', borderRadius: '4px' }}>
                <h4 style={{ color: 'var(--text-white)', margin: '0 0 6px 0' }}>
                  {language === 'fa' ? '۲. سلب مسئولیت حقوقی و ورزشی' : language === 'en' ? '2. Legal & Health Disclaimer' : '2. Juridisk & Träningsrelaterad ansvarsfriskrivning'}
                </h4>
                <p style={{ margin: '0 0 8px 0' }}>
                  {language === 'fa'
                    ? 'Muscle & Focus صرفاً ابزار فنی برای ارتباط بین ورزشکاران فراهم می‌کند. ما هیچ‌گونه بررسی پیشینه انجام نمی‌دهیم و هویت واقعی کاربران را تأیید نمی‌کنیم.'
                    : language === 'en'
                    ? 'Muscle & Focus provides ONLY the technical matching tools. We do not conduct background checks and cannot guarantee users\' real identities.'
                    : 'Muscle & Focus tillhandahåller ENDAST det tekniska verktyget för att underlätta kontakt. Vi genomför inga bakgrundskontroller och kan inte garantera användarnas verkliga identitet.'}
                </p>
                <p style={{ margin: 0, fontWeight: 'bold' }}>
                  {language === 'fa'
                    ? 'شما از این سرویس با مسئولیت شخصی خود استفاده می‌کنید. ما هیچ‌گونه مسئولیتی در قبال صدمات، رفتارها، آسیب‌های جسمی یا مالی رخ داده خارج از پلتفرم نداریم.'
                    : language === 'en'
                    ? 'You use this service at your own risk. We are not liable for any behavior, injuries, physical or financial damage arising from meetups offline.'
                    : 'Du använder tjänsten helt på egen risk. Vi ansvarar inte under några omständigheter för skador (fysiska, psykiska eller ekonomiska), olyckor, incidenter eller beteenden som uppstår vid träffar offline.'}
                </p>
              </div>

              <div style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '12px', margin: '8px 0', backgroundColor: 'rgba(255, 100, 100, 0.1)', padding: '12px', borderRadius: '4px', borderLeftColor: '#ff5555' }}>
                <h4 style={{ color: '#ff6666', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ⚠️ {language === 'fa' ? 'سفارش‌های امنیتی (بسیار مهم)' : language === 'en' ? 'Safety Rules (CRITICAL)' : 'Säkerhetsregler (KRITISKT)'}
                </h4>
                <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>
                    {language === 'fa'
                      ? 'همیشه برای اولین بار با هم‌تمرینی جدید در یک مکان عمومی و شلوغ قرار بگذارید.'
                      : language === 'en'
                      ? 'Always meet new training partners in a public, well-populated area for the first time.'
                      : 'Träffa ALLTID en ny träningspartner på en offentlig och välbefolkad plats den första gången.'}
                  </li>
                  <li>
                    {language === 'fa'
                      ? 'به دوستان یا خانواده خود اطلاع دهید که با چه کسی، کجا و چه زمانی ملاقات می‌کنید.'
                      : language === 'en'
                      ? 'Tell friends or family where you are going, who you are meeting, and when you expect to return.'
                      : 'Berätta alltid för familj eller vänner vart du ska, vem du ska träffa och när du beräknas vara hemma.'}
                  </li>
                  <li>
                    {language === 'fa'
                      ? 'هرگز اطلاعات مالی، بانکی یا رمز عبور خود را به دیگران ندهید.'
                      : language === 'en'
                      ? 'Never share financial information, bank details, or transfer money.'
                      : 'Dela aldrig med dig av finansiell information, bankuppgifter eller pengar.'}
                  </li>
                  <li>
                    {language === 'fa'
                      ? 'به حس درونی خود اعتماد کنید. اگر احساس راحتی نمی‌کنید، سریعاً محل را ترک کنید.'
                      : language === 'en'
                      ? 'Trust your gut. If a situation feels uncomfortable or unsafe, leave immediately.'
                      : 'Lita på din magkänsla. Om något känns fel eller obekvämt, avbryt och lämna platsen direkt.'}
                  </li>
                </ul>
              </div>

              <div style={{ borderLeft: '3px solid var(--accent-gold)', paddingLeft: '12px', margin: '8px 0', backgroundColor: 'rgba(184, 149, 71, 0.05)', padding: '12px', borderRadius: '4px' }}>
                <h4 style={{ color: 'var(--text-white)', margin: '0 0 6px 0' }}>
                  {language === 'fa' ? '۳. رفتار مجاز و ممنوعه' : language === 'en' ? '3. Permitted & Prohibited Behavior' : '3. Uppföranderegler'}
                </h4>
                <p style={{ margin: 0 }}>
                  {language === 'fa'
                    ? 'هرگونه مزاحمت، ارسال پیام‌های غیراخلاقی، تهدید یا رفتارهای نامناسب با مسدودسازی فوری اکانت مواجه خواهد شد. ما به محض گزارش رفتار مشکوک با پلیس همکاری می‌کنیم.'
                    : language === 'en'
                    ? 'Any harassment, explicit messages, threats, or improper behavior will result in an immediate permanent ban. We cooperate fully with law enforcement.'
                    : 'Trakasserier, hot, sexuellt innehåll, stötande meddelanden eller falska profiler är strängt förbjudna och leder till omedelbar avstängning. Vid misstanke om brott samarbetar vi med polisen.'}
                </p>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={() => {
                  setAgreeToTerms(true)
                  setShowTermsModal(false)
                }}
                className="btn-primary"
                style={{ padding: '10px 24px' }}
              >
                {language === 'fa' ? 'پذیرش و ادامه' : language === 'en' ? 'Accept & Close' : 'Godkänn & Stäng'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FindBuddy
