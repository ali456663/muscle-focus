import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Dumbbell, Calendar, Globe, Sparkles, UserCheck, Flame, ChevronRight, Apple, AlertCircle, X } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import './Packages.css'

function Packages() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeModalPackage, setActiveModalPackage] = useState(null)
  const { t, language } = useLanguage()

  const pkgTranslations = t('packagesData')
  
  const packages = [
    // Campaigns
    {
      id: 'summer',
      category: 'campaign',
      icon: Flame,
      image: '/summer_campaign.png'
    },
    {
      id: 'black-friday',
      category: 'campaign',
      icon: Flame,
      image: '/black_friday.jpg'
    },
    {
      id: 'christmas',
      category: 'campaign',
      icon: Flame,
      image: '/christmas.jpg'
    },
    // Long-term online PT
    {
      id: 'pt-online-26',
      category: 'online-long',
      icon: Dumbbell,
      image: '/pt_online_26.png'
    },
    {
      id: 'next-level-26',
      category: 'online-long',
      icon: Globe,
      image: '/next_level_26.jpg'
    },
    {
      id: 'body-reboot-26',
      category: 'online-long',
      icon: Sparkles,
      image: '/body_reboot_26.jpg'
    },
    {
      id: 'lifestyle-16',
      category: 'online-long',
      icon: UserCheck,
      image: '/lifestyle_16.png'
    },
    {
      id: 'glute-leg-16',
      category: 'online-long',
      icon: UserCheck,
      image: '/glute_leg_16.png'
    },
    // Short-term online PT
    {
      id: 'fokus-12',
      category: 'online-short',
      icon: Calendar,
      image: '/fokus_12.png'
    },
    {
      id: 'health-8',
      category: 'online-short',
      icon: Calendar,
      image: '/health_8.png'
    },
    {
      id: 'kickstart-4',
      category: 'online-short',
      icon: Calendar,
      image: '/kickstart_4.png'
    },
    // Physical & Nutrition
    {
      id: 'nutrition',
      category: 'physical-nutrition',
      icon: Apple,
      image: '/nutrition.png'
    },
    {
      id: 'tech-60',
      category: 'physical-nutrition',
      icon: Dumbbell,
      image: '/tech_60.jpg'
    },
    {
      id: 'individual-pt',
      category: 'physical-nutrition',
      icon: Dumbbell,
      image: '/individual_pt.jpg'
    }
  ].map(pkg => ({
    ...pkg,
    ...pkgTranslations[pkg.id]
  }))

  const categoriesList = t('packagesCategories')
  const categories = [
    { id: 'all', name: categoriesList.all },
    { id: 'campaign', name: categoriesList.campaign },
    { id: 'online-long', name: categoriesList['online-long'] },
    { id: 'online-short', name: categoriesList['online-short'] },
    { id: 'physical-nutrition', name: categoriesList['physical-nutrition'] }
  ]

  const filteredPackages = activeCategory === 'all' 
    ? packages 
    : packages.filter(p => p.category === activeCategory)

  return (
    <div className={`packages-page container ${language === 'fa' ? 'rtl-align' : ''}`}>
      <div className="packages-header section-header center">
        <span className="subtitle">{t('packagesSubtitle')}</span>
        <h2>{t('packagesTitle')}</h2>
        <p className="packages-intro">
          {t('packagesIntro')}
        </p>
      </div>

      {/* Categories Filter Tabs */}
      <div className="categories-filter">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`filter-tab ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Packages Grid */}
      <div className="packages-grid">
        {filteredPackages.map(pkg => {
          const IconComponent = pkg.icon
          const isCampaign = pkg.category === 'campaign'

          return (
            <div 
              key={pkg.id} 
              className={`package-card glass-panel ${isCampaign ? 'campaign-highlight' : ''} ${pkg.image ? 'with-image' : ''}`}
            >
              {pkg.image && (
                <div className="pkg-image-wrapper" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#060b13' }}>
                  {/* Blurred background image to fill the card width beautifully for portrait images */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url(${pkg.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center top',
                      filter: 'blur(10px) brightness(0.6)',
                      transform: 'scale(1.1)',
                      zIndex: 1
                    }}
                  />
                  {/* Centered contained actual image showing the full picture from head to toe */}
                  <img 
                    src={pkg.image} 
                    alt={pkg.title} 
                    className="pkg-card-img" 
                    style={{ 
                      position: 'relative',
                      zIndex: 2,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }} 
                  />
                </div>
              )}

              {pkg.badge && (
                <span className={`pkg-badge ${isCampaign ? 'badge-campaign' : 'badge-standard'}`}>
                  {pkg.badge}
                </span>
              )}
              
              <div className="pkg-header">
                <IconComponent className="pkg-icon" />
                <h3 className="pkg-title">{pkg.title}</h3>
                <span className="pkg-duration">{pkg.duration}</span>
              </div>

              <div className="pkg-price-container">
                <span className="pkg-price">{pkg.price}</span>
                <span className="pkg-subprice">{pkg.subPrice}</span>
              </div>

              <ul className="pkg-features">
                {pkg.features && pkg.features.map((feat, idx) => {
                  const isLevel = idx === 0
                  return (
                    <li key={idx} className={isLevel ? 'pkg-level-feature' : ''}>
                      {isLevel ? (
                        <Sparkles size={14} className="feature-bullet level-bullet" style={{ color: 'var(--accent-cyan)' }} />
                      ) : (
                        <ChevronRight size={14} className="feature-bullet" />
                      )}
                      <span style={isLevel ? { fontWeight: '600', color: 'var(--accent-cyan)' } : {}}>{feat}</span>
                    </li>
                  )
                })}
              </ul>

              <div className="pkg-action">
                {pkg.readMoreFeatures ? (
                  <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                    <button 
                      className="btn-readmore"
                      onClick={() => setActiveModalPackage(pkg)}
                      type="button"
                    >
                      {language === 'fa' ? 'اطلاعات بیشتر' : language === 'en' ? 'Read more' : 'Läs mer'}
                    </button>
                    <Link 
                      to={`/ansok?paket=${encodeURIComponent(pkg.title)}`} 
                      className={`btn-book ${isCampaign ? 'btn-campaign' : 'btn-normal'}`}
                      style={{ flex: 1.3, textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                      {t('packagesBtnBook')}
                    </Link>
                  </div>
                ) : (
                  <Link 
                    to={`/ansok?paket=${encodeURIComponent(pkg.title)}`} 
                    className={`btn-book ${isCampaign ? 'btn-campaign' : 'btn-normal'}`}
                  >
                    {t('packagesBtnBook')}
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Conditions Info Box */}
      <div className="conditions-box glass-panel">
        <h3>{t('conditionsTitle')}</h3>
        <div className="conditions-grid">
          {t('conditionsItems').map((item, idx) => (
            <div key={idx}>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Package Details Modal */}
      {activeModalPackage && (
        <div className="cert-modal-overlay" onClick={() => setActiveModalPackage(null)}>
          <div className="summer-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="cert-modal-close" onClick={() => setActiveModalPackage(null)} aria-label="Stäng modal">
              <X size={20} />
            </button>
            {activeModalPackage.image && (
              <div className="summer-modal-image-wrapper" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#060b13' }}>
                {/* Blurred background image to fill the modal width beautifully for portrait images */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${activeModalPackage.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    filter: 'blur(10px) brightness(0.6)',
                    transform: 'scale(1.1)',
                    zIndex: 1
                  }}
                />
                {/* Centered contained actual image showing the full picture from head to toe */}
                <img 
                  src={activeModalPackage.image} 
                  alt={activeModalPackage.title} 
                  className="summer-modal-img-banner" 
                  style={{ 
                    position: 'relative',
                    zIndex: 2,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }} 
                />
              </div>
            )}
            <div className="summer-modal-body">
              <div className="summer-modal-header">
                <Flame className="modal-flame-icon" />
                <h2>
                  {activeModalPackage.modalTitle || activeModalPackage.title}
                </h2>
              </div>
              
              {activeModalPackage.readMoreIntro && (
                <p className="modal-intro-text" style={{ fontSize: '1.05rem', lineHeight: '1.6', color: 'var(--text-silver)', margin: '5px 0 15px 0' }}>
                  {activeModalPackage.readMoreIntro}
                </p>
              )}
              
              <ul className="modal-features-list">
                {activeModalPackage.readMoreFeatures?.map((feat, idx) => {
                  const hasColon = feat.includes(':')
                  if (hasColon) {
                    const parts = feat.split(':')
                    const title = parts[0]
                    const desc = parts.slice(1).join(':')
                    return (
                      <li key={idx}>
                        <ChevronRight size={18} className="modal-feature-bullet" />
                        <span><strong>{title}:</strong>{desc}</span>
                      </li>
                    )
                  }
                  return (
                    <li key={idx}>
                      <ChevronRight size={18} className="modal-feature-bullet" />
                      <span>{feat}</span>
                    </li>
                  )
                })}
              </ul>

              {activeModalPackage.importantHeader && (
                <div className="modal-important-box">
                  <div className="important-title-row">
                    <AlertCircle className="important-alert-icon" />
                    <h3>{activeModalPackage.importantHeader}</h3>
                  </div>
                  <p style={{ whiteSpace: 'pre-line' }}>{activeModalPackage.importantText}</p>
                </div>
              )}

              <div className="modal-action-row">
                <Link 
                  to={`/ansok?paket=${encodeURIComponent(activeModalPackage.title)}`}
                  className="btn-primary modal-action-btn"
                  onClick={() => setActiveModalPackage(null)}
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  {t('packagesBtnBook')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Packages
