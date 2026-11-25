import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Zap, Heart, Award, CheckCircle, Flame, Star, Activity, ExternalLink } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import { useSchemaOrg } from '../hooks/useSchemaOrg'
import IdealClient from './IdealClient'
import WhyStrength from './WhyStrength'
import './Home.css'

function Home() {
  const { t, language } = useLanguage()
  usePageTitle('home')
  useSchemaOrg(['localBusiness', 'person', 'service'])

  return (
    <div className={`home-page ${language === 'fa' ? 'rtl-align' : ''}`}>
      {/* Hero Section */}
      {/* Hero: rubrik och handling först, coachen till höger */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker">{t('heroWelcome').replace(/[\s–-]+$/, '')}</p>
            <h1 className="hero-headline">{t('heroTitle')}</h1>
            <p className="hero-lead">{t('heroText')}</p>
            <div className="hero-actions">
              <Link to="/ansok?paket=Gratis%20provperiod%20(14%20dagar)" className="btn-primary">{t('btnConsultation')}</Link>
              <Link to="/paket" className="btn-secondary">{t('btnPackages')}</Link>
            </div>
            <dl className="hero-facts">
              <div>
                <dt>{language === 'fa' ? 'تجربه' : language === 'en' ? 'Experience' : 'Erfarenhet'}</dt>
                <dd>{language === 'fa' ? 'بیش از ۸ سال' : language === 'en' ? '8+ years' : '8+ år'}</dd>
              </div>
              <div>
                <dt>{language === 'fa' ? 'مربیگری' : language === 'en' ? 'Coaching' : 'Coaching'}</dt>
                <dd>{language === 'fa' ? 'آنلاین و حضوری' : language === 'en' ? 'Online & on-site' : 'Online & på plats'}</dd>
              </div>
              <div>
                <dt>{language === 'fa' ? 'زبان‌ها' : language === 'en' ? 'Languages' : 'Språk'}</dt>
                <dd>{language === 'fa' ? 'چندزبانه' : language === 'en' ? 'Multilingual' : 'Flerspråkig'}</dd>
              </div>
            </dl>
          </div>
          <figure className="hero-portrait">
            <img src="/winter_pt.png" alt={language === 'fa' ? 'علی وفا کنار حمام یخ – Muscle & Focus' : language === 'en' ? 'Ali Wafa at an ice bath – Muscle & Focus' : 'Ali Wafa vid isvaken – Muscle & Focus'} fetchpriority="high" />
            <figcaption>
              <strong>Ali Wafa</strong>
              <span>{language === 'fa' ? 'مربی شخصی دارای مجوز' : language === 'en' ? 'Licensed personal trainer' : 'Licensierad personlig tränare'}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Kampanj: gratis provperiod (tjänsten färdigställs) */}
      <section className="trial-strip">
        <div className="container">
          <Link to="/ansok?paket=Gratis%20provperiod%20(14%20dagar)" className="trial-card">
            <img src="/banner_trainers.png" alt="" className="trial-card-img" loading="lazy" />
            <div className="trial-card-body">
              <h2>{language === 'fa' ? 'دوره آزمایشی رایگان ۲ هفته‌ای را شروع کنید' : language === 'en' ? 'Start your 2-week free trial' : 'Starta din 2-veckors gratis provperiod'}</h2>
              <p>{language === 'fa' ? 'برنامه تمرینی و غذایی شخصی برای دو هفته – رایگان و بدون تعهد.' : language === 'en' ? 'A personal training program and nutrition plan for two weeks – free and with no commitment.' : 'Personligt träningsprogram och kostschema i två veckor – utan kostnad och utan bindning.'}</p>
              <p className="trial-note">
                <img src="/arbete_pagar.png" alt="" width="18" height="18" />
                {language === 'fa' ? 'این سرویس در حال تکمیل است – اعلام علاقه کنید تا با شما تماس بگیریم.' : language === 'en' ? 'This service is being finalized – register your interest and we will contact you.' : 'Tjänsten färdigställs just nu – anmäl intresse så hör vi av oss.'}
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Motivation / Kom i rörelse Section */}
      <section className="motivation-section">
        <div className="container">
          <div className="glass-panel motivation-box" style={{ padding: '48px 40px', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-glass)', boxShadow: 'var(--shadow-neon)', marginBottom: '0' }}>
            <div className="motivation-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', color: 'var(--text-white)', lineHeight: '1.3' }}>
                {t('motivationTitle')}
              </h2>
              <p style={{ color: 'var(--text-silver)', fontSize: '1.05rem', lineHeight: '1.8' }}>
                {t('motivationText1')}
              </p>
              <p style={{ color: 'var(--text-silver)', fontSize: '1.05rem', lineHeight: '1.8' }}>
                {t('motivationText2')}
              </p>
              <p style={{ color: 'var(--accent-gold)', fontSize: '1.1rem', lineHeight: '1.8', fontWeight: '600', fontStyle: 'italic' }}>
                {t('motivationText3')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Health Step Section */}
      <section className="health-step-section">
        <div className="container">
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
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
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
                <img src="/ali_profile.png" alt="Lic. PT Ali Wafa" className="profile-img" loading="lazy" />
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
        </div>
      </section>

      {/* Why Choose Me Section */}
      <section className="why-choose-me-section">
        <div className="container">
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
              <img 
                src="/why_choose_me.png" 
                alt={language === 'fa' ? 'چرا من را انتخاب کنید' : language === 'en' ? 'Why choose me' : 'Varför välja mig'} 
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
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

      {/* Why Strength Section (Detailed) */}
      <WhyStrength isHomepage={true} />

      {/* Ideal Client Persona Section */}
      <IdealClient isHomepage={true} />

      {/* Testimonials (Trustpilot-style) Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header center">
            <span className="subtitle">{t('trustpilotSubtitle')}</span>
            <h2>{t('trustpilotTitle')}</h2>
            
            {/* Trustpilot Score Banner */}
            <div className="trustpilot-score-banner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
              <span className="tp-brand" style={{ fontWeight: '800', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star fill="#00b67a" color="#00b67a" size={20} /> Trustpilot
              </span>
              <div className="tp-stars" style={{ display: 'flex', gap: '3px' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} style={{ background: '#00b67a', padding: '3px', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Star fill="#ffffff" color="#ffffff" size={12} />
                  </div>
                ))}
              </div>
              <span style={{ color: 'var(--text-silver)', fontSize: '0.95rem' }}>
                {t('trustpilotExcellent')} | {t('trustpilotBasedOn')}
              </span>
            </div>
          </div>

          <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '40px' }}>
            {t('reviews') && Array.isArray(t('reviews')) && t('reviews').map((rev, idx) => (
              <div key={idx} className="testimonial-card glass-panel" style={{ padding: '32px', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-dark)', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                <div className="review-stars-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="tp-stars" style={{ display: 'flex', gap: '3px' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div key={s} style={{ background: '#00b67a', padding: '2px', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star fill="#ffffff" color="#ffffff" size={10} />
                      </div>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#00b67a', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#00b67a' }}></span>
                    {language === 'fa' ? 'مشتری تأیید شده' : language === 'en' ? 'Verified Client' : 'Verifierad klient'}
                  </span>
                </div>
                
                <p style={{ color: 'var(--text-silver)', fontSize: '0.95rem', lineHeight: '1.6', flex: 1, fontStyle: 'italic' }}>
                  "{rev.text}"
                </p>
                
                <div className="client-info" style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px', marginTop: 'auto' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-neon), var(--accent-cyan))', color: '#04080f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
                    {rev.name[0]}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--text-white)', fontWeight: '600', margin: 0 }}>{rev.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {language === 'fa' ? 'برنامه مربیگری اختصاصی' : language === 'en' ? 'Tailored Coaching Program' : 'Skräddarsytt coachingprogram'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After Results Section */}
      <section className="results-section">
        <div className="container">
          <div className="section-header center">
            <span className="subtitle">{t('resultsSubtitle')}</span>
            <h2>{t('resultsTitle')}</h2>
            <p style={{ color: 'var(--text-silver)', fontSize: '1.05rem', marginTop: '10px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
              {t('resultsIntro')}
            </p>
          </div>

          <div className="results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginTop: '40px' }}>
            {/* Male result */}
            <div className="result-img-card glass-panel" style={{ padding: '20px', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-dark)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="result-img-wrapper" style={{ width: '100%', aspectRatio: '1.2', borderRadius: 'var(--border-radius-md)', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                <img 
                  src="/transformation_male.png" 
                  alt={language === 'fa' ? 'کاهش وزن و قدرت' : language === 'en' ? 'Weight loss & strength' : 'Viktnedgång & styrka'} 
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--transition-normal)' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-white)', fontWeight: '700', textAlign: 'center', margin: 0 }}>
                {t('resultsMale')}
              </h3>
            </div>

            {/* Female result */}
            <div className="result-img-card glass-panel" style={{ padding: '20px', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-dark)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="result-img-wrapper" style={{ width: '100%', aspectRatio: '1.2', borderRadius: 'var(--border-radius-md)', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                <img 
                  src="/transformation_female.png" 
                  alt={language === 'fa' ? 'چربی‌سوزی و سبک زندگی' : language === 'en' ? 'Fat burning & lifestyle' : 'Fettförbränning & livsstil'} 
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--transition-normal)' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-white)', fontWeight: '700', textAlign: 'center', margin: 0 }}>
                {t('resultsFemale')}
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Samarbetspartners Section */}
      <section className="partners-section">
        <div className="container">
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box glass-panel">
            <div className="cta-glow"></div>
            <h2>{t('ctaTitle')}</h2>
            <p>{t('ctaText')}</p>
            <Link to="/ansok" className="btn-primary">{t('ctaButton')}</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
