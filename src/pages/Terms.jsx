import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, ShieldAlert, CheckCircle, Mail, MessageSquare } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import './Terms.css'

function Terms() {
  const { t, language } = useLanguage()
  const sections = t('termsSections') || []

  // Helper to scroll to specific section id
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <div className={`terms-page container ${language === 'fa' ? 'rtl-align' : ''}`}>
      {/* Hero Header */}
      <header className="page-hero">
        <span className="subtitle badge-campaign">{t('termsSubtitle')}</span>
        <h1 className="page-title">{t('termsTitle')}</h1>
        <p className="page-intro">
          {t('termsIntro')}
        </p>
      </header>

      <div className="terms-container">
        {/* Sticky Sidebar Outline (Desktop only) */}
        <aside className="terms-sidebar glass-panel">
          <h3>
            <FileText size={18} style={{ marginRight: language === 'fa' ? '0' : '8px', marginLeft: language === 'fa' ? '8px' : '0' }} />
            {language === 'fa' ? 'فهرست مطالب' : language === 'en' ? 'Table of Contents' : 'Innehållsförteckning'}
          </h3>
          <ul>
            {sections.map((sec, idx) => {
              // Only include main numbered headers in sidebar outline
              const isNumbered = /^\d+\./.test(sec.title)
              if (!isNumbered && idx > 0) return null
              return (
                <li key={idx}>
                  <button onClick={() => scrollToSection(`sec-${idx}`)} className="outline-link">
                    {sec.title.split('&')[0].split('(')[0]}
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        {/* Content Panel */}
        <main className="terms-content">
          {sections.map((sec, idx) => {
            const isNumbered = /^\d+\./.test(sec.title)
            return (
              <section 
                key={idx} 
                id={`sec-${idx}`} 
                className={`terms-article-section glass-panel ${isNumbered ? 'main-section' : 'sub-section'}`}
              >
                <h2 className="section-title">
                  {sec.title}
                </h2>
                <div className="section-content">
                  <p>{sec.content}</p>
                </div>
              </section>
            )
          })}

          {/* Quick FAQ/Alert Banner */}
          <div className="terms-alert-banner glass-panel">
            <ShieldAlert className="alert-icon" />
            <div className="alert-text">
              <h3>
                {language === 'fa' 
                  ? 'سوالات بیشتر یا نیاز به پشتیبانی؟' 
                  : language === 'en' 
                  ? 'Further questions or need support?' 
                  : 'Frågor eller funderingar om villkoren?'}
              </h3>
              <p>
                {language === 'fa'
                  ? 'اگر هرگونه سوالی در مورد شرایط خرید، انصراف یا نحوه پرداخت دارید، می‌توانید با پشتیبانی ما تماس بگیرید.'
                  : language === 'en'
                  ? 'If you have any questions regarding the purchase terms, cancellation, or payment methods, please reach out to our support.'
                  : 'Om du har några frågor gällande köpvillkor, ångerrätt eller delbetalning är du alltid välkommen att kontakta oss.'}
              </p>
              <div className="alert-actions">
                <a href="mailto:info.musclefocus@gmail.com" className="alert-contact-btn">
                  <Mail size={16} />
                  <span>info.musclefocus@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Terms
