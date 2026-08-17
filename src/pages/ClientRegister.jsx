import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerClient } from '../services/api'
import { Lock, Mail, User, Phone, AlertCircle, ShieldCheck, CheckCircle2, Calendar, Flame, Activity, ChevronRight } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import './ClientRegister.css'

function ClientRegister() {
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gdprAccepted, setGdprAccepted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { t, language } = useLanguage()
  usePageTitle('client_register')

  useEffect(() => {
    if (localStorage.getItem('client_token')) {
      navigate('/profil')
    }
  }, [navigate])

  const getPasswordStrength = (pass) => {
    if (!pass) return 0
    let score = 0
    if (pass.length >= 6) score += 1
    if (pass.length >= 8) score += 1
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1
    return Math.min(4, Math.max(1, score))
  }

  const getStrengthLabel = (score) => {
    if (language === 'fa') {
      if (score === 1) return 'ضعیف'
      if (score === 2) return 'متوسط'
      if (score === 3) return 'قوی'
      return 'بسیار قوی! 🔒'
    }
    if (language === 'en') {
      if (score === 1) return 'Weak'
      if (score === 2) return 'Medium'
      if (score === 3) return 'Strong'
      return 'Very Strong! 🔒'
    }
    if (score === 1) return 'Svagt'
    if (score === 2) return 'Moderat'
    if (score === 3) return 'Starkt!'
    return 'Mycket starkt! 🔒'
  }

  const strengthScore = getPasswordStrength(password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!gdprAccepted) {
      setError(
        language === 'fa' 
          ? 'لطفاً شرایط حریم خصوصی و GDPR را بپذیرید.' 
          : language === 'en' 
          ? 'Please accept the GDPR and data privacy terms.' 
          : 'Vänligen godkänn GDPR- och integritetsvillkoren.'
      )
      return
    }

    setLoading(true)

    if (!fullName || !phoneNumber || !email || !password) {
      setError(language === 'fa' ? 'لطفاً تمامی فیلدها را پر کنید.' : language === 'en' ? 'Please fill in all fields.' : 'Vänligen fyll i alla fält.')
      setLoading(false)
      return
    }

    try {
      const data = await registerClient(fullName, phoneNumber, email, password)
      localStorage.setItem('client_token', data.token || ('demo_' + Date.now()))
      localStorage.setItem('client_user', data.username || email)
      localStorage.setItem('client_name', fullName)
      localStorage.setItem('client_email', email)
      navigate('/profil')
      window.location.reload()
    } catch (err) {
      setError(err.message || (language === 'fa' ? 'خطایی در ثبت نام رخ داد.' : language === 'en' ? 'Registration failed.' : 'Registreringen misslyckades.'))
    } finally {
      setLoading(false)
    }
  }

  // Multilingual translations for premium registration page elements
  const texts = {
    fa: {
      leftTitle: 'داشبورد هوشمند شما منتظر است',
      leftDesc: 'پس از ثبت نام، برنامه غذایی و ورزشی کاملاً شخصی‌سازی شده خود را همراه با ویدیوهای آموزشی و گزارش پیشرفت دریافت کنید.',
      card1Title: 'برنامه هفتگی شما',
      card2Title: 'گزارش تغذیه روزانه',
      card3Title: 'تمرینات فعال امروز',
      day1: 'روز ۱', day2: 'روز ۲', day3: 'روز ۳',
      chest: 'سینه', legs: 'پا', shoulders: 'شانه',
      kcals: '۲,۱۰۰ / ۲,۴۰۰ کیلوکالری',
      ex1: 'پرس سینه دمبل', ex2: 'پرس آرنولد', completed: 'انجام شده',
      secureBadge: 'اتصال امن. اطلاعات شما تحت پروتکل SSL ۲۵۶ بیتی رمزگذاری شده و مطابق با قوانین GDPR نگهداری می‌شود.',
      gdprLabel: 'من موافقت می‌کنم که اطلاعاتم برای ارائه برنامه‌ها طبق قوانین GDPR به صورت ایمن ذخیره شود.',
      submitBtn: 'ایجاد حساب کاربری',
      submitBtnLoading: 'در حال ایجاد حساب...',
      footerText: 'حساب کاربری دارید؟',
      footerLink: 'ورود به سیستم'
    },
    en: {
      leftTitle: 'Your Smart Dashboard Awaits',
      leftDesc: 'Sign up to access your fully customized nutrition and training plans, complete with step-by-step instructions, video demos, and progress logs.',
      card1Title: 'WEEKLY WORKOUT PLAN',
      card2Title: 'DAILY NUTRITION LOG',
      card3Title: 'TODAYS ACTIVE EXERCISES',
      day1: 'Day 1', day2: 'Day 2', day3: 'Day 3',
      chest: 'Chest', legs: 'Legs', shoulders: 'Shoulders',
      kcals: '2,100 / 2,400 kcal',
      ex1: 'Dumbbell Bench Press', ex2: 'Arnold Press', completed: 'Completed',
      secureBadge: 'Secure connection. Your personal data is protected under 256-bit SSL encryption and fully compliant with GDPR data protection laws.',
      gdprLabel: 'I consent to having my personal data stored securely according to GDPR guidelines to provide my custom programs.',
      submitBtn: 'Create Account',
      submitBtnLoading: 'Creating account...',
      footerText: 'Already have an account?',
      footerLink: 'Log In'
    },
    sv: {
      leftTitle: 'Din smarta dashboard väntar',
      leftDesc: 'Registrera dig för att få tillgång till ditt personliga kost- och träningsschema, komplett med steg-för-steg instruktioner, rörliga videor och framstegsrapporter.',
      card1Title: 'VECKANS TRÄNINGSPASS',
      card2Title: 'DAGLIGT KOSTSCHEMA',
      card3Title: 'DAGENS AKTIVA ÖVNINGAR',
      day1: 'Dag 1', day2: 'Dag 2', day3: 'Dag 3',
      chest: 'Bröst', legs: 'Ben', shoulders: 'Axlar',
      kcals: '2 100 / 2 400 kcal',
      ex1: 'Dumbbell Bench Press', ex2: 'Dumbbell Arnold Press', completed: 'Klar',
      secureBadge: 'Säker anslutning. Dina personuppgifter skyddas av 256-bitars SSL-kryptering och lagras helt i enlighet med GDPR-direktivet.',
      gdprLabel: 'Jag samtycker till att mina personuppgifter lagras säkert enligt GDPR för att tillhandahålla mina tränings- och kostprogram.',
      submitBtn: 'Skapa konto',
      submitBtnLoading: 'Skapar konto...',
      footerText: 'Har du redan ett konto?',
      footerLink: 'Logga in'
    }
  }

  const langText = texts[language] || texts.sv

  return (
    <div className={`container ${language === 'fa' ? 'rtl-align' : ''}`} style={{ padding: '40px 24px' }}>
      <div className="register-split-container">
        
        {/* LEFT PANEL - MOCK CLICKUP DASHBOARD HUBS */}
        <div className="register-left-panel">
          <div className="left-panel-header">
            <h1>{langText.leftTitle}</h1>
            <p>{langText.leftDesc}</p>
          </div>

          <div className="mock-dashboard-hub">
            {/* Mock Card 1: Weekly Workout Split */}
            <div className="mock-hub-card">
              <div className="mock-hub-header">
                <span className="mock-hub-title">{langText.card1Title}</span>
                <Calendar size={14} style={{ color: 'var(--accent-gold)' }} />
              </div>
              <div className="mock-days-grid">
                <div className="mock-day-box active" style={{ boxShadow: '0 0 10px rgba(184, 149, 71, 0.15)' }}>
                  <div className="mock-day-name">{langText.day1}</div>
                  <div className="mock-day-type">{langText.chest}</div>
                </div>
                <div className="mock-day-box">
                  <div className="mock-day-name">{langText.day2}</div>
                  <div className="mock-day-type">{langText.legs}</div>
                </div>
                <div className="mock-day-box">
                  <div className="mock-day-name">{langText.day3}</div>
                  <div className="mock-day-type">{langText.shoulders}</div>
                </div>
              </div>
            </div>

            {/* Mock Card 2: Calorie ring progress */}
            <div className="mock-hub-card">
              <div className="mock-hub-header">
                <span className="mock-hub-title">{langText.card2Title}</span>
                <Flame size={14} style={{ color: '#f59e0b' }} />
              </div>
              <div className="mock-stats-row">
                <div className="mock-stat-info">
                  <h4>{langText.kcals}</h4>
                  <span>Proteiner: 175g · Kolhydrater: 220g</span>
                </div>
                <div className="mock-progress-circle">
                  <svg width="48" height="48">
                    <circle cx="24" cy="24" r="20" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                    <circle cx="24" cy="24" r="20" fill="transparent" stroke="var(--accent-gold)" strokeWidth="3" strokeDasharray={2 * Math.PI * 20} strokeDashoffset={2 * Math.PI * 20 * (1 - 0.875)} />
                  </svg>
                  <span style={{ position: 'absolute', fontSize: '0.62rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>87%</span>
                </div>
              </div>
            </div>

            {/* Mock Card 3: Todays exercises list */}
            <div className="mock-hub-card">
              <div className="mock-hub-header">
                <span className="mock-hub-title">{langText.card3Title}</span>
                <Activity size={14} style={{ color: '#10b981' }} />
              </div>
              <div className="mock-exercises-list">
                <div className="mock-ex-item">
                  <span className="mock-ex-name">
                    <CheckCircle2 size={12} style={{ color: '#10b981' }} />
                    {langText.ex1}
                  </span>
                  <span className="mock-ex-status">{langText.completed}</span>
                </div>
                <div className="mock-ex-item">
                  <span className="mock-ex-name">
                    <CheckCircle2 size={12} style={{ color: '#10b981' }} />
                    {langText.ex2}
                  </span>
                  <span className="mock-ex-status">{langText.completed}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="left-panel-footer">
            <div className="footer-badge">
              <ShieldCheck size={14} style={{ color: 'var(--accent-gold)' }} />
              <span>Muscle & Focus PT</span>
            </div>
            <div className="footer-badge">
              <span>8+ år erfarenhet</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - REGISTRATION FORM */}
        <div className="register-right-panel">
          <div className="right-panel-header">
            <h2>{language === 'fa' ? 'ایجاد حساب کاربری' : language === 'en' ? 'Register Account' : 'Skapa konto'}</h2>
            <p>{language === 'fa' ? 'برای پیگیری برنامه‌ها و خدمات خود ثبت نام کنید.' : language === 'en' ? 'Sign up to track your plans and training history.' : 'Registrera dig för att se dina paket och träningshistorik.'}</p>
          </div>

          {/* Secure connection SSL indicator */}
          <div className="ssl-secure-badge">
            <ShieldCheck size={20} className="ssl-icon" />
            <div className="ssl-text">{langText.secureBadge}</div>
          </div>

          {error && (
            <div className="form-error" style={{ marginBottom: '18px' }}>
              <AlertCircle size={18} className="error-icon" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form-grid">
            {/* Full name field */}
            <div className="register-form-group">
              <label htmlFor="fullName">{language === 'fa' ? 'نام و نام خانوادگی' : language === 'en' ? 'Full Name' : 'Fullständigt namn'}</label>
              <div className="register-input-wrapper">
                <User size={16} className="field-icon" />
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

            {/* Phone number field */}
            <div className="register-form-group">
              <label htmlFor="phoneNumber">{language === 'fa' ? 'شماره تلفن' : language === 'en' ? 'Phone Number' : 'Telefonnummer'}</label>
              <div className="register-input-wrapper">
                <Phone size={16} className="field-icon" />
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

            {/* Email field */}
            <div className="register-form-group">
              <label htmlFor="email">{language === 'fa' ? 'پست الکترونیکی (ایمیل)' : language === 'en' ? 'Email Address' : 'E-postadress'}</label>
              <div className="register-input-wrapper">
                <Mail size={16} className="field-icon" />
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

            {/* Password field with interactive strength meter */}
            <div className="register-form-group">
              <label htmlFor="password">{language === 'fa' ? 'رمز عبور' : language === 'en' ? 'Password' : 'Lösenord'}</label>
              <div className="register-input-wrapper">
                <Lock size={16} className="field-icon" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              {password && (
                <div className="password-strength-container">
                  <div className="strength-header">
                    <span>{language === 'fa' ? 'امنیت رمز عبور:' : language === 'en' ? 'Password strength:' : 'Lösenordsstyrka:'}</span>
                    <span style={{ fontWeight: 'bold' }}>{getStrengthLabel(strengthScore)}</span>
                  </div>
                  <div className={`strength-bar-wrapper strength-${strengthScore}`}>
                    <div className="strength-segment"></div>
                    <div className="strength-segment"></div>
                    <div className="strength-segment"></div>
                    <div className="strength-segment"></div>
                  </div>
                </div>
              )}
            </div>

            {/* GDPR acceptance checkbox */}
            <div className="gdpr-checkbox-wrapper" onClick={() => setGdprAccepted(!gdprAccepted)}>
              <input
                type="checkbox"
                checked={gdprAccepted}
                onChange={() => {}} // Controlled by wrapper click
                required
              />
              <span className="gdpr-text">{langText.gdprLabel}</span>
            </div>

            {/* Submit button */}
            <button type="submit" className="btn-register-submit" disabled={loading}>
              {loading ? langText.submitBtnLoading : langText.submitBtn}
              <ChevronRight size={18} />
            </button>
          </form>

          {/* Footer link to login page */}
          <div className="register-footer-link">
            <span>{langText.footerText}</span>
            <Link to="/login">{langText.footerLink}</Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ClientRegister
