import React, { useState, useEffect } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import { User, Calendar, MapPin, Dumbbell, MessageSquare, Search, Send, CheckCircle2, AlertCircle, Mail } from 'lucide-react'
import { submitBuddy, fetchBuddies, isBackendOnline, syncStoredBuddies, clearOfflineData, getOfflineStats } from '../services/api'
import './FindBuddy.css'

function FindBuddy() {
  const { t, language } = useLanguage()
  usePageTitle('findBuddy')
  const [buddies, setBuddies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isOffline, setIsOffline] = useState(false)

  // Form states
  const [fullName, setFullName] = useState('')
  const [age, setAge] = useState('')
  const [city, setCity] = useState('')
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
        city,
        gym,
        contactInfo,
        message,
        status: 'APPROVED'
      })
      setSuccess(true)
      if (result._offline) {
        setIsOffline(true)
      }
      setFullName('')
      setAge('')
      setCity('')
      setGym('')
      setContactInfo('')
      setMessage('')
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

  // Filter buddies based on search query (city or gym)
  const filteredBuddies = buddies.filter(buddy => {
    const query = searchQuery.toLowerCase()
    return (
      buddy.city.toLowerCase().includes(query) ||
      buddy.gym.toLowerCase().includes(query) ||
      buddy.fullName.toLowerCase().includes(query)
    )
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
        <h1 className="text-gradient-neon buddy-title">{t('buddyFinderTitle')}</h1>
        <p className="buddy-subtitle">{t('buddyFinderDesc')}</p>
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
              {filteredBuddies.map(buddy => (
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
                      </div>
                    </div>
                  </div>

                  <div className="buddy-card-details">
                    <div className="buddy-detail-row">
                      <Dumbbell size={14} className="detail-icon" />
                      <span className="detail-label">{t('buddyGymLabel')}:</span>
                      <span className="detail-value">{buddy.gym}</span>
                    </div>

                    {buddy.message && (
                      <div className="buddy-card-message">
                        <p>{buddy.message}</p>
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FindBuddy
