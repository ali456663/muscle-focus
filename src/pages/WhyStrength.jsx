import React from 'react'
import { Link } from 'react-router-dom'
import { Activity, Heart, CheckCircle2, Sparkles } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import './WhyStrength.css'

function WhyStrength({ isHomepage = false }) {
  const { t, language } = useLanguage()
  const physicalFeatures = t('benefitsFysiskFeatures') || []
  const mentalFeatures = t('benefitsMentalFeatures') || []
  usePageTitle('whyStrength')

  return (
    <div className={isHomepage ? `why-strength-section ${language === 'fa' ? 'rtl-align' : ''}` : `why-strength-page ${language === 'fa' ? 'rtl-align' : ''}`}>
      <div className="container">
        {/* Conditionally render header based on homepage embedding */}
        {!isHomepage ? (
          <header className="page-hero">
            <span className="subtitle badge-campaign">{t('benefitsSubtitle')}</span>
            <h1 className="page-title">{t('benefitsTitle')}</h1>
            <p className="page-intro">
              {t('whyStrengthIntro')}
            </p>
          </header>
        ) : (
          <div className="section-header center" style={{ marginBottom: '50px', marginTop: '50px' }}>
            <span className="subtitle">{t('benefitsSubtitle')}</span>
            <h2>{language === 'fa' ? 'چرا باید بدنسازی کار کنم؟' : language === 'en' ? 'Why should I strength train?' : 'Varför ska jag styrketräna?'}</h2>
          </div>
        )}

        {/* Two Column Grid: Physical vs Mental */}
        <div className="benefits-columns">
          {/* Physical Benefits Column */}
          <section className="benefits-column glass-panel">
            <div className="column-header">
              <Activity className="column-icon physical" />
              <h2>{t('benefitsFysiskTitle')}</h2>
            </div>
            <p className="column-intro">
              {language === 'fa'
                ? 'تغییرات عمیقی که در عضلات، استخوان‌ها و سیستم قلبی عروقی شما رخ می‌دهد و عملکرد روزانه شما را بهبود می‌بخشد.'
                : language === 'en'
                ? 'Profound changes that occur in your muscles, bones, and cardiovascular system, enhancing your daily physical capacity.'
                : 'Djupgående fysiologiska förändringar som stärker dina muskler, skelett och hjärt-kärlsystem för ökad fysisk kapacitet.'}
            </p>
            <div className="benefits-list">
              {physicalFeatures.map((feat, idx) => {
                const parts = feat.split(':')
                const title = parts[0]
                const content = parts.slice(1).join(':')
                return (
                  <div key={idx} className="benefit-item">
                    <CheckCircle2 className="benefit-check-icon physical" />
                    <div className="benefit-text">
                      <h3>{title}</h3>
                      <p>{content}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Mental Benefits Column */}
          <section className="benefits-column glass-panel">
            <div className="column-header">
              <Heart className="column-icon mental" />
              <h2>{t('benefitsMentalTitle')}</h2>
            </div>
            <p className="column-intro">
              {language === 'fa'
                ? 'تاثیرات شگفت‌انگیز ورزش بر شیمی مغز، کاهش اضطراب، بهبود کیفیت خواب و افزایش تمرکز ذهنی.'
                : language === 'en'
                ? 'Amazing effects of training on brain chemistry, reducing anxiety, improving sleep quality, and sharpening focus.'
                : 'Vetenskapligt bevisade effekter på hjärnans kemi som reducerar stress, förbättrar sömnen och skärper ditt mentala fokus.'}
            </p>
            <div className="benefits-list">
              {mentalFeatures.map((feat, idx) => {
                const parts = feat.split(':')
                const title = parts[0]
                const content = parts.slice(1).join(':')
                return (
                  <div key={idx} className="benefit-item">
                    <CheckCircle2 className="benefit-check-icon mental" />
                    <div className="benefit-text">
                      <h3>{title}</h3>
                      <p>{content}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* Quote/Summary Section (Only rendered on the standalone page) */}
        {!isHomepage && (
          <section className="strength-summary glass-panel">
            <div className="summary-glow"></div>
            <div className="summary-content">
              <Sparkles className="summary-icon" />
              <blockquote>
                {language === 'fa'
                  ? '"قدرت درونی از پیروزی به دست نمی‌آید. چالش‌های شما هستند که نقاط قوت شما را می‌سازند. وقتی سختی‌ها را پشت سر می‌گذارید و تسلیم نمی‌شوید، این همان قدرت واقعی است."'
                  : language === 'en'
                  ? '"Strength does not come from winning. Your struggles develop your strengths. When you go through hardships and decide not to surrender, that is strength."'
                  : '"Styrka handlar inte om vad du kan göra. Det handlar om att övervinna de saker du en gång trodde att du inte kunde göra."'}
              </blockquote>
              <cite>— Muscle & Focus Philosophy</cite>
              <div className="summary-actions">
                <Link to="/ansok" className="btn-primary">
                  {language === 'fa' ? 'امروز شروع کنید' : language === 'en' ? 'Start your journey today' : 'Påbörja din resa idag'}
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default WhyStrength
