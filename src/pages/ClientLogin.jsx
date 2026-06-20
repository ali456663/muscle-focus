import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginClient } from '../services/api'
import { Lock, Mail, AlertCircle, Dumbbell } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import './ClientAuth.css'

function ClientLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { t, language } = useLanguage()
  usePageTitle('client_login')

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

    if (!email || !password) {
      setError(language === 'fa' ? 'لطفاً هر دو فیلد را پر کنید.' : language === 'en' ? 'Please fill in both fields.' : 'Vänligen fyll i båda fälten.')
      setLoading(false)
      return
    }

    try {
      const data = await loginClient(email, password)
      localStorage.setItem('client_token', data.token)
      localStorage.setItem('client_user', data.username)
      navigate('/profil')
      window.location.reload() // Reload to refresh Navbar state instantly
    } catch (err) {
      setError(err.message || (language === 'fa' ? 'ایمیل یا رمز عبور اشتباه است.' : language === 'en' ? 'Invalid email or password.' : 'Felaktig e-post eller lösenord.'))
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
          <h2>{language === 'fa' ? 'ورود کاربران' : language === 'en' ? 'Client Login' : 'Logga in'}</h2>
          <p>{language === 'fa' ? 'برای مشاهده تاریخچه و برنامه‌های خود وارد شوید.' : language === 'en' ? 'Log in to view your history and programs.' : 'Logga in för att se dina paket och din historik.'}</p>
        </div>

        {error && (
          <div className="form-error">
            <AlertCircle size={18} className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
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
            {loading ? (language === 'fa' ? 'در حال ورود...' : language === 'en' ? 'Logging in...' : 'Loggar in...') : (language === 'fa' ? 'ورود' : language === 'en' ? 'Log In' : 'Logga in')}
          </button>
        </form>

        <div className="auth-footer">
          {language === 'fa' ? 'حساب کاربری ندارید؟ ' : language === 'en' ? "Don't have an account? " : 'Saknar du ett konto? '}
          <Link to="/register">{language === 'fa' ? 'ایجاد حساب کاربری (رایگان)' : language === 'en' ? 'Register Account (Free)' : 'Registrera dig gratis'}</Link>
        </div>
      </div>
    </div>
  )
}

export default ClientLogin
