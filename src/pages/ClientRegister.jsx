import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerClient } from '../services/api'
import { Lock, Mail, User, Phone, AlertCircle, Dumbbell } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import './ClientAuth.css'

function ClientRegister() {
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { t, language } = useLanguage()
  usePageTitle('client_register')

  useEffect(() => {
    // If already logged in, redirect to profile
    if (localStorage.getItem('client_token')) {
      navigate('/profil')
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!fullName || !phoneNumber || !email || !password) {
      setError(language === 'fa' ? 'لطفاً تمامی فیلدها را پر کنید.' : language === 'en' ? 'Please fill in all fields.' : 'Vänligen fyll i alla fält.')
      setLoading(false)
      return
    }

    try {
      const data = await registerClient(fullName, phoneNumber, email, password)
      localStorage.setItem('client_token', data.token)
      localStorage.setItem('client_user', data.username)
      localStorage.setItem('client_name', fullName)
      navigate('/profil')
      window.location.reload() // Reload to refresh Navbar state instantly
    } catch (err) {
      setError(err.message || (language === 'fa' ? 'خطایی در ثبت نام رخ داد.' : language === 'en' ? 'Registration failed.' : 'Registreringen misslyckades.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`auth-page container ${language === 'fa' ? 'rtl-align' : ''}`}>
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <div className="auth-logo">
            <Dumbbell className="logo-icon" />
          </div>
          <h2>{language === 'fa' ? 'ایجاد حساب کاربری' : language === 'en' ? 'Register Account' : 'Skapa konto'}</h2>
          <p>{language === 'fa' ? 'برای پیگیری برنامه‌ها و خدمات خود ثبت نام کنید.' : language === 'en' ? 'Sign up to track your plans and training history.' : 'Registrera dig för att se dina paket och träningshistorik.'}</p>
        </div>

        {error && (
          <div className="form-error">
            <AlertCircle size={18} className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">{language === 'fa' ? 'نام و نام خانوادگی' : language === 'en' ? 'Full Name' : 'Fullständigt namn'}</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={language === 'fa' ? 'مثال: علی رضایی' : language === 'en' ? 'e.g. John Doe' : 'T.ex. Johan Andersson'}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">{language === 'fa' ? 'شماره تلفن' : language === 'en' ? 'Phone Number' : 'Telefonnummer'}</label>
            <div className="input-with-icon">
              <Phone size={18} className="input-icon" />
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="07X-XXX XX XX"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">{language === 'fa' ? 'پست الکترونیکی (ایمیل)' : language === 'en' ? 'Email Address' : 'E-postadress'}</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">{language === 'fa' ? 'رمز عبور' : language === 'en' ? 'Password' : 'Lösenord'}</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary btn-login" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? (language === 'fa' ? 'در حال ثبت نام...' : language === 'en' ? 'Registering...' : 'Registrerar...') : (language === 'fa' ? 'ثبت نام' : language === 'en' ? 'Register' : 'Skapa konto')}
          </button>
        </form>

        <div className="auth-footer">
          {language === 'fa' ? 'حساب کاربری دارید؟ ' : language === 'en' ? 'Already have an account? ' : 'Har du redan ett konto? '}
          <Link to="/login">{language === 'fa' ? 'ورود' : language === 'en' ? 'Log In' : 'Logga in'}</Link>
        </div>
      </div>
    </div>
  )
}

export default ClientRegister
