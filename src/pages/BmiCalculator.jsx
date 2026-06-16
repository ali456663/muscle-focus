import React, { useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { Star, RotateCcw, AlertCircle, Info, Heart, ArrowRight, HelpCircle, ChevronDown, MessageSquare } from 'lucide-react'
import './BmiCalculator.css'

const faqExtraData = {
  sv: {
    q4: {
      tableTitle: 'Riktlinjer för dagligt energiintag (kcal)',
      womenLabel: 'Kvinnor',
      menLabel: 'Män',
      headers: ['Ålder', 'Låg*', 'Medel*', 'Hög*'],
      palNote: '*Räknat på Physical Activity Level (PAL) 1,4; 1,6 och 1,8, enligt NNR 2023.',
      womenRows: [
        ['18-24 år', '2000', '2200', '2500'],
        ['25-50 år', '1900', '2200', '2400'],
        ['51-70 år', '1700', '2000', '2200'],
        ['>70 år', '1700', '2000', '2200']
      ],
      menRows: [
        ['18-24 år', '2500', '2800', '3200'],
        ['25-50 år', '2400', '2700', '3000'],
        ['51-70 år', '2200', '2500', '2800'],
        ['>70 år', '2100', '2400', '2700']
      ],
      quoteText: 'En schablon över energibehov ger en indikation att utgå från, säger Paula Frösell, legitimerad dietist. Man kan se det som en ungefärlig riktlinje. Vi är alla olika och livet förändras vilket påverkar energibehovet. Genetiska förutsättningar, kroppssammansättning och olika livsfaser såsom klimakteriet, är exempel på sådant som gör varje människas behov av energi unikt. Det handlar därför om att lära känna sig själv för att förstå hur just din egen kropp fungerar.',
      quoteAuthor: 'Paula Frösell',
      quoteRole: 'Legitimerad dietist',
      rememberTitle: 'Kom ihåg!',
      rememberText: 'Siffrorna är bara riktlinjer för vuxna personer. Ditt faktiska behov kan vara både högre och lägre beroende på ämnesomsättning, kroppsbyggnad och hur aktiv du är. Barn och ungdomar behöver ofta mer energi i förhållande till sin storlek eftersom de växer.'
    },
    q5: {
      headers: ['Näringsämne', 'Kilokalorier per gram'],
      rows: [
        ['Protein', '4 kcal'],
        ['Kolhydrater', '4 kcal'],
        ['Kostfibrer', '2 kcal'],
        ['Fett', '9 kcal'],
        ['Alkohol', '7 kcal']
      ],
      comparisonText: 'Det innebär att fett är mer än dubbelt så energirikt som samma mängd kolhydrater eller protein. Exempelvis innehåller 100 gram fett omkring 900 kcal, medan 100 gram kolhydrater ger cirka 400 kalorier.'
    }
  },
  en: {
    q4: {
      tableTitle: 'Guidelines for Daily Energy Intake (kcal)',
      womenLabel: 'Women',
      menLabel: 'Men',
      headers: ['Age', 'Low*', 'Medium*', 'High*'],
      palNote: '*Calculated on Physical Activity Level (PAL) 1.4, 1.6, and 1.8, according to NNR 2023.',
      womenRows: [
        ['18-24 years', '2000', '2200', '2500'],
        ['25-50 years', '1900', '2200', '2400'],
        ['51-70 years', '1700', '2000', '2200'],
        ['>70 years', '1700', '2000', '2200']
      ],
      menRows: [
        ['18-24 years', '2500', '2800', '3200'],
        ['25-50 years', '2400', '2700', '3000'],
        ['51-70 years', '2200', '2500', '2800'],
        ['>70 years', '2100', '2400', '2700']
      ],
      quoteText: 'A template for energy needs provides an indication to start from, says Paula Frösell, registered dietitian. You can see it as an approximate guideline. We are all different and life changes, which affects our energy needs. Genetic factors, body composition, and different stages of life, such as menopause, are examples of what makes each person\'s energy needs unique. It is therefore about getting to know yourself to understand how your own body works.',
      quoteAuthor: 'Paula Frösell',
      quoteRole: 'Registered Dietitian',
      rememberTitle: 'Remember!',
      rememberText: 'The numbers are only guidelines for adults. Your actual needs can be both higher and lower depending on metabolism, body build, and how active you are. Children and adolescents often need more energy in relation to their size because they are growing.'
    },
    q5: {
      headers: ['Nutrient', 'Kilocalories per gram'],
      rows: [
        ['Protein', '4 kcal'],
        ['Carbohydrates', '4 kcal'],
        ['Dietary fiber', '2 kcal'],
        ['Fat', '9 kcal'],
        ['Alcohol', '7 kcal']
      ],
      comparisonText: 'This means that fat is more than twice as energy-dense as the same amount of carbohydrates or protein. For example, 100 grams of fat contains about 900 kcal, while 100 grams of carbohydrates provides about 400 calories.'
    }
  },
  fa: {
    q4: {
      tableTitle: 'دستورالعمل‌های دریافت انرژی روزانه (کیلوکالری)',
      womenLabel: 'زنان',
      menLabel: 'مردان',
      headers: ['سن', 'کم*', 'متوسط*', 'زیاد*'],
      palNote: '*محاسبه شده بر اساس سطح فعالیت بدنی (PAL) ۱.۴، ۱.۶ و ۱.۸، طبق NNR 2023.',
      womenRows: [
        ['۱۸-۲۴ سال', '۲۰۰۰', '۲۲۰۰', '۲۵۰۰'],
        ['۲۵-۵۰ سال', '۱۹۰۰', '۲۲۰۰', '۲۴۰۰'],
        ['۵۱-۷۰ سال', '۱۷۰۰', '۲۰۰۰', '۲۲۰۰'],
        ['۷۰+ سال', '۱۷۰۰', '۲۰۰۰', '۲۲۰۰']
      ],
      menRows: [
        ['۱۸-۲۴ سال', '۲۵۰۰', '۲۸۰۰', '۳۲۰۰'],
        ['۲۵-۵۰ سال', '۲۴۰۰', '۲۷۰۰', '۳۰۰۰'],
        ['۵۱-۷۰ سال', '۲۲۰۰', '۲۵۰۰', '۲۸۰۰'],
        ['۷۰+ سال', '۲۱۰۰', '۲۴۰۰', '۲۷۰۰']
      ],
      quoteText: 'پائولا فروسل، متخصص تغذیه مجاز، می‌گوید: «یک الگوی استاندارد برای نیازهای انرژی، راهنمایی اولیه را ارائه می‌دهد. شما می‌توانید آن را به عنوان یک خط‌مشی تقریبی در نظر بگیرید. همه ما با هم متفاوت هستیم و زندگی تغییر می‌کند، که این امر بر نیازهای انرژی ما تأثیر می‌گذارد. ژنتیک، ترکیب بدنی و مراحل مختلف زندگی مانند یائسگی، نمونه‌هایی هستند که نیاز انرژی هر فرد را منحصربه‌فرد می‌کنند. بنابراین، مهم است که بدن خود را بشناسید تا متوجه شوید بدن شما چگونه کار می‌کند.»',
      quoteAuthor: 'پائولا فروسل',
      quoteRole: 'متخصص تغذیه مجاز',
      rememberTitle: 'به یاد داشته باشید!',
      rememberText: 'این اعداد فقط راهنماهایی برای بزرگسالان هستند. نیاز واقعی شما می‌تواند بسته به متابولیسم، ساختار بدنی و میزان فعالیت شما کمتر یا بیشتر باشد. کودکان و نوجوانان اغلب نسبت به اندازه خود به انرژی بیشتری نیاز دارند زیرا در حال رشد هستند.'
    },
    q5: {
      headers: ['ماده مغذی', 'کیلوکالری در هر گرم'],
      rows: [
        ['پروتئین', '۴ کیلوکالری'],
        ['کربوهیدرات', '۴ کیلوکالری'],
        ['فیبر رژیمی', '۲ کیلوکالری'],
        ['چربی', '۹ کیلوکالری'],
        ['الکل', '۷ کیلوکالری']
      ],
      comparisonText: 'این بدان معناست که چربی بیش از دو برابر کربوهیدرات یا پروتئین انرژی دارد. به عنوان مثال، ۱۰۰ گرم چربی حدود ۹۰۰ کیلوکالری انرژی دارد، در حالی که ۱۰۰ گرم کربوهیدرات حدود ۴۰۰ کالری تأمین می‌کند.'
    }
  }
}

function BmiCalculator() {
  const { t, language } = useLanguage()
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [showFaq, setShowFaq] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)

  const handleCalculate = (e) => {
    e.preventDefault()
    setError('')

    const w = parseFloat(weight)
    const h = parseFloat(height)

    if (isNaN(w) || w <= 0) {
      setError(language === 'fa' ? 'لطفاً وزن معتبری وارد کنید.' : language === 'en' ? 'Please enter a valid weight.' : 'Vänligen ange en giltig vikt.')
      return
    }

    if (isNaN(h) || h <= 0) {
      setError(language === 'fa' ? 'لطفاً قد معتبری وارد کنید.' : language === 'en' ? 'Please enter a valid height.' : 'Vänligen ange en giltig längd.')
      return
    }

    // Trigger spinning Earth animation
    setIsCalculating(true)
    setSpinning(true)
    setResult(null)

    setTimeout(() => {
      setSpinning(false)
      const bmiVal = (w / ((h / 100) ** 2)).toFixed(2)
      const bmiNum = parseFloat(bmiVal)
      let categoryKey = 'bmiNormalweight'

      if (bmiNum < 18.5) {
        categoryKey = 'bmiUnderweight'
      } else if (bmiNum >= 18.5 && bmiNum <= 24.9) {
        categoryKey = 'bmiNormalweight'
      } else if (bmiNum >= 25 && bmiNum <= 29.9) {
        categoryKey = 'bmiOverweight'
      } else {
        categoryKey = 'bmiObesity'
      }

      setResult({
        bmi: bmiVal,
        category: categoryKey,
        weightVal: w,
        heightVal: h
      })
      setIsCalculating(false)
    }, 1500)
  }

  const handleClear = () => {
    setWeight('')
    setHeight('')
    setResult(null)
    setError('')
    setIsCalculating(false)
    setSpinning(false)
  }

  const renderFaqContent = (id, text) => {
    const paragraphs = text.split('\n\n')
    const lang = language === 'fa' ? 'fa' : language === 'en' ? 'en' : 'sv'
    const extra = faqExtraData[lang]

    if (id === 4) {
      return (
        <div className="faq-custom-content faq-q4-content">
          {paragraphs.map((p, idx) => (
            <p key={idx} className="faq-text-p">{p}</p>
          ))}
          
          <div className="faq-tables-wrapper">
            <h4 className="faq-table-subtitle text-gradient-neon">{extra.q4.tableTitle}</h4>
            
            <div className="faq-tables-grid">
              {/* Women Table */}
              <div className="faq-table-container">
                <span className="faq-table-badge women">{extra.q4.womenLabel}</span>
                <div className="table-responsive">
                  <table className="faq-data-table">
                    <thead>
                      <tr>
                        {extra.q4.headers.map((h, i) => <th key={i}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {extra.q4.womenRows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((val, cIdx) => <td key={cIdx}>{val}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Men Table */}
              <div className="faq-table-container">
                <span className="faq-table-badge men">{extra.q4.menLabel}</span>
                <div className="table-responsive">
                  <table className="faq-data-table">
                    <thead>
                      <tr>
                        {extra.q4.headers.map((h, i) => <th key={i}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {extra.q4.menRows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((val, cIdx) => <td key={cIdx}>{val}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <p className="faq-pal-note">{extra.q4.palNote}</p>
          </div>

          {/* Dietitian Quote */}
          <div className="faq-dietitian-quote-card">
            <div className="quote-icon-bg">”</div>
            <p className="quote-text">{extra.q4.quoteText}</p>
            <div className="quote-author-info">
              <div className="quote-avatar">
                <Heart size={16} className="avatar-heart" />
              </div>
              <div className="quote-author-details">
                <span className="quote-author-name">{extra.q4.quoteAuthor}</span>
                <span className="quote-author-role">{extra.q4.quoteRole}</span>
              </div>
            </div>
          </div>

          {/* Remember Alert Card */}
          <div className="faq-remember-card">
            <div className="remember-header">
              <AlertCircle size={18} className="remember-icon" />
              <span>{extra.q4.rememberTitle}</span>
            </div>
            <p className="remember-text">{extra.q4.rememberText}</p>
          </div>
        </div>
      )
    }

    if (id === 5) {
      return (
        <div className="faq-custom-content faq-q5-content">
          {paragraphs.map((p, idx) => (
            <p key={idx} className="faq-text-p">{p}</p>
          ))}

          <div className="faq-table-container q5-table-wrapper">
            <div className="table-responsive">
              <table className="faq-data-table">
                <thead>
                  <tr>
                    {extra.q5.headers.map((h, i) => <th key={i}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {extra.q5.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((val, cIdx) => <td key={cIdx}>{val}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="faq-comparison-text">
            <strong>{extra.q5.comparisonText}</strong>
          </p>
        </div>
      )
    }

    return (
      <div className="faq-simple-content">
        {paragraphs.map((p, idx) => (
          <p key={idx} className="faq-text-p">{p}</p>
        ))}
      </div>
    )
  }

  return (
    <div className="bmi-page-wrapper container">
      <div className="bmi-header-section text-center">
        <h1 className="text-gradient-neon bmi-title">{t('bmiCalculator')}</h1>
        <p className="bmi-subtitle">{t('bmiTagline')}</p>
      </div>

      <div className="bmi-grid">
        {/* Left column: Calculator card & Results */}
        <div className="bmi-calculator-column">
          <div className="glass-panel bmi-card">
            <h2 className="bmi-card-title">{t('bmiCalculator')}</h2>
            <p className="bmi-card-intro">
              {language === 'fa' 
                ? 'برای محاسبه شاخص توده بدنی (BMI) خود، وزن و قدتان را وارد کنید.' 
                : language === 'en' 
                  ? 'Fill in your weight and height to find out your BMI.' 
                  : 'Fyll i din vikt och längd för att ta reda på ditt BMI.'}
            </p>

            <form onSubmit={handleCalculate} className="bmi-form">
              <div className="form-group">
                <label htmlFor="weight">{t('bmiWeightLabel')}</label>
                <input
                  type="number"
                  id="weight"
                  step="any"
                  placeholder="e.g. 70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  disabled={isCalculating}
                  className="bmi-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="height">{t('bmiHeightLabel')}</label>
                <input
                  type="number"
                  id="height"
                  step="any"
                  placeholder="e.g. 175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  disabled={isCalculating}
                  className="bmi-input"
                  required
                />
              </div>

              <p className="bmi-decimal-tip">
                <Info size={14} className="info-icon" /> {t('bmiDecimalTip')}
              </p>

              {error && (
                <div className="bmi-error-message">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="bmi-buttons">
                <button
                  type="submit"
                  disabled={isCalculating}
                  className="btn-primary btn-bmi-calc"
                >
                  {isCalculating ? t('bmiBtnCalculating') : t('bmiBtnCalculate')}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isCalculating}
                  className="btn-secondary btn-bmi-clear"
                >
                  <RotateCcw size={16} /> {t('bmiBtnClear')}
                </button>
              </div>
            </form>
          </div>

          {/* Earth / globe section */}
          <div className="earth-animation-wrapper">
            <div className={`earth-container ${spinning ? 'spinning' : ''} ${result ? 'has-result' : ''}`}>
              <img src="/earth.png" alt="Earth Globe" className="earth-img" />
              <div className="earth-glow"></div>
              {spinning && (
                <div className="cosmic-orbit-ring"></div>
              )}
            </div>
          </div>

          {/* Results Screen */}
          {result && (
            <div className="glass-panel bmi-result-card fade-in">
              <h3 className="result-card-heading text-gradient-neon">{t('bmiResultTitle')}</h3>
              <div className="bmi-value-display">
                <span className="bmi-number">{result.bmi}</span>
              </div>

              <div className="result-row">
                <span className="result-label">{t('bmiClassTitle')}:</span>
                <span className={`result-badge-category category-${result.category}`}>
                  {t(result.category)}
                </span>
              </div>

              {/* Weight and Height styled like glowing golden stars */}
              <div className="cosmic-stars-container">
                <div className="star-wrapper">
                  <svg className="star-svg" viewBox="0 0 100 100">
                    <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" fill="url(#starGradient)" />
                    <defs>
                      <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fff176" />
                        <stop offset="50%" stopColor="#ffd54f" />
                        <stop offset="100%" stopColor="#ffb300" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="star-content">
                    <span className="star-label">{language === 'fa' ? 'وزن' : language === 'en' ? 'Weight' : 'Vikt'}</span>
                    <span className="star-val">{result.weightVal} kg</span>
                  </div>
                </div>

                <div className="star-wrapper">
                  <svg className="star-svg" viewBox="0 0 100 100">
                    <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" fill="url(#starGradient)" />
                  </svg>
                  <div className="star-content">
                    <span className="star-label">{language === 'fa' ? 'قد' : language === 'en' ? 'Height' : 'Längd'}</span>
                    <span className="star-val">{result.heightVal} cm</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column: Educational content */}
        <div className="bmi-education-column">
          <div className="glass-panel bmi-info-card">
            <h2 className="info-card-title text-gradient-neon">{t('bmiWhatIsTitle')}</h2>
            <p className="info-card-text">{t('bmiWhatIsDesc')}</p>
            <p className="info-card-text"><strong>{t('bmiGroupsIntro')}</strong></p>
            <ul className="info-list">
              <li><ArrowRight size={14} className="list-arrow" /> {t('bmiUnderweight')}</li>
              <li><ArrowRight size={14} className="list-arrow" /> {t('bmiNormalweight')}</li>
              <li><ArrowRight size={14} className="list-arrow" /> {t('bmiOverweight')}</li>
              <li><ArrowRight size={14} className="list-arrow" /> {t('bmiObesity')}</li>
            </ul>
          </div>

          <div className="glass-panel bmi-info-card">
            <h2 className="info-card-title text-gradient-neon">{t('bmiHowToInterpretTitle')}</h2>
            <p className="info-card-text">{t('bmiHowToInterpretDesc1')}</p>
            <p className="info-card-text">{t('bmiHowToInterpretDesc2')}</p>
          </div>

          <div className="glass-panel bmi-info-card">
            <h2 className="info-card-title text-gradient-neon">{t('bmiGuidelinesTitle')}</h2>
            <div className="table-responsive">
              <table className="bmi-guidelines-table">
                <thead>
                  <tr>
                    <th>{t('bmiTableBmi')}</th>
                    <th>{t('bmiTableClass')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{t('bmiTableUnder185')}</td>
                    <td><span className="table-badge underweight">{t('bmiUnderweight')}</span></td>
                  </tr>
                  <tr>
                    <td>{t('bmiTable185_249')}</td>
                    <td><span className="table-badge normal">{t('bmiNormalweight')}</span></td>
                  </tr>
                  <tr>
                    <td>{t('bmiTable25_299')}</td>
                    <td><span className="table-badge overweight">{t('bmiOverweight')}</span></td>
                  </tr>
                  <tr>
                    <td>{t('bmiTable30More')}</td>
                    <td><span className="table-badge obesity">{t('bmiObesity')}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Risks of obesity card */}
          <div className="glass-panel bmi-info-card" style={{ borderLeft: '3px solid var(--accent-red)' }}>
            <h2 className="info-card-title text-gradient-neon" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={22} style={{ color: 'var(--accent-red)' }} /> {t('bmiRisksTitle')}
            </h2>
            <p className="info-card-text">{t('bmiRisksIntro1')}</p>
            <p className="info-card-text">{t('bmiRisksIntro2')}</p>
            <p className="info-card-text">{t('bmiRisksIntro3')}</p>
            <p className="info-card-text"><strong>{t('bmiRisksIntro4')}</strong></p>
            
            <div className="risks-list-wrapper" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {t('bmiRisksList') && Array.isArray(t('bmiRisksList')) && t('bmiRisksList').map((risk, idx) => (
                <div key={idx} className="risk-item" style={{ borderLeft: language === 'fa' ? 'none' : '3px solid var(--accent-red)', borderRight: language === 'fa' ? '3px solid var(--accent-red)' : 'none', paddingLeft: language === 'fa' ? '0' : '12px', paddingRight: language === 'fa' ? '12px' : '0', background: 'rgba(255, 59, 48, 0.02)', padding: '10px 14px', borderRadius: '4px' }}>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--text-white)', fontWeight: '600', marginBottom: '4px' }}>{risk.title}</h3>
                  <p style={{ color: 'var(--text-silver)', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>{risk.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel bmi-info-card alert-card">
            <h2 className="info-card-title text-gradient-neon">
              <AlertCircle size={18} className="warn-title-icon" /> {t('bmiRememberTitle')}
            </h2>
            <p className="info-card-text">{t('bmiRememberDesc1')}</p>
            <p className="info-card-text">{t('bmiRememberDesc2')}</p>
          </div>

          <div className="glass-panel bmi-info-card">
            <h2 className="info-card-title text-gradient-neon">{t('bmiHowToAffectTitle')}</h2>
            <p className="info-card-text">{t('bmiHowToAffectDesc')}</p>
            
            <div className="bmi-prevent-section">
              <h3 className="prevent-subtitle">{t('bmiPreventObesityTitle')}</h3>
              <ul className="prevent-list">
                {t('bmiTips') && Array.isArray(t('bmiTips')) ? (
                  t('bmiTips').map((tip, idx) => (
                    <li key={idx}>
                      <Heart size={12} className="heart-bullet" />
                      <span>{tip}</span>
                    </li>
                  ))
                ) : (
                  <li>Error loading list</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Toggler button for Q&A */}
      <div className="bmi-faq-toggle-container text-center">
        <button
          type="button"
          onClick={() => setShowFaq(!showFaq)}
          className={`btn-faq-toggle ${showFaq ? 'active' : ''}`}
        >
          <HelpCircle size={18} />
          <span>{showFaq ? t('bmiFaqBtnHide') : t('bmiFaqBtnShow')}</span>
          <ChevronDown size={18} className={`arrow-transition ${showFaq ? 'rotated' : ''}`} />
        </button>
      </div>

      {/* Accordion Q&A Section */}
      {showFaq && (
        <div className="glass-panel bmi-faq-container fade-in">
          <h2 className="faq-title text-gradient-neon text-center">
            <MessageSquare size={24} className="faq-title-icon" /> {t('bmiFaqTitle')}
          </h2>
          <div className="faq-accordion-list">
            {t('faqList') && Array.isArray(t('faqList')) && t('faqList').map((faq) => (
              <div
                key={faq.id}
                className={`faq-accordion-item ${activeFaq === faq.id ? 'active' : ''}`}
              >
                <button
                  type="button"
                  className="faq-accordion-header"
                  onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                >
                  <div className="faq-q-left">
                    <span className="faq-number">{faq.id < 10 ? `0${faq.id}` : faq.id}</span>
                    <span className="faq-question">{faq.q}</span>
                  </div>
                  <ChevronDown size={18} className="faq-indicator-arrow" />
                </button>
                <div className="faq-accordion-body">
                  <div className="faq-accordion-content">
                    {renderFaqContent(faq.id, faq.a)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BmiCalculator
