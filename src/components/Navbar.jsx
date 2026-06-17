import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Globe } from 'lucide-react'
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
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/logo.png" alt="Muscle & Focus Logo" className="logo-img" />
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>{t('home')}</Link>
          <Link to="/bmi" className={`nav-link ${isActive('/bmi')}`}>{t('bmiCalculator')}</Link>
          
          {/* Language Selector next to Hem */}
          <div className="lang-selector-container">
            <Globe size={16} className="lang-globe-icon" />
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)} 
              className="lang-select-dropdown"
              aria-label="Select Language"
            >
              <option value="sv">Svenska</option>
              <option value="en">English</option>
              <option value="fa">فارسی (Persiska)</option>
            </select>
          </div>
          
          <Link to="/paket" className={`nav-link ${isActive('/paket')}`}>{t('packages')}</Link>
          <Link to="/hitta-kompis" className={`nav-link ${isActive('/hitta-kompis')}`}>{t('hittaKompis')}</Link>
          <Link to="/licenser" className={`nav-link ${isActive('/licenser')}`}>{t('licenses')}</Link>
          <Link to="/villkor" className={`nav-link ${isActive('/villkor')}`}>{t('termsLink')}</Link>
          <Link to="/ansok" className={`nav-link btn-apply ${isActive('/ansok')}`}>{t('apply')}</Link>
          <Link to="/admin" className={`nav-link nav-admin ${isActive('/admin')}`}>{t('admin')}</Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle menu">
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
            aria-label="Select Language"
          >
            <option value="sv">Svenska</option>
            <option value="en">English</option>
            <option value="fa">فارسی (Persiska)</option>
          </select>
        </div>
        <Link to="/" className={`mobile-link ${isActive('/')}`} onClick={closeMenu}>{t('home')}</Link>
        <Link to="/bmi" className={`mobile-link ${isActive('/bmi')}`} onClick={closeMenu}>{t('bmiCalculator')}</Link>
        <Link to="/paket" className={`mobile-link ${isActive('/paket')}`} onClick={closeMenu}>{t('packages')}</Link>
        <Link to="/hitta-kompis" className={`mobile-link ${isActive('/hitta-kompis')}`} onClick={closeMenu}>{t('hittaKompis')}</Link>
        <Link to="/licenser" className={`mobile-link ${isActive('/licenser')}`} onClick={closeMenu}>{t('licenses')}</Link>
        <Link to="/villkor" className={`mobile-link ${isActive('/villkor')}`} onClick={closeMenu}>{t('termsLink')}</Link>
        <Link to="/ansok" className="mobile-link mobile-btn-apply" onClick={closeMenu}>{t('apply')}</Link>
        <Link to="/admin" className={`mobile-link ${isActive('/admin')}`} onClick={closeMenu}>{t('admin')}</Link>
      </div>
    </nav>
  )
}

export default Navbar
