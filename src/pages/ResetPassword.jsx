import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { submitPasswordReset } from '../services/api'
import { Lock, AlertCircle, CheckCircle, Dumbbell } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import './ClientAuth.css'

function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  
  const navigate = useNavigate()
  const { language } = useLanguage()
  usePageTitle('reset_password')

  useEffect(() => {
    // If no token in URL, redirect to login
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!password || !confirmPassword) {
      setError(language === 'fa' ? 'لطفاً تمامی فیلدها را پر کنید.' : language === 'en' ? 'Please fill in all fields.' : 'Vänligen fyll i alla fält.')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError(language === 'fa' ? 'رمزهای عبور با هم مطابقت ندارند.' : language === 'en' ? 'Passwords do not match.' : 'Lösenorden matchar inte.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError(language === 'fa' ? 'رمز عبور باید حداقل ۶ کاراکتر باشد.' : language === 'en' ? 'Password must be at least 6 characters.' : 'Lösenordet måste vara minst 6 tecken långt.')
      setLoading(false)
      return
    }

    try {
      const msg = await submitPasswordReset(token, password)
      setSuccess(msg || (language === 'fa' ? 'رمز عبور شما با موفقیت تغییر کرد.' : language === 'en' ? 'Your password has been successfully reset.' : 'Ditt lösenord har återställts.'))
    } catch (err) {
      setError(err.message || (language === 'fa' ? 'خطایی در بازیابی رمز عبور رخ داد.' : language === 'en' ? 'Failed to reset password.' : 'Det gick inte att återställa lösenordet.'))
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
          <h2>{language === 'fa' ? 'انتخاب رمز عبور جدید' : language === 'en' ? 'Choose New Password' : 'Välj nytt lösenord'}</h2>
          <p>{language === 'fa' ? 'رمز عبور جدید خود را وارد کنید.' : language === 'en' ? 'Please enter your new password below.' : 'Ange ditt nya önskade lösenord nedan.'}</p>
        </div>

        {error && (
          <div className="form-error">
            <AlertCircle size={18} className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '10px 0', textAlign: 'center' }}>
            <CheckCircle size={48} color="var(--accent-neon)" />
            <p style={{ color: 'var(--text-silver)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              {success}
            </p>
            <Link 
              to="/login" 
              className="btn-primary" 
              style={{ padding: '10px 32px', fontSize: '0.9rem', textDecoration: 'none' }}
            >
              {language === 'fa' ? 'ورود به حساب کاربری' : language === 'en' ? 'Log In' : 'Logga in'}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">{language === 'fa' ? 'رمز عبور جدید' : language === 'en' ? 'New Password' : 'Nytt lösenord'}</label>
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

            <div className="form-group">
              <label htmlFor="confirmPassword">{language === 'fa' ? 'تکرار رمز عبور جدید' : language === 'en' ? 'Confirm New Password' : 'Bekräfta nytt lösenord'}</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary btn-login" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? (language === 'fa' ? 'در حال ذخیره‌سازی...' : language === 'en' ? 'Saving...' : 'Sparar...') : (language === 'fa' ? 'ذخیره رمز عبور' : language === 'en' ? 'Save Password' : 'Spara lösenord')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPassword
