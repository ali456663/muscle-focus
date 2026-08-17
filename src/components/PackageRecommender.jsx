import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, ArrowRight, ArrowLeft, Check, Sparkles, AlertCircle, Dumbbell, ShieldCheck, Flame, Scale } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { GradientWave } from './GradientWave'

function PackageRecommender({ isOpen, onClose, packages }) {
  const { t, language } = useLanguage()
  const [step, setStep] = useState(0)

  // Quiz State
  const [gender, setGender] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [currentBody, setCurrentBody] = useState('')
  const [desiredBody, setDesiredBody] = useState('')
  const [goals, setGoals] = useState([])
  const [focusAreas, setFocusAreas] = useState([])

  // BMI helper
  const calculateBmi = () => {
    const h = parseFloat(height) / 100
    const w = parseFloat(weight)
    if (h > 0 && w > 0) {
      return (w / (h * h)).toFixed(1)
    }
    return null
  }

  const getBmiCategory = (bmi) => {
    if (!bmi) return ''
    const val = parseFloat(bmi)
    if (val < 18.5) return { label: language === 'en' ? 'Underweight' : 'Undervikt', color: '#3b82f6' }
    if (val < 25) return { label: language === 'en' ? 'Normal weight' : 'Normalvikt', color: '#10b981' }
    if (val < 30) return { label: language === 'en' ? 'Overweight' : 'Övervikt', color: '#f59e0b' }
    return { label: language === 'en' ? 'Obese' : 'Fetma', color: '#ef4444' }
  }

  // Toggle helpers
  const toggleGoal = (goal) => {
    setGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    )
  }

  const toggleFocus = (area) => {
    setFocusAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    )
  }

  // Recommendation logic
  const getRecommendation = () => {
    const bmiVal = parseFloat(calculateBmi()) || 22
    const isOverweight = bmiVal >= 25 || goals.includes('lose_weight') || desiredBody === 'smaller'
    const isMuscle = goals.includes('gain_muscle') || desiredBody === 'shredded' || desiredBody === 'athletic'
    const isHealth = goals.includes('health') || goals.includes('energy')

    let recommended = []

    if (isOverweight) {
      // Suggest Reboot or Lifestyle
      recommended.push(packages.find(p => p.id === 'body-reboot-26') || packages.find(p => p.id === 'lifestyle-16'))
      recommended.push(packages.find(p => p.id === 'kickstart-4') || packages.find(p => p.id === 'lifestyle-16'))
    } else if (isMuscle) {
      // Suggest Next Level or Online PT
      recommended.push(packages.find(p => p.id === 'next-level-26') || packages.find(p => p.id === 'pt-online-26'))
      if (gender === 'man') {
        recommended.push(packages.find(p => p.id === 'pt-online-26'))
      } else {
        recommended.push(packages.find(p => p.id === 'glute-leg-16') || packages.find(p => p.id === 'pt-online-26'))
      }
    } else if (isHealth) {
      // Suggest Fokus or Health
      recommended.push(packages.find(p => p.id === 'fokus-12') || packages.find(p => p.id === 'health-8'))
      recommended.push(packages.find(p => p.id === 'nutrition') || packages.find(p => p.id === 'health-8'))
    } else {
      // General fallbacks
      recommended.push(packages.find(p => p.id === 'pt-online-26'))
      recommended.push(packages.find(p => p.id === 'health-8'))
    }

    // Filter nulls and ensure no duplicates
    const uniqueRecommended = [];
    recommended.filter(Boolean).forEach(pkg => {
      if (!uniqueRecommended.some(p => p.id === pkg.id)) {
        // Double check gender constraint just in case
        if (gender === 'man' && pkg.id === 'glute-leg-16') return;
        uniqueRecommended.push(pkg);
      }
    });

    return uniqueRecommended;
  }

  if (!isOpen) return null

  const handleNext = () => setStep(prev => prev + 1)
  const handleBack = () => setStep(prev => prev - 1)

  const bmi = calculateBmi()
  const bmiCat = getBmiCategory(bmi)

  return (
    <div className="recommender-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="recommender-modal glass-panel" style={{ maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-glass)', padding: '40px', position: 'relative', boxShadow: 'var(--shadow-neon)', overflow: 'hidden' }}>
        
        {/* Animated Background Wave inside the modal */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, opacity: 0.15, pointerEvents: 'none' }}>
          <GradientWave
            colors={["#1b1a17", "#b89547", "#73795D", "#3d4f5a", "#1b1a17"]}
            shadowPower={4}
            darkenTop={false}
            noiseFrequency={[0.0003, 0.0004]}
            deform={{ incline: 0.2, noiseAmp: 140, noiseFlow: 2 }}
          />
        </div>

        {/* Relative content wrapper to sit on top of the WebGL wave */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Close Button */}
          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '-16px', right: '-16px', background: 'rgba(255,255,255,0.06)', border: 'none', color: 'var(--text-silver)', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
          >
            <X size={18} />
          </button>

          {/* Progress Bar */}
          <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginBottom: '30px', overflow: 'hidden' }}>
            <div style={{ width: `${(step / 6) * 100}%`, height: '100%', backgroundColor: 'var(--accent-gold)', transition: 'width 0.3s ease' }}></div>
          </div>

        {/* STEP 0: Start Screen */}
        {step === 0 && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <Sparkles size={48} style={{ color: 'var(--accent-gold)', marginBottom: '16px' }} />
            <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--text-white)', marginBottom: '12px' }}>
              {language === 'en' ? 'Find Your Perfect Training Package' : 'Hitta ditt perfekta träningspaket'}
            </h2>
            <p style={{ color: 'var(--text-silver)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '30px' }}>
              {language === 'en' 
                ? 'Answer a few quick questions about your body, goals, and needs, and I will recommend the package that suits you best.' 
                : 'Svara på några snabba frågor om din kropp, dina mål och önskemål, så rekommenderar jag det paket som passar dig bäst.'}
            </p>
            <button onClick={handleNext} className="btn-primary" style={{ padding: '14px 40px', fontSize: '1.05rem' }}>
              {language === 'en' ? 'Start Test' : 'Starta testet'} <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          </div>
        )}

        {/* STEP 1: Basic Info & BMI */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-white)', marginBottom: '20px' }}>
              {language === 'en' ? 'Tell me about yourself' : 'Berätta lite om dig själv'}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Gender selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  {language === 'en' ? 'Gender' : 'Kön'}
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['kvinna', 'man', 'annat'].map(g => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: 'var(--border-radius-sm)',
                        border: gender === g ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        backgroundColor: gender === g ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: gender === g ? 'var(--text-white)' : 'var(--text-silver)',
                        fontWeight: gender === g ? '700' : '500',
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {g === 'kvinna' ? (language === 'en' ? 'Female' : 'Kvinna') : g === 'man' ? (language === 'en' ? 'Male' : 'Man') : (language === 'en' ? 'Other' : 'Annat')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Height & Weight Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label htmlFor="heightInput" style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    {language === 'en' ? 'Height (cm)' : 'Längd (cm)'}
                  </label>
                  <input
                    type="number"
                    id="heightInput"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="175"
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-glass)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-white)' }}
                  />
                </div>
                <div>
                  <label htmlFor="weightInput" style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    {language === 'en' ? 'Weight (kg)' : 'Vikt (kg)'}
                  </label>
                  <input
                    type="number"
                    id="weightInput"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="75"
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-glass)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-white)' }}
                  />
                </div>
              </div>

              {/* BMI Output Card */}
              {bmi && (
                <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Scale size={20} style={{ color: 'var(--accent-gold)' }} />
                    <div>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'block' }}>BMI Resultat</span>
                      <strong style={{ fontSize: '1.25rem', color: 'var(--text-white)' }}>{bmi}</strong>
                    </div>
                  </div>
                  <span style={{ backgroundColor: bmiCat.color, color: '#000', fontWeight: '700', fontSize: '0.8rem', padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    {bmiCat.label}
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              <button onClick={handleBack} style={{ background: 'none', border: 'none', color: 'var(--text-silver)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowLeft size={16} /> {language === 'en' ? 'Back' : 'Bakåt'}
              </button>
              <button onClick={handleNext} className="btn-primary" disabled={!gender || !height || !weight} style={{ padding: '10px 24px' }}>
                {language === 'en' ? 'Continue' : 'Fortsätt'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Main Goals */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-white)', marginBottom: '10px', textAlign: 'center' }}>
              {language === 'en' ? 'What are your main goals?' : 'Vad är dina huvudsakliga mål?'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '20px' }}>
              {language === 'en' ? 'Select all that apply:' : 'Välj alla som passar:'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { id: 'lose_weight', label: language === 'en' ? 'Lose weight' : 'Gå ner i vikt', icon: '🔥' },
                { id: 'get_fit', label: language === 'en' ? 'Get fit' : 'Komma i form', icon: '🏃' },
                { id: 'gain_muscle', label: language === 'en' ? 'Gain muscle' : 'Bygga muskler', icon: '💪' },
                { id: 'metabolism', label: language === 'en' ? 'Boost metabolism' : 'Öka förbränning', icon: '⚡' },
                { id: 'energy', label: language === 'en' ? 'Improve energy levels' : 'Få mer energi i vardagen', icon: '☀️' },
                { id: 'health', label: language === 'en' ? 'Improve overall health' : 'Bättre hälsa & livsbalans', icon: '❤️' }
              ].map(item => {
                const isSelected = goals.includes(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleGoal(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderRadius: 'var(--border-radius-sm)',
                      border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                      backgroundColor: isSelected ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                      color: isSelected ? 'var(--text-white)' : 'var(--text-silver)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: '600'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', border: '1.5px solid var(--text-muted)', borderRadius: '4px', backgroundColor: isSelected ? 'var(--accent-gold)' : 'transparent' }}>
                        {isSelected && <Check size={14} color="#000" style={{ strokeWidth: 3 }} />}
                      </span>
                      {item.label}
                    </span>
                    <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                  </button>
                )
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              <button onClick={handleBack} style={{ background: 'none', border: 'none', color: 'var(--text-silver)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowLeft size={16} /> {language === 'en' ? 'Back' : 'Bakåt'}
              </button>
              <button onClick={handleNext} className="btn-primary" disabled={goals.length === 0} style={{ padding: '10px 24px' }}>
                {language === 'en' ? 'Continue' : 'Fortsätt'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Current Body Type */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-white)', marginBottom: '20px', textAlign: 'center' }}>
              {language === 'en' ? 'Choose your current body type:' : 'Välj din nuvarande kroppstyp:'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { id: 'skinny', label: language === 'en' ? 'Skinny' : 'Smal', desc: language === 'en' ? 'Lean, fast metabolism, hard to build muscle' : 'Hög förbränning, svårt att bygga massa' },
                { id: 'regular', label: language === 'en' ? 'Regular' : 'Normal', desc: language === 'en' ? 'Average build, balanced body composition' : 'Balanserad kroppssammansättning' },
                { id: 'pot_belly', label: language === 'en' ? 'Pot belly' : 'Lite mage / Mjuk', desc: language === 'en' ? 'Mainly storing fat around the midsection' : 'Lagrar mest fett runt magen' },
                { id: 'extra', label: language === 'en' ? 'Extra' : 'Kraftig / Övervikt', desc: language === 'en' ? 'More body fat, slow metabolism' : 'Långsammare förbränning, mer fettmassa' }
              ].map(item => {
                const isSelected = currentBody === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentBody(item.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '16px 20px',
                      borderRadius: 'var(--border-radius-sm)',
                      border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                      backgroundColor: isSelected ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <strong style={{ color: isSelected ? 'var(--text-white)' : 'var(--text-silver)', fontSize: '1.05rem', marginBottom: '2px' }}>{item.label}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.desc}</span>
                  </button>
                )
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              <button onClick={handleBack} style={{ background: 'none', border: 'none', color: 'var(--text-silver)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowLeft size={16} /> {language === 'en' ? 'Back' : 'Bakåt'}
              </button>
              <button onClick={handleNext} className="btn-primary" disabled={!currentBody} style={{ padding: '10px 24px' }}>
                {language === 'en' ? 'Continue' : 'Fortsätt'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Desired Body Type */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-white)', marginBottom: '20px', textAlign: 'center' }}>
              {language === 'en' ? 'Choose the body you want:' : 'Välj den kroppsform du vill uppnå:'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { id: 'smaller', label: language === 'en' ? 'A few sizes smaller' : 'Några storlekar mindre', desc: language === 'en' ? 'Main focus on calorie deficit and weight loss' : 'Huvudfokus på viktnedgång och fettförbränning' },
                { id: 'lean', label: language === 'en' ? 'Lean / Toned' : 'Hård & Deffad', desc: language === 'en' ? 'Lower fat percentage, visible definition' : 'Låg fettprocent, definierade konturer' },
                { id: 'athletic', label: language === 'en' ? 'Athletic' : 'Atletisk & Stark', desc: language === 'en' ? 'Strong body, good muscle tone and condition' : 'Stark fysik, bra muskeltonus och flås' },
                { id: 'shredded', label: language === 'en' ? 'Shredded / Muscular' : 'Muskelös & Rippad', desc: language === 'en' ? 'Maximum muscle mass and high definition' : 'Maximal muskelmassa och hög definition' }
              ].map(item => {
                const isSelected = desiredBody === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setDesiredBody(item.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '16px 20px',
                      borderRadius: 'var(--border-radius-sm)',
                      border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                      backgroundColor: isSelected ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <strong style={{ color: isSelected ? 'var(--text-white)' : 'var(--text-silver)', fontSize: '1.05rem', marginBottom: '2px' }}>{item.label}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.desc}</span>
                  </button>
                )
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              <button onClick={handleBack} style={{ background: 'none', border: 'none', color: 'var(--text-silver)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowLeft size={16} /> {language === 'en' ? 'Back' : 'Bakåt'}
              </button>
              <button onClick={handleNext} className="btn-primary" disabled={!desiredBody} style={{ padding: '10px 24px' }}>
                {language === 'en' ? 'Continue' : 'Fortsätt'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Focus Areas */}
        {step === 5 && (
          <div>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-white)', marginBottom: '10px', textAlign: 'center' }}>
              {language === 'en' ? 'Any areas you\'d like to improve?' : 'Några områden du vill fokusera extra på?'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '20px' }}>
              {language === 'en' ? 'Select focus areas:' : 'Välj fokusområden:'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { id: 'chest', label: language === 'en' ? 'Chest' : 'Bröst', icon: '🔘' },
                { id: 'belly', label: language === 'en' ? 'Belly / Core' : 'Mage / Midja', icon: '🌀' },
                { id: 'legs', label: language === 'en' ? 'Legs' : 'Ben', icon: '🦵' },
                { id: 'arms', label: language === 'en' ? 'Arms' : 'Armar', icon: '💪' },
                { id: 'back', label: language === 'en' ? 'Back' : 'Rygg', icon: '🛡️' },
                { id: 'butt', label: language === 'en' ? 'Glutes / Butt' : 'Säte / Rumpa', icon: '🍑' }
              ].map(item => {
                const isSelected = focusAreas.includes(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleFocus(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      borderRadius: 'var(--border-radius-sm)',
                      border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                      backgroundColor: isSelected ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                      color: isSelected ? 'var(--text-white)' : 'var(--text-silver)',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', border: '1.5px solid var(--text-muted)', borderRadius: '4px', backgroundColor: isSelected ? 'var(--accent-gold)' : 'transparent' }}>
                        {isSelected && <Check size={12} color="#000" style={{ strokeWidth: 3 }} />}
                      </span>
                      {item.label}
                    </span>
                    <span>{item.icon}</span>
                  </button>
                )
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              <button onClick={handleBack} style={{ background: 'none', border: 'none', color: 'var(--text-silver)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowLeft size={16} /> {language === 'en' ? 'Back' : 'Bakåt'}
              </button>
              <button onClick={handleNext} className="btn-primary" style={{ padding: '10px 24px' }}>
                {language === 'en' ? 'Show Results' : 'Visa resultat'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Results */}
        {step === 6 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <ShieldCheck size={48} style={{ color: '#10b981', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', color: 'var(--text-white)', margin: 0 }}>
                {language === 'en' ? 'Your Tailored Result' : 'Din skräddarsydda analys'}
              </h3>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-glass)', marginBottom: '30px' }}>
              {/* BMI Recap */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>BMI</span>
                  <strong style={{ display: 'block', fontSize: '1.4rem', color: 'var(--text-white)' }}>{bmi}</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</span>
                  <strong style={{ display: 'block', fontSize: '1.1rem', color: bmiCat.color }}>{bmiCat.label}</strong>
                </div>
              </div>

              {/* Analysis Text */}
              <p style={{ fontSize: '0.98rem', lineHeight: '1.6', color: 'var(--text-silver)', margin: 0 }}>
                {language === 'en' 
                  ? `Based on your metrics (${height}cm, ${weight}kg) and body type (${currentBody}), you want to build a body that is ` 
                  : `Baserat på dina mått (${height} cm, ${weight} kg) och kroppstyp (${currentBody === 'skinny' ? 'smal' : currentBody === 'regular' ? 'normal' : currentBody === 'pot_belly' ? 'lite mage' : 'kraftig'}), vill du uppnå en kroppsform som är `}
                <strong style={{ color: 'var(--accent-gold)' }}>
                  {desiredBody === 'smaller' ? (language === 'en' ? 'smaller' : 'några storlekar mindre') : desiredBody === 'lean' ? (language === 'en' ? 'lean' : 'hård & deffad') : desiredBody === 'athletic' ? (language === 'en' ? 'athletic' : 'atletisk & stark') : (language === 'en' ? 'shredded' : 'muskelös & rippad')}.
                </strong>
                {language === 'en'
                  ? ` Your main focus is to target: ${focusAreas.join(', ')}.`
                  : ` Ditt fokus är att förbättra: ${focusAreas.map(a => a === 'chest' ? 'bröst' : a === 'belly' ? 'mage' : a === 'legs' ? 'ben' : a === 'arms' ? 'armar' : a === 'back' ? 'rygg' : 'rumpa').join(', ')}.`}
              </p>
            </div>

            {/* Recommended Packages Title */}
            <h4 style={{ fontSize: '1.15rem', color: 'var(--text-white)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {language === 'en' ? 'Recommended Packages for You:' : 'Rekommenderade paket för dig:'}
            </h4>

            {/* Package list display */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {getRecommendation().map(pkg => (
                <div key={pkg.id} className="glass-panel" style={{ display: 'flex', gap: '16px', padding: '20px', borderRadius: 'var(--border-radius-md)', border: '1px solid rgba(184, 149, 71, 0.25)', alignItems: 'center' }}>
                  <div style={{ backgroundColor: 'rgba(184, 149, 71, 0.1)', padding: '12px', borderRadius: '50%', color: 'var(--accent-gold)' }}>
                    <Dumbbell size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ fontSize: '1.15rem', color: 'var(--text-white)', margin: '0 0 4px 0' }}>{pkg.title}</h5>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{pkg.duration} • {pkg.price}</span>
                  </div>
                  <Link 
                    to={`/ansok?paket=${encodeURIComponent(pkg.title)}`}
                    className="btn-primary"
                    style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                    onClick={onClose}
                  >
                    {language === 'en' ? 'Choose' : 'Välj paket'}
                  </Link>
                </div>
              ))}
            </div>

            {/* Free Trial Promotion Option */}
            <div 
              className="glass-panel" 
              style={{ 
                marginTop: '20px', 
                display: 'flex', 
                gap: '16px', 
                padding: '20px', 
                borderRadius: 'var(--border-radius-md)', 
                border: '1.5px dashed var(--accent-gold)', 
                alignItems: 'center',
                background: 'rgba(184, 149, 71, 0.04)'
              }}
            >
              <div style={{ backgroundColor: 'rgba(184, 149, 71, 0.15)', padding: '12px', borderRadius: '50%', color: 'var(--accent-gold)' }}>
                <Sparkles size={24} className="pulse" />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>
                  {language === 'en' ? 'Limited Offer' : 'Tidsbegränsat erbjudande'}
                </span>
                <h5 style={{ fontSize: '1.1rem', color: 'var(--text-white)', margin: '0 0 2px 0' }}>
                  {language === 'en' ? 'Start with 2 Weeks Free' : 'Starta med 2 veckor helt gratis'}
                </h5>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  {language === 'en' ? 'No strings attached. Try workout & meal plans today!' : 'Träningsprogram & kostschema helt utan förpliktelser!'}
                </p>
              </div>
              <Link 
                to={`/ansok?paket=${encodeURIComponent(language === 'en' ? 'Free 2-Week Trial Period' : 'Gratis 2-veckors testperiod')}`}
                className="btn-primary"
                style={{ 
                  padding: '8px 18px', 
                  fontSize: '0.85rem',
                  background: 'linear-gradient(135deg, var(--accent-gold) 0%, #a48231 100%)',
                  border: '1px solid var(--accent-gold)'
                }}
                onClick={onClose}
              >
                {language === 'en' ? 'Try Free' : 'Testa gratis'}
              </Link>
            </div>

            {/* Reset / restart */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
              <button 
                onClick={() => {
                  setStep(0)
                  setGender('')
                  setHeight('')
                  setWeight('')
                  setCurrentBody('')
                  setDesiredBody('')
                  setGoals([])
                  setFocusAreas([])
                }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                {language === 'en' ? 'Restart test' : 'Gör om testet'}
              </button>
            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  )
}

export default PackageRecommender
