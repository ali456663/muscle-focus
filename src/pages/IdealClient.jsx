import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Calendar, Briefcase, Info, Target, AlertTriangle, Heart, HelpCircle, Compass, Check, Globe } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import './IdealClient.css'

function IdealClient({ isHomepage = false }) {
  const { t, language } = useLanguage()
  const goals = t('idealGoals') || []
  const challenges = t('idealChallenges') || []
  const painPoints = t('idealPain') || []
  const coachingNeeds = t('idealSearch') || []
  usePageTitle('idealClient')
  const values = t('idealValues') || []
  const online = t('idealOnline') || []

  const [activeTab, setActiveTab] = useState('goals')

  return (
    <div className={isHomepage ? `ideal-client-section ${language === 'fa' ? 'rtl-align' : ''}` : `ideal-client-page ${language === 'fa' ? 'rtl-align' : ''}`}>
      <div className="container">
        {/* Conditionally render header based on homepage embedding */}
        {!isHomepage ? (
          <header className="page-hero">
            <span className="subtitle badge-campaign">{t('idealSubtitle')}</span>
            <h1 className="page-title">{t('idealTitle')}</h1>
            <p className="page-intro">
              {t('idealIntro')}
            </p>
          </header>
        ) : (
          <div className="section-header center" style={{ marginBottom: '50px', marginTop: '30px' }}>
            <span className="subtitle">{t('idealSubtitle')}</span>
            <h2>{t('idealTitle')}</h2>
          </div>
        )}

        <div className="persona-container">
          {/* Left Card: Persona Profile Card */}
          <section className="persona-profile-card glass-panel">
            <div className="avatar-wrapper">
              <div className="avatar-placeholder" style={{ padding: '0', overflow: 'hidden' }}>
                <img src="/sofie_persona.png" alt="Sofie" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="avatar-glow"></div>
            </div>
            <h2>{t('idealName').replace('Namn: ', '').replace('Name: ', '').replace('نام: ', '')}</h2>
            <span className="persona-badge">
              {language === 'fa' ? 'مشتری ایده‌آل ما' : language === 'en' ? 'Our Ideal Client' : 'Vår Typklient'}
            </span>

            <div className="profile-details">
              <div className="detail-item">
                <Calendar size={18} className="detail-icon" />
                <span>{t('idealAge')}</span>
              </div>
              <div className="detail-item">
                <Briefcase size={18} className="detail-icon" />
                <span>{t('idealJob')}</span>
              </div>
              <div className="detail-item bio-item">
                <Info size={18} className="detail-icon bio-icon" />
                <p>{t('idealSituation')}</p>
              </div>
            </div>
          </section>

          {/* Right Section: Details Tabs */}
          <section className="persona-details-panel glass-panel">
            {/* Tab Headers */}
            <div className="tab-headers">
              <button 
                className={`tab-btn ${activeTab === 'goals' ? 'active' : ''}`}
                onClick={() => setActiveTab('goals')}
              >
                <Target size={16} />
                <span>{t('idealGoalsTitle')}</span>
              </button>
              <button 
                className={`tab-btn ${activeTab === 'challenges' ? 'active' : ''}`}
                onClick={() => setActiveTab('challenges')}
              >
                <HelpCircle size={16} />
                <span>{t('idealChallengesTitle')}</span>
              </button>
              <button 
                className={`tab-btn ${activeTab === 'values' ? 'active' : ''}`}
                onClick={() => setActiveTab('values')}
              >
                <Heart size={16} />
                <span>{t('idealValuesTitle')}</span>
              </button>
              <button 
                className={`tab-btn ${activeTab === 'pain' ? 'active' : ''}`}
                onClick={() => setActiveTab('pain')}
              >
                <AlertTriangle size={16} />
                <span>{language === 'fa' ? 'دغدغه‌ها' : language === 'en' ? 'Pain Points' : 'Smärtpunkter'}</span>
              </button>
              <button 
                className={`tab-btn ${activeTab === 'coach' ? 'active' : ''}`}
                onClick={() => setActiveTab('coach')}
              >
                <Compass size={16} />
                <span>{language === 'fa' ? 'نیاز از مربی' : language === 'en' ? 'Coaching Needs' : 'Söker hos coach'}</span>
              </button>
              <button 
                className={`tab-btn ${activeTab === 'online' ? 'active' : ''}`}
                onClick={() => setActiveTab('online')}
              >
                <Globe size={16} />
                <span>{t('idealOnlineTitle').split(' ')[0]}</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="tab-content">
              {activeTab === 'goals' && (
                <div className="tab-pane">
                  <h2>{t('idealGoalsTitle')}</h2>
                  <p className="pane-intro">
                    {language === 'fa'
                      ? 'آنچه سوفی می‌خواهد با شروع برنامه مربیگری ما به دست آورد:'
                      : language === 'en'
                      ? 'What Sofie wants to achieve by starting our coaching program:'
                      : 'Vad Sofie vill uppnå genom att påbörja vårt coachningsprogram:'}
                  </p>
                  <ul className="details-list">
                    {goals.map((item, idx) => (
                      <li key={idx}>
                        <Check className="list-check" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'challenges' && (
                <div className="tab-pane">
                  <h2>{t('idealChallengesTitle')}</h2>
                  <p className="pane-intro">
                    {language === 'fa'
                      ? 'موانعی که در زندگی روزمره مانع از رسیدن سوفی به اهدافش می‌شود:'
                      : language === 'en'
                      ? 'Obstacles in daily life preventing Sofie from reaching her goals:'
                      : 'Hinder i vardagen som gör det svårt för Sofie att nå sina mål på egen hand:'}
                  </p>
                  <ul className="details-list">
                    {challenges.map((item, idx) => (
                      <li key={idx}>
                        <span className="bullet-indicator danger">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'values' && (
                <div className="tab-pane">
                  <h2>{t('idealValuesTitle')}</h2>
                  <p className="pane-intro">
                    {language === 'fa'
                      ? 'ارزش‌های کلیدی سوفی در زندگی و مسیر تحول سلامتی‌اش:'
                      : language === 'en'
                      ? 'Sofie\'s key values in life and her wellness journey:'
                      : 'Sofies grundläggande värderingar i livet och för sin hälsoresa:'}
                  </p>
                  <ul className="details-list">
                    {values.map((item, idx) => (
                      <li key={idx}>
                        <Check className="list-check success" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'pain' && (
                <div className="tab-pane">
                  <h2>{t('idealPainTitle')}</h2>
                  <p className="pane-intro">
                    {language === 'fa'
                      ? 'احساسات منفی و دغدغه‌های روزانه‌ای که سوفی با آن‌ها روبرو است:'
                      : language === 'en'
                      ? 'Negative feelings and daily friction Sofie currently experiences:'
                      : 'Fysisk och mental friktion som tynger Sofie i hennes nuvarande vardag:'}
                  </p>
                  <ul className="details-list">
                    {painPoints.map((item, idx) => (
                      <li key={idx}>
                        <span className="bullet-indicator warning">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'coach' && (
                <div className="tab-pane">
                  <h2>{t('idealSearchTitle')}</h2>
                  <p className="pane-intro">
                    {language === 'fa'
                      ? 'ویژگی‌هایی که سوفی در یک مربی شخصی جستجو می‌کند تا به او اعتماد کند:'
                      : language === 'en'
                      ? 'What Sofie looks for in a personal trainer to trust them with her journey:'
                      : 'Vad Sofie prioriterar hos en PT för att känna sig motiverad och trygg:'}
                  </p>
                  <ul className="details-list">
                    {coachingNeeds.map((item, idx) => (
                      <li key={idx}>
                        <Check className="list-check success" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'online' && (
                <div className="tab-pane">
                  <h2>{t('idealOnlineTitle')}</h2>
                  <p className="pane-intro">
                    {language === 'fa'
                      ? 'کانال‌ها و بسترهایی که سوفی بیشترین زمان خود را در فضای مجازی در آن‌ها سپری می‌کند:'
                      : language === 'en'
                      ? 'Channels and platforms where Sofie spends most of her time online:'
                      : 'Platser och plattformar där Sofie är mest aktiv i digitala medier:'}
                  </p>
                  <ul className="details-list">
                    {online.map((item, idx) => (
                      <li key={idx}>
                        <span className="bullet-indicator info" style={{ color: 'var(--accent-cyan)' }}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Conditionally render CTA/Philosophy if not on homepage */}
        {!isHomepage && (
          <section className="client-philosophy glass-panel">
            <h2>
              {language === 'fa' 
                ? 'برنامه ما چگونه به سوفی کمک می‌کند؟' 
                : language === 'en' 
                ? 'How we solve Sofie\'s puzzle' 
                : 'Hur vi hjälper Sofie att lyckas'}
            </h2>
            <p>
              {language === 'fa'
                ? 'برنامه‌های هیبریدی Muscle & Focus دقیقاً برای افرادی مانند سوفی طراحی شده است. ما با ترکیب جلسات حضوری تکنیک‌محور و مربیگری مستمر آنلاین، مشکل کمبود زمان و سردرگمی در رژیم‌های غذایی را حل می‌کنیم. با ارائه ساختار منظم و پیگیری‌های هفتگی، انگیزه او را بالا نگه می‌داریم تا بدون فشار بیش از حد، سلامتی خود را در زندگی پرمشغله‌اش ادغام کند.'
                : language === 'en'
                ? 'Muscle & Focus hybrid programs are designed specifically for busy individuals like Sofie. By combining physical on-site sessions for safe lifting and digital daily coaching, we solve the scheduling conflict. We provide structure, weekly follow-ups, and simple meal plans that integrate seamlessly into a busy routine.'
                : 'Vårt hybridprogram är skapat speciellt för att lösa Sofies vardagspussel. Genom att kombinera fysiska PT-pass för säker teknik med digital coachning i mobilen, ger vi henne strukturen, stödet och de enkla verktyg hon behöver för att nå sina mål – helt anpassat efter hennes kalender.'}
            </p>
            <div className="philosophy-actions">
              <Link to="/ansok" className="btn-primary">
                {language === 'fa' ? 'درخواست مشاوره رایگان' : language === 'en' ? 'Book a free consultation' : 'Boka kostnadsfri konsultation'}
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default IdealClient
