import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Globe, LogOut } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import './Navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo" onClick={closeMenu} aria-label="Muscle & Focus">
          <span className="logo-tile"><img src="/logo.png" alt="" className="logo-img" /></span>
          <span className="logo-wordmark">Muscle <span aria-hidden="true">&amp;</span> Focus</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-links">
          <Link to="/paket" className={`nav-link ${isActive('/paket')}`}>{t('packages')}</Link>
          <Link to="/bmi" className={`nav-link ${isActive('/bmi')}`}>{t('bmiCalculator')}</Link>
          <Link to="/hitta-kompis" className={`nav-link ${isActive('/hitta-kompis')}`}>{t('hittaKompis')}</Link>
          <Link to="/licenser" className={`nav-link ${isActive('/licenser')}`}>{t('licenses')}</Link>
        </div>

        <div className="navbar-actions">
          <div className="lang-selector-container">
            <Globe size={15} className="lang-globe-icon" aria-hidden="true" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="lang-select-dropdown"
              aria-label={language === 'fa' ? 'انتخاب زبان' : language === 'en' ? 'Select language' : 'Välj språk'}
            >
              <option value="sv">Svenska</option>
              <option value="en">English</option>
              <option value="fa">فارسی</option>
            </select>
          </div>

          {localStorage.getItem('client_token') ? (
            <>
              <Link to="/profil" className={`nav-link ${isActive('/profil')}`}>{t('clientProfile')}</Link>
              <button onClick={() => {
                localStorage.removeItem('client_token');
                localStorage.removeItem('client_user');
                localStorage.removeItem('client_name');
                window.location.href = '/';
              }} className="nav-link nav-link-button nav-icon-button" aria-label={t('clientLogout')} title={t('clientLogout')}>
                <LogOut size={17} aria-hidden="true" />
              </button>
            </>
          ) : (
            <Link to="/login" className={`nav-link ${isActive('/login')}`}>{t('clientLogin')}</Link>
          )}

          <Link to="/ansok" className={`btn-apply ${isActive('/ansok')}`}>{t('apply')}</Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button className="mobile-toggle" onClick={toggleMenu} aria-label={language === 'fa' ? 'باز/بستن منو' : language === 'en' ? 'Toggle menu' : 'Öppna/stäng meny'}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu glass-panel ${isOpen ? 'open' : ''}`}>
        <div className="mobile-lang-row">
          <Globe size={18} className="lang-globe-icon" />
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)} 
            className="lang-select-dropdown mobile-lang-select"
            aria-label={language === 'fa' ? 'انتخاب زبان' : language === 'en' ? 'Select language' : 'Välj språk'}
          >
            <option value="sv">Svenska</option>
            <option value="en">English</option>
            <option value="fa">فارسی</option>
          </select>
        </div>
        <Link to="/" className={`mobile-link ${isActive('/')}`} onClick={closeMenu}>{t('home')}</Link>
        <Link to="/bmi" className={`mobile-link ${isActive('/bmi')}`} onClick={closeMenu}>{t('bmiCalculator')}</Link>
        <Link to="/paket" className={`mobile-link ${isActive('/paket')}`} onClick={closeMenu}>{t('packages')}</Link>
        <Link to="/hitta-kompis" className={`mobile-link ${isActive('/hitta-kompis')}`} onClick={closeMenu}>{t('hittaKompis')}</Link>
        <Link to="/licenser" className={`mobile-link ${isActive('/licenser')}`} onClick={closeMenu}>{t('licenses')}</Link>
        <Link to="/villkor" className={`mobile-link ${isActive('/villkor')}`} onClick={closeMenu}>{t('termsLink')}</Link>
        <Link to="/ansok" className="mobile-link mobile-btn-apply" onClick={closeMenu}>{t('apply')}</Link>
        
        {localStorage.getItem('client_token') ? (
          <>
            <Link to="/profil" className={`mobile-link ${isActive('/profil')}`} onClick={closeMenu}>{t('clientProfile')}</Link>
            <button onClick={() => {
              localStorage.removeItem('client_token');
              localStorage.removeItem('client_user');
              localStorage.removeItem('client_name');
              closeMenu();
              window.location.href = '/';
            }} className="mobile-link" style={{ width: '100%', textAlign: 'inherit', background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', color: 'inherit', display: 'block', padding: '12px 24px' }}>
              {t('clientLogout')}
            </button>
          </>
        ) : (
          <Link to="/login" className={`mobile-link ${isActive('/login')}`} onClick={closeMenu}>{t('clientLogin')}</Link>
        )}

      </div>
    </nav>
  )
}

export default Navbar
