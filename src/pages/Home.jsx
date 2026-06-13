import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Zap, Heart, Award, CheckCircle, Flame, Star, Activity, ExternalLink } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import IdealClient from './IdealClient'
import WhyStrength from './WhyStrength'
import './Home.css'

function Home() {
  const { t, language } = useLanguage()

  return (
    <div className={`home-page ${language === 'fa' ? 'rtl-align' : ''}`}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container container">
          <div className="hero-content">
            <span className="hero-tagline badge-campaign">{t('heroTagline')}</span>
            <h1 className="hero-title" style={{ fontSize: '2.8rem', lineHeight: '1.2' }}>
              {t('heroWelcome')}<span className="text-gradient-neon">{t('heroTitle')}</span>
            </h1>
            <p className="hero-text">
              {t('heroText')}
            </p>
            <div className="hero-actions">
              <Link to="/paket" className="btn-primary">{t('btnPackages')}</Link>
              <Link to="/ansok" className="btn-secondary">{t('btnConsultation')}</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-glow"></div>
            <img src="/hero_fitness.png" alt="Träning i gym" className="hero-img" />
            <div className="visual-card glass-panel hero-floating-card">
              <div className="visual-header">
                <Flame className="visual-icon" />
                <span>Muscle & Focus PT</span>
              </div>
              <div className="visual-body">
                <div className="stat-row">
                  <span className="stat-label">Erfarenhet / Experience</span>
                  <span className="stat-value">8+ År</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Stöd / Support</span>
                  <span className="stat-value">Flerspråkigt</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Coaching</span>
                  <span className="stat-value">Online & På plats</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Step Section */}
      <section className="health-step-section container">
        <div className="glass-panel health-box-container" style={{ padding: '40px', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-glass)', boxShadow: 'var(--shadow-cyan)', marginBottom: '50px' }}>
          <div className="health-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--text-white)' }}>{t('healthTitle')}</h2>
            <p className="health-p" style={{ color: 'var(--text-silver)', fontSize: '1.05rem', lineHeight: '1.7' }}>
              {t('healthText')}
            </p>
            <div className="health-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginTop: '10px' }}>
              <div className="health-detail-item" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-white)' }}>{t('healthOnlinePlats').split(':')[0]}:</strong> {t('healthOnlinePlats').split(':')[1]}
              </div>
              <div className="health-detail-item" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-white)' }}>{t('healthLanguage').split(':')[0]}:</strong> {t('healthLanguage').split(':')[1]}
              </div>
              <div className="health-detail-item" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-white)' }}>{t('healthContact').split(':')[0]}:</strong> {t('healthContact').split(':')[1]}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section container">
        <div className="section-header">
          <span className="subtitle">{t('aboutSubtitle')}</span>
          <h2>{t('aboutTitle')}</h2>
        </div>
        <div className="about-grid">
          <div className="about-text-content">
            <h3 className="about-greeting">{t('aboutGreeting')}</h3>
            <p className="about-desc">
              {t('aboutDesc1')}
            </p>
            <p className="about-desc">
              {t('aboutDesc2')}
            </p>
            
            <div className="focus-list">
              <div className="focus-item">
                <CheckCircle className="focus-icon" />
                <div>
                  <h4>{t('whyCommitment')}</h4>
                  <p>{t('whyCommitmentText')}</p>
                </div>
              </div>
              <div className="focus-item">
                <CheckCircle className="focus-icon" />
                <div>
                  <h4>{t('whyExpertise')}</h4>
                  <p>{t('whyExpertiseText')}</p>
                </div>
              </div>
              <div className="focus-item">
                <CheckCircle className="focus-icon" />
                <div>
                  <h4>{t('supportMotivation')}</h4>
                  <p>{t('supportMotivationText')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-visual">
            <div className="profile-img-wrapper glass-panel">
              <img src="/ali_profile.png" alt="Lic. PT Ali Wafa" className="profile-img" />
            </div>
            <div className="about-features glass-panel">
              <div className="loyalty-box">
                <span className="loyalty-badge">{t('loyaltyBadge')}</span>
                <h4>{t('loyaltyTitle')}</h4>
                <p>{t('loyaltyText1')}</p>
                <p><strong>{t('loyaltyText2')}</strong></p>
                <p className="loyalty-note" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                  <em>{t('loyaltyNote')}</em>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Me Section */}
      <section className="why-choose-me-section container" style={{ marginBottom: '80px', marginTop: '50px' }}>
        <div className="section-header">
          <span className="subtitle">{t('whySubtitle')}</span>
          <h2>{t('whyTitle')}</h2>
        </div>
        <div className="why-grid">
          <div className="why-text-content">
            <div className="why-item-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="why-item">
                <strong style={{ color: 'var(--accent-cyan)', display: 'block', fontSize: '1.15rem', marginBottom: '4px' }}>{t('whyCommitment')}</strong>
                <p style={{ color: 'var(--text-muted)' }}>{t('whyCommitmentText')}</p>
              </div>
              <div className="why-item">
                <strong style={{ color: 'var(--accent-cyan)', display: 'block', fontSize: '1.15rem', marginBottom: '4px' }}>{t('whyExpertise')}</strong>
                <p style={{ color: 'var(--text-muted)' }}>{t('whyExpertiseText')}</p>
              </div>
              <div className="why-item">
                <strong style={{ color: 'var(--accent-cyan)', display: 'block', fontSize: '1.15rem', marginBottom: '4px' }}>{t('whyResults')}</strong>
                <p style={{ color: 'var(--text-muted)' }}>{t('whyResultsText')}</p>
              </div>
              <div className="why-item">
                <strong style={{ color: 'var(--accent-cyan)', display: 'block', fontSize: '1.15rem', marginBottom: '4px' }}>{t('whyFlexibility')}</strong>
                <p style={{ color: 'var(--text-muted)' }}>{t('whyFlexibilityText')}</p>
              </div>
            </div>
            
            <div className="why-extra-note" style={{ marginTop: '30px', padding: '20px', background: 'rgba(255, 255, 255, 0.01)', borderRadius: 'var(--border-radius-md)', borderLeft: language === 'fa' ? 'none' : '3px solid var(--accent-neon)', borderRight: language === 'fa' ? '3px solid var(--accent-neon)' : 'none', borderTop: '1px solid var(--border-glass)', borderLeftColor: language === 'fa' ? 'var(--border-glass)' : 'var(--accent-neon)', borderRightColor: language === 'fa' ? 'var(--accent-neon)' : 'var(--border-glass)', borderBottom: '1px solid var(--border-glass)' }}>
              <p style={{ color: 'var(--text-silver)', fontWeight: '600', marginBottom: '8px' }}>
                {t('whyLanguageText')}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                {t('whyTailoredText')}
              </p>
            </div>
          </div>
          
          <div className="why-video-wrapper glass-panel" style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-glass)', boxShadow: 'var(--shadow-cyan)' }}>
            <iframe 
              src="https://drive.google.com/file/d/1LJ2x4Ovv9LHdtDbuOi3D9quzgUEQZXPE/preview?autoplay=1&mute=1"
              width="100%" 
              height="100%" 
              style={{ border: 'none' }} 
              allow="autoplay; encrypted-media" 
              allowFullScreen
              title="Träningsvideo"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Comparison Section (PT vs Alone) */}
      <section className="compare-section">
        <div className="container">
          <div className="section-header center">
            <span className="subtitle">{t('compareSubtitle')}</span>
            <h2>{t('compareTitle')}</h2>
          </div>
          <div className="compare-grid">
            <div className="compare-card self glass-panel">
              <h3>{t('compareSelfTitle')}</h3>
              <ul>
                {t('compareSelfFeatures').map((feat, idx) => {
                  const parts = feat.split(':')
                  return (
                    <li key={idx}>
                      <span className="danger-dot">●</span>
                      <strong>{parts[0]}:</strong>{parts.slice(1).join(':')}
                    </li>
                  )
                })}
              </ul>
            </div>
            
            <div className="compare-card pt glass-panel">
              <div className="card-badge-neon">{t('comparePtBadge')}</div>
              <h3>{t('comparePtTitle')}</h3>
              <ul>
                {t('comparePtFeatures').map((feat, idx) => {
                  const parts = feat.split(':')
                  return (
                    <li key={idx}>
                      <span className="success-dot">✔</span>
                      <strong>{parts[0]}:</strong>{parts.slice(1).join(':')}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section container">
        <div className="section-header">
          <span className="subtitle">{t('benefitsSubtitle')}</span>
          <h2>{t('benefitsTitle')}</h2>
        </div>
        <div className="benefits-grid">
          <div className="benefit-card glass-panel">
            <Activity className="benefit-icon" />
            <h3>{t('benefitsFysiskTitle')}</h3>
            <ul>
              {t('benefitsFysiskFeatures').map((feat, idx) => {
                const parts = feat.split(':')
                return (
                  <li key={idx}>
                    <strong>{parts[0]}:</strong>
                    <span>{parts.slice(1).join(':')}</span>
                  </li>
                )
              })}
            </ul>
          </div>
          
          <div className="benefit-card glass-panel">
            <Heart className="benefit-icon" />
            <h3>{t('benefitsMentalTitle')}</h3>
            <ul>
              {t('benefitsMentalFeatures').map((feat, idx) => {
                const parts = feat.split(':')
                return (
                  <li key={idx}>
                    <strong>{parts[0]}:</strong>
                    <span>{parts.slice(1).join(':')}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="benefits-action-row" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
          <Link to="/varfor-styrketrana" className="btn-secondary">
            {language === 'fa' ? 'اطلاعات بیشتر درباره فواید تمرین' : language === 'en' ? 'Learn more about the benefits' : 'Läs mer om alla fördelar'}
          </Link>
        </div>
      </section>

      {/* Why Strength Section (Detailed) */}
      <WhyStrength isHomepage={true} />

      {/* Ideal Client Persona Section */}
      <IdealClient isHomepage={true} />


      {/* Samarbetspartners Section */}
      <section className="partners-section container" style={{ marginBottom: '80px', marginTop: '50px' }}>
        <div className="section-header center">
          <span className="subtitle">{t('partnersSubtitle')}</span>
          <h2>{t('partnersTitle')}</h2>
        </div>
        <div className="partners-grid">
          {[
            {
              name: 'WeightWorld',
              link: 'https://www.partner-ads.com/se/klikbanner.php?partnerid=55179&bannerid=68421&htmlurl=https://www.weightworld.se/special_offers.html',
              descKey: 'partnerWeightworldDesc',
              icon: <Zap className="partner-card-icon" />
            },
            {
              name: 'Stay Beautiful',
              link: 'https://www.partner-ads.com/se/klikbanner.php?partnerid=55179&bannerid=84654&htmlurl=https://stay-beautiful.se/',
              descKey: 'partnerStaybeautifulDesc',
              icon: <Heart className="partner-card-icon" />
            },
            {
              name: 'Apuls',
              link: 'https://www.partner-ads.com/se/klikbanner.php?partnerid=55179&bannerid=66859&htmlurl=https://apuls24.se/',
              descKey: 'partnerApulsDesc',
              icon: <Activity className="partner-card-icon" />
            },
            {
              name: 'Mindly',
              link: 'https://www.partner-ads.com/se/klikbanner.php?partnerid=55179&bannerid=54613&htmlurl=https://mindly.se/',
              descKey: 'partnerMindlyDesc',
              icon: <ShieldCheck className="partner-card-icon" />
            },
            {
              name: 'Musclepain',
              link: 'https://www.partner-ads.com/se/klikbanner.php?partnerid=55179&bannerid=80073&htmlurl=https://www.musclepain.se/',
              descKey: 'partnerMusclepainDesc',
              icon: <Flame className="partner-card-icon" />
            },
            {
              name: 'Sskbutiken',
              link: 'https://www.partner-ads.com/se/klikbanner.php?partnerid=55179&bannerid=72905&htmlurl=https://sskbutiken.se/',
              descKey: 'partnerSskbutikenDesc',
              icon: <Star className="partner-card-icon" />
            }
          ].map((partner, idx) => (
            <a 
              key={idx} 
              href={partner.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="partner-card glass-panel"
            >
              <div className="partner-icon-wrapper">
                {partner.icon}
              </div>
              <h3>{partner.name}</h3>
              <p className="partner-desc">{t(partner.descKey)}</p>
              <span className="partner-btn">
                {t('visitPartner')} <ExternalLink size={14} style={{ marginLeft: language === 'fa' ? '0' : '6px', marginRight: language === 'fa' ? '6px' : '0' }} />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section container">
        <div className="cta-box glass-panel">
          <div className="cta-glow"></div>
          <h2>{t('ctaTitle')}</h2>
          <p>{t('ctaText')}</p>
          <Link to="/ansok" className="btn-primary">{t('ctaButton')}</Link>
        </div>
      </section>
    </div>
  )
}

export default Home
