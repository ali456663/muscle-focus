import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, ShieldCheck, Check, Sparkles } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import './Certificates.css'

function Certificates() {
  const { t, language } = useLanguage()
  const certList = t('certList') || []
  const [activeCert, setActiveCert] = useState(null)

  return (
    <div className={`certificates-page container ${language === 'fa' ? 'rtl-align' : ''}`}>
      {/* Hero Header */}
      <header className="page-hero">
        <span className="subtitle badge-campaign">{t('certSubtitle')}</span>
        <h1 className="page-title">{t('licenses')}</h1>
        <p className="page-intro">
          {language === 'fa' 
            ? 'آموزش و مربیگری حرفه‌ای تحت استانداردهای بین‌المللی برای تضمین سلامتی و نتایج شما.' 
            : language === 'en' 
            ? 'Professional education and coaching under international standards to guarantee your health and results.' 
            : 'Professionell utbildning och coachning under internationella standarder för att garantera din hälsa och dina resultat.'}
        </p>
      </header>

      {/* Visual Certificates Gallery */}
      <section className="cert-gallery-section">
        <h2 className="gallery-title">
          <Sparkles className="gallery-title-icon" />
          {language === 'fa' ? 'مدارک و گواهینامه‌های رسمی' : language === 'en' ? 'Official Certificates' : 'Mina Licensbevis'}
        </h2>
        <p className="gallery-subtitle">
          {language === 'fa' 
            ? 'برای مشاهده نسخه بزرگتر روی مدارک کلیک کنید' 
            : language === 'en' 
            ? 'Click on the certificates to view them in full size' 
            : 'Klicka på certifikaten för att visa dem i full storlek'}
        </p>

        <div className="cert-gallery-grid">
          {/* Certificate 1: IPT */}
          <div className="cert-gallery-card glass-panel" onClick={() => setActiveCert('ipt')}>
            <div className="cert-img-container">
              <img src="/cert_ipt.png" alt="IntensivePT License" className="cert-gallery-img" />
              <div className="cert-hover-overlay">
                <span className="view-btn">
                  {language === 'fa' ? 'مشاهده مدرک' : language === 'en' ? 'View Certificate' : 'Visa certifikat'}
                </span>
              </div>
            </div>
            <div className="cert-gallery-info">
              <h3>IntensivePT License</h3>
              <p>{language === 'fa' ? 'مربی شخصی و مشاور تغذیه دارای مجوز رسمی' : language === 'en' ? 'Licensed Personal Trainer & Nutritional Advisor' : 'Licensierad Personlig Tränare & Kostrådgivare'}</p>
            </div>
          </div>

          {/* Certificate 2: IPT Advanced */}
          <div className="cert-gallery-card glass-panel" onClick={() => setActiveCert('ipt-advanced')}>
            <div className="cert-img-container">
              <img src="/cert_ipt_advanced.png" alt="IPT Advanced Certificate" className="cert-gallery-img" />
              <div className="cert-hover-overlay">
                <span className="view-btn">
                  {language === 'fa' ? 'مشاهده مدرک' : language === 'en' ? 'View Certificate' : 'Visa certifikat'}
                </span>
              </div>
            </div>
            <div className="cert-gallery-info">
              <h3>IPT Advanced Certificate</h3>
              <p>{language === 'fa' ? 'دوره پیشرفته علم تمرین، آناتومی و دوره‌بندی' : language === 'en' ? 'Advanced training theory, anatomy and periodization' : 'Avancerad träningslära, anatomi och periodisering'}</p>
            </div>
          </div>

          {/* Certificate 3: EREPS */}
          <div className="cert-gallery-card glass-panel" onClick={() => setActiveCert('ereps')}>
            <div className="cert-img-container">
              <img src="/cert_ereps.png" alt="EREPS Certificate" className="cert-gallery-img" />
              <div className="cert-hover-overlay">
                <span className="view-btn">
                  {language === 'fa' ? 'مشاهده مدرک' : language === 'en' ? 'View Certificate' : 'Visa certifikat'}
                </span>
              </div>
            </div>
            <div className="cert-gallery-info">
              <h3>EREPS Registration</h3>
              <p>{language === 'fa' ? 'ثبت رسمی در مربیان ورزشی اروپا (عضویت: SE PROF128584)' : language === 'en' ? 'European Register of Exercise Professionals (Membership: SE PROF128584)' : 'Europeiskt register för tränare (Medlemskap: SE PROF128584)'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Certificates */}
      <section className="cert-detailed-grid">
        {Array.isArray(certList) && certList.map((cert, idx) => (
          <div key={idx} className="cert-detailed-card glass-panel">
            <div className="cert-icon-header">
              <Award className="cert-icon" />
              <span className="cert-number">0{idx + 1}</span>
            </div>
            <h3>{cert.title}</h3>
            <span className="cert-sub">{cert.subtitle}</span>
            <p className="cert-desc">{cert.desc}</p>
          </div>
        ))}
      </section>

      {/* Safety & Quality Section */}
      <section className="safety-section glass-panel">
        <div className="safety-content">
          <div className="safety-text">
            <h2>
              <ShieldCheck className="safety-title-icon" />
              {language === 'fa' 
                ? 'چرا مدرک مربیگری رسمی اهمیت دارد؟' 
                : language === 'en' 
                ? 'Why does a certified trainer matter?' 
                : 'Varför är en licensierad tränare viktig?'}
            </h2>
            <p>
              {language === 'fa'
                ? 'تمرین با مربی دارای مدرک رسمی و معتبر تضمین می‌کند که تمام برنامه‌ریزی‌ها، انتخاب وزنه‌ها و اصلاح تکنیک‌ها بر پایه علم روز آناتومی و فیزیولوژی ورزشی انجام می‌شود. این موضوع نه تنها ریسک مصدومیت را به حداقل می‌رساند، بلکه سرعت رسیدن به نتایج دلخواه را نیز چند برابر می‌کند.'
                : language === 'en'
                ? 'Training with a licensed and certified coach ensures that all planning, weight selection, and technique corrections are based on modern anatomy and sports physiology. This not only minimizes the risk of injury but also accelerates your path to your goals.'
                : 'Att träna med en licensierad tränare garanterar att all programmering, val av belastning och teknikkorrigering sker utifrån vetenskapliga principer inom anatomi och träningsfysiologi. Det minimerar skaderisken och maximerar dina resultat.'}
            </p>
            <ul className="safety-features">
              <li>
                <Check className="safety-check" />
                <span>
                  {language === 'fa'
                    ? 'برنامه‌های کاملاً علمی و تست شده'
                    : language === 'en'
                    ? '100% scientifically backed programs'
                    : 'Evidensbaserad träning och kostupplägg'}
                </span>
              </li>
              <li>
                <Check className="safety-check" />
                <span>
                  {language === 'fa'
                    ? 'تمرکز ویژه روی سلامت مفاصل och ایمنی حرکات'
                    : language === 'en'
                    ? 'Strong focus on joint health and safe lifting'
                    : 'Fokus på säker lyftteknik och ledhälsa'}
                </span>
              </li>
              <li>
                <Check className="safety-check" />
                <span>
                  {language === 'fa'
                    ? 'عضویت رسمی در ثبت مربیان ورزشی اروپا (EREPS)'
                    : language === 'en'
                    ? 'Official registration in EREPS for quality assurance'
                    : 'Registrerad i EREPS för garanterad europeisk standard'}
                </span>
              </li>
            </ul>
          </div>
          <div className="safety-cta">
            <Sparkles className="cta-icon" />
            <h3>
              {language === 'fa'
                ? 'آماده‌اید با اطمینان شروع کنید؟'
                : language === 'en'
                ? 'Ready to train with confidence?'
                : 'Redo att träna med trygghet?'}
            </h3>
            <p>
              {language === 'fa'
                ? 'برنامه‌ای بنویسیم که کاملاً با آناتومی، سطح توان و اهداف شما همخوانی دارد.'
                : language === 'en'
                ? 'Let\'s design a plan that matches your anatomy, current level, and goals.'
                : 'Låt oss designa ett upplägg anpassat efter din anatomi, nivå och dina unika mål.'}
            </p>
            <Link to="/ansok" className="btn-primary">
              {t('apply')}
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox / Modal Overlay */}
      {activeCert && (
        <div className="cert-modal-overlay" onClick={() => setActiveCert(null)}>
          <div className="cert-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="cert-modal-close" onClick={() => setActiveCert(null)}>×</button>
            <img 
              src={
                activeCert === 'ipt' 
                  ? '/cert_ipt.png' 
                  : activeCert === 'ipt-advanced'
                  ? '/cert_ipt_advanced.png'
                  : '/cert_ereps.png'
              } 
              alt="High-resolution certificate view" 
              className="cert-modal-img" 
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Certificates
