import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { fetchClientProfile, fetchClientHistory } from '../services/api'
import { User, Mail, Phone, Calendar, Dumbbell, AlertCircle, LogOut } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import './ClientProfile.css'

function ClientProfile() {
  const [profile, setProfile] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { t, language } = useLanguage()
  usePageTitle('client_profile')

  useEffect(() => {
    const token = localStorage.getItem('client_token')
    if (!token) {
      navigate('/login')
      return
    }

    const loadData = async () => {
      try {
        setLoading(true)
        const profileData = await fetchClientProfile(token)
        setProfile(profileData)
        
        const historyData = await fetchClientHistory(token)
        setHistory(historyData)
      } catch (err) {
        setError(err.message || 'Kunde inte hämta din profil. Vänligen logga in igen.')
        // If unauthorized/expired token, clear and send to login
        if (err.message && (err.message.includes('401') || err.message.includes('token') || err.message.includes('profil'))) {
          localStorage.removeItem('client_token')
          localStorage.removeItem('client_user')
          localStorage.removeItem('client_name')
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('client_token')
    localStorage.removeItem('client_user')
    localStorage.removeItem('client_name')
    navigate('/')
    window.location.reload() // Reload to refresh navbar state
  }

  if (loading) {
    return (
      <div className="profile-page container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'var(--accent-cyan)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Dumbbell className="animate-spin" />
          <span>{language === 'fa' ? 'در حال بارگذاری...' : language === 'en' ? 'Loading profile...' : 'Laddar profil...'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`profile-page container ${language === 'fa' ? 'rtl-align' : ''}`}>
      {error && (
        <div className="form-error" style={{ marginBottom: '30px' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {profile && (
        <div className="profile-grid">
          {/* Profile Card */}
          <div className="profile-info-card glass-panel">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                {profile.fullName ? profile.fullName[0].toUpperCase() : 'U'}
              </div>
              <div className="profile-avatar-glow"></div>
            </div>
            
            <h2>{profile.fullName}</h2>
            <div className="profile-email-badge">{profile.email}</div>

            <div className="profile-details-list">
              <div className="profile-detail-item">
                <span className="profile-detail-label">
                  {language === 'fa' ? 'نام و نام خانوادگی' : language === 'en' ? 'Full Name' : 'Fullständigt namn'}
                </span>
                <span className="profile-detail-value">{profile.fullName}</span>
              </div>
              
              <div className="profile-detail-item">
                <span className="profile-detail-label">
                  {language === 'fa' ? 'شماره تلفن' : language === 'en' ? 'Phone Number' : 'Telefonnummer'}
                </span>
                <span className="profile-detail-value">{profile.phoneNumber}</span>
              </div>

              <div className="profile-detail-item">
                <span className="profile-detail-label">
                  {language === 'fa' ? 'پست الکترونیکی' : language === 'en' ? 'Email Address' : 'E-post'}
                </span>
                <span className="profile-detail-value">{profile.email}</span>
              </div>

              <div className="profile-detail-item">
                <span className="profile-detail-label">
                  {language === 'fa' ? 'تاریخ ثبت‌نام' : language === 'en' ? 'Register Date' : 'Medlem sedan'}
                </span>
                <span className="profile-detail-value">
                  {new Date(profile.createdAt).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'sv-SE')}
                </span>
              </div>
            </div>

            <button onClick={handleLogout} className="btn-secondary btn-profile-logout" style={{ justifyContent: 'center' }}>
              <LogOut size={14} style={{ marginRight: '8px' }} />
              <span>{t('clientLogout')}</span>
            </button>
          </div>

          {/* History Panel */}
          <div className="history-panel glass-panel">
            <h2>{language === 'fa' ? 'تاریخچه برنامه‌ها و پکیج‌ها' : language === 'en' ? 'Application & Package History' : 'Mina paket & historik'}</h2>
            
            {history.length === 0 ? (
              <div className="history-empty">
                <Calendar size={48} className="history-empty-icon" />
                <p>
                  {language === 'fa' 
                    ? 'شما هنوز هیچ درخواستی ارسال نکرده‌اید.' 
                    : language === 'en' 
                    ? 'You have not submitted any package requests yet.' 
                    : 'Du har inte skickat in några intresseanmälningar ännu.'}
                </p>
                <Link to="/paket" className="btn-primary history-empty-btn">
                  {language === 'fa' ? 'مشاهده پکیج‌های تمرینی' : language === 'en' ? 'Explore Training Packages' : 'Utforska träningspaket'}
                </Link>
              </div>
            ) : (
              <div className="history-list">
                {history.map((lead) => (
                  <div key={lead.id} className="history-item">
                    <div className="history-item-header">
                      <div>
                        <h3 className="history-package-name">{lead.trainingWish}</h3>
                        <span className="history-date">
                          {new Date(lead.createdAt).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'sv-SE')} {new Date(lead.createdAt).toLocaleTimeString(language === 'fa' ? 'fa-IR' : 'sv-SE', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className="history-badges">
                        <span className={`status-badge ${lead.status.toLowerCase()}`}>
                          {lead.status === 'NEW' ? (language === 'fa' ? 'جدید' : language === 'en' ? 'New' : 'Mottagen') :
                           lead.status === 'CONTACTED' ? (language === 'fa' ? 'در تماس' : language === 'en' ? 'Contacted' : 'Kontaktad') :
                           lead.status === 'COMPLETED' ? (language === 'fa' ? 'کامل شده' : language === 'en' ? 'Completed' : 'Genomförd') : 
                           lead.status}
                        </span>
                        
                        {lead.paymentStatus && lead.paymentStatus !== 'NOT_REQUIRED' && (
                          <span className={`payment-badge ${lead.paymentStatus.toLowerCase()}`}>
                            {lead.paymentStatus === 'PAID' ? (language === 'fa' ? 'پرداخت شده' : language === 'en' ? 'Paid' : 'Betald') :
                             lead.paymentStatus === 'PENDING_PAYMENT' ? (language === 'fa' ? 'در انتظار پرداخت' : language === 'en' ? 'Pending' : 'Väntar på betalning') :
                             lead.paymentStatus}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="history-item-details">
                      <div className="history-detail-field">
                        <strong>{language === 'fa' ? 'شهر:' : language === 'en' ? 'City:' : 'Stad:'} </strong>
                        <span>{lead.city}</span>
                      </div>
                      
                      <div className="history-detail-field">
                        <strong>{language === 'fa' ? 'سن:' : language === 'en' ? 'Age:' : 'Ålder:'} </strong>
                        <span>{lead.age} {language === 'fa' ? 'سال' : language === 'en' ? 'y/o' : 'år'}</span>
                      </div>

                      {lead.amountPaid > 0 && (
                        <div className="history-detail-field">
                          <strong>{language === 'fa' ? 'مبلغ پرداخت شده:' : language === 'en' ? 'Amount Paid:' : 'Betalt belopp:'} </strong>
                          <span>{lead.amountPaid} kr</span>
                        </div>
                      )}
                    </div>

                    {lead.message && (
                      <div className="history-detail-field" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <strong>{language === 'fa' ? 'پیام:' : language === 'en' ? 'Message:' : 'Meddelande / Anteckningar:'}</strong>
                        <div className="history-message-box">
                          {lead.message}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientProfile
