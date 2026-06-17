import React from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, Mail } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import './Footer.css'

function Footer() {
  const { t, language } = useLanguage()

  return (
    <footer className="footer">
      <div className="footer-top container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img src="/logo.png" alt="Muscle & Focus Logo" className="footer-logo-img" loading="lazy" />
          </Link>
          <p className="brand-tagline">
            {t('footerTagline')}
          </p>
          <div className="social-links">
            <a href="https://instagram.com/musclefocus1" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0 -5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="https://wa.me/46700361289" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <MessageSquare size={20} />
            </a>
          </div>
        </div>

        <div className="footer-links-group">
          <h3>{t('footerNavTitle')}</h3>
          <Link to="/">{t('home')}</Link>
          <Link to="/paket">{t('packages')}</Link>
          <Link to="/licenser">{t('licenses')}</Link>
          <Link to="/ansok">{t('apply')}</Link>
          <Link to="/admin" style={{ opacity: 0.5, fontSize: '0.85rem', marginTop: '4px' }}>{t('admin')}</Link>
        </div>

        <div className="footer-links-group">
          <h3>{t('footerInfoTitle')}</h3>
          <Link to="/varfor-styrketrana">{t('whyStrengthLink')}</Link>
          <Link to="/ideal-klient">{t('idealLink')}</Link>
          <Link to="/villkor">{t('termsLink')}</Link>
        </div>

        <div className="footer-contact">
          <h3>{t('footerContactTitle')}</h3>
          <a href="mailto:info.musclefocus@gmail.com" className="contact-item">
            <Mail size={16} />
            <span>info.musclefocus@gmail.com</span>
          </a>
          <a href="tel:+46700361289" className="contact-item">
            <MessageSquare size={16} />
            <span>+46 (0) 70-036 12 89</span>
          </a>
          <p className="support-hours">
            {t('footerSupportHours')}
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container container">
          <p>&copy; {new Date().getFullYear()} Muscle & Focus. {language === 'fa' ? 'تمامی حقوق محفوظ است.' : language === 'en' ? 'All rights reserved.' : 'Alla rättigheter reserverade.'}</p>
          <p className="author-credit">{language === 'fa' ? 'طراحی شده توسط مربی رسمی علی وفا' : language === 'en' ? 'Created by Lic. PT Ali Wafa' : 'Skapad av Lic. PT Ali Wafa'}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
