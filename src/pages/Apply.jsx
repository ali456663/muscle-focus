import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { submitLead, isBackendOnline, syncStoredLeads, clearOfflineData, getOfflineStats, registerClient } from '../services/api'
import { Check, Mail, Phone, MapPin, Send, AlertCircle, Dumbbell, CreditCard, ArrowRight, ArrowLeft, Scale, Sparkles, Star } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import './Apply.css'

function Apply() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isOffline, setIsOffline] = useState(false)
  const [syncStatus, setSyncStatus] = useState(null)
  usePageTitle('apply')
  const [isStudentOrSenior, setIsStudentOrSenior] = useState(false)
  const { t, language } = useLanguage()

  // Multi-step form state (1: Create Profile, 2: Goals, 3: Physical, 4: Lifestyle)
  const [formStep, setFormStep] = useState(1)

  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Kvinna',
    age: '',
    personalNumber: '',
    city: '',
    email: '',
    phoneNumber: '',
    trainingWish: '',
    message: '',
    // Quiz metrics
    height: '',
    weight: '',
    targetWeight: '',
    specialOccasion: '',
    eventDate: '',
    currentBody: '',
    desiredBody: '',
    goals: [],
    focusAreas: [],
    // Free Trial Lifestyle fields
    sleepHours: '',
    waterDaily: '',
    habits: [],
    energyLevels: '',
    typicalDay: '',
    weightChange: '',
    exerciseFrequency: '',
    idealWeightTime: '',
    triedDiets: [],
    weightGained3Years: '',
    mealPrepTime: '',
    breakfastTime: '',
    lunchTime: '',
    dinnerTime: '',
    meatRelation: '',
    porkRelation: '',
    beefRelation: '',
    chickenRelation: '',
    turkeyRelation: '',
    lambRelation: '',
    duckRelation: '',
    eatFish: '',
    mainGoalReason: '',
    // Health status
    hasInjuries: 'Nej',
    injuryDetails: '',
    healthDeclarationConfirmed: false,
    // Diet & Allergies
    dietPreference: 'Blandkost',
    hasAllergies: 'Nej',
    allergyDetails: '',
    agreementConfirmed: false,
    signature: '',
    guardianEmail: '',
    guardianPhone: '',
    trainingDays: '3',
    trainingDuration: '60 min',
    trainingLocation: 'Båda',
    equipmentAvailable: 'Fria vikter & maskiner',
    trainingReason: 'Allmän hälsa',
    experienceLevel: 'Nybörjare',
    pastExperience: '',
    activityLevel: 'Lätt aktiv',
    weightGoal: 'Viktnedgång',
    // Body Fat US Navy optional measurements (cm)
    neck: '',
    waist: '',
    hip: '',
    // Free trial account creation
    password: '',
    confirmPassword: ''
  })
  const canvasRef = useRef(null)
  const isDrawing = useRef(false)

  const startDrawing = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    
    // Support mouse & touch events
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top
    
    ctx.beginPath()
    ctx.moveTo(x, y)
    isDrawing.current = true
  }

  const draw = (e) => {
    if (!isDrawing.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top
    
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (!isDrawing.current) return
    isDrawing.current = false
    const canvas = canvasRef.current
    if (canvas) {
      const dataUrl = canvas.toDataURL()
      setFormData(prev => ({ ...prev, signature: dataUrl }))
    }
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setFormData(prev => ({ ...prev, signature: '' }))
    }
  }

  // Check backend status on load + auto-sync every 30s
  useEffect(() => {
    const checkBackend = async () => {
      const online = await isBackendOnline()
      setIsOffline(!online)
    }
    checkBackend()

    const interval = setInterval(async () => {
      const online = await isBackendOnline()
      if (online && isOffline) {
        const stats = getOfflineStats()
        if (stats.leadsCount > 0) {
          setSyncStatus('syncing')
          const result = await syncStoredLeads()
          setSyncStatus(result.failed === 0 ? 'synced' : 'partial')
        }
        setIsOffline(false)
      } else if (!online) {
        setIsOffline(true)
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [isOffline])

  // List of available packages dynamically populated from translatable package data
  const pkgTranslations = t('packagesData')
  const packagesList = Object.values(pkgTranslations).map(pkg => `${pkg.title} (${pkg.duration})`)

  useEffect(() => {
    const paketParam = searchParams.get('paket')
    if (paketParam) {
      const matchedPkg = Object.values(pkgTranslations).find(p => p.title.toLowerCase() === paketParam.toLowerCase())
      if (matchedPkg) {
        setFormData(prev => ({ ...prev, trainingWish: `${matchedPkg.title} (${matchedPkg.duration})` }))
      } else {
        setFormData(prev => ({ ...prev, trainingWish: paketParam }))
      }
    }
  }, [searchParams, pkgTranslations])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = { ...prev, [name]: value }
      if (name === 'weight' || name === 'targetWeight') {
        const w = parseFloat(name === 'weight' ? value : prev.weight)
        const tw = parseFloat(name === 'targetWeight' ? value : prev.targetWeight)
        if (!isNaN(w) && !isNaN(tw) && w > 0 && tw > 0) {
          if (tw < w) updated.weightGoal = 'Viktnedgång'
          else if (tw > w) updated.weightGoal = 'Viktuppgång'
          else updated.weightGoal = 'Bibehålla'
        }
      }
      return updated
    })
  }

  // Toggle helpers
  const handleGoalToggle = (goalId) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId) 
        ? prev.goals.filter(g => g !== goalId) 
        : [...prev.goals, goalId]
    }))
  }

  const handleFocusToggle = (areaId) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(areaId) 
        ? prev.focusAreas.filter(a => a !== areaId) 
        : [...prev.focusAreas, areaId]
    }))
  }

  const handleHabitToggle = (habitId) => {
    setFormData(prev => {
      if (habitId === 'none') {
        return {
          ...prev,
          habits: prev.habits.includes('none') ? [] : ['none']
        }
      } else {
        const filtered = prev.habits.filter(h => h !== 'none')
        return {
          ...prev,
          habits: filtered.includes(habitId)
            ? filtered.filter(h => h !== habitId)
            : [...filtered, habitId]
        }
      }
    })
  }

  const handleTriedDietToggle = (dietId) => {
    setFormData(prev => {
      if (dietId === 'none') {
        return {
          ...prev,
          triedDiets: prev.triedDiets.includes('none') ? [] : ['none']
        }
      } else {
        const filtered = prev.triedDiets.filter(d => d !== 'none')
        return {
          ...prev,
          triedDiets: filtered.includes(dietId)
            ? filtered.filter(d => d !== dietId)
            : [...filtered, dietId]
        }
      }
    })
  }

  // Determine if free trial is chosen
  const isFreeTrial = formData.trainingWish.toLowerCase().includes('gratis') || 
                      formData.trainingWish.toLowerCase().includes('free trial') ||
                      formData.trainingWish.toLowerCase().includes('آزمایشی')

  // BMI helper
  const calculateBmi = () => {
    const h = parseFloat(formData.height) / 100
    const w = parseFloat(formData.weight)
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

  // Validation helper for step transitions
  const validateStep1 = () => {
    setError('')
    if (!formData.fullName || !formData.age || !formData.personalNumber || !formData.city || !formData.email || !formData.phoneNumber || !formData.trainingWish) {
      setError(language === 'fa' ? 'لطفاً تمامی فیلدهای الزامی را پر کنید.' : language === 'en' ? 'Please fill in all required fields.' : 'Vänligen fyll i alla obligatoriska fält.')
      return false
    }

    const ageNum = parseInt(formData.age, 10)
    if (isNaN(ageNum) || ageNum < 16) {
      setError(language === 'fa' ? 'برای ثبت نام باید حداقل ۱۶ سال سن داشته باشید.' : language === 'en' ? 'You must be at least 16 years old to apply.' : 'Du måste vara minst 16 år gammal för att kunna ansöka.')
      return false
    }

    // Require guardian details if under 18 (16 or 17 years old)
    if (ageNum < 18) {
      if (!formData.guardianEmail || !formData.guardianPhone) {
        setError(language === 'en' 
          ? 'Guardian\'s email and phone number are required since you are under 18.' 
          : 'Vårdnadshavares e-postadress och telefonnummer krävs eftersom du är under 18 år.');
        return false;
      }
    }

    // Simple personal number format validation (either 10 or 12 digits, with optional hyphen)
    const personalNumberClean = formData.personalNumber.replace(/[^0-9]/g, '')
    if (personalNumberClean.length !== 10 && personalNumberClean.length !== 12) {
      setError(language === 'fa' ? 'لطفاً یک شماره ملی/کد ملی معتبر وارد کنید.' : language === 'en' ? 'Please enter a valid personal number (ÅÅÅÅMMDD-XXXX).' : 'Vänligen ange ett giltigt personnummer (ÅÅÅÅMMDD-XXXX).')
      return false
    }

    // Password validation (only for free trial registration)
    if (isFreeTrial) {
      if (!formData.password || formData.password.length < 6) {
        setError(language === 'en' ? 'Password must be at least 6 characters.' : 'Lösenordet måste vara minst 6 tecken.')
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError(language === 'en' ? 'Passwords do not match.' : 'Lösenorden matchar inte.')
        return false
      }
    }

    return true
  }

  const handleFormSubmit = async (e, payNow) => {
    if (e) e.preventDefault()
    setError('')
    setLoading(true)

    // Re-validate profile step just to be safe
    if (!validateStep1()) {
      setLoading(false)
      setFormStep(1)
      return
    }

    const bmiVal = calculateBmi()
    const targetWeightText = formData.targetWeight ? ` (Målvikt: ${formData.targetWeight} kg)` : ''
    const bmiText = bmiVal ? `\n- BMI: ${bmiVal} (${getBmiCategory(bmiVal).label})` : ''
    const goalsText = formData.goals.length > 0 ? `\n- Mål: ${formData.goals.join(', ')}` : ''
    const focusText = formData.focusAreas.length > 0 ? `\n- Fokusområden: ${formData.focusAreas.join(', ')}` : ''
    const bodyText = formData.currentBody ? `\n- Kroppstyp: ${formData.currentBody} (Önskad form: ${formData.desiredBody})` : ''
    
    // Health details
    const healthText = `\n\n[Hälsa & Skador]\n- Skador/sjukdomar/rörelsebegränsningar: ${formData.hasInjuries}${formData.hasInjuries === 'Ja' ? ` (${formData.injuryDetails})` : ''}\n- Godkänt hälsodeklaration: ${formData.healthDeclarationConfirmed ? 'Ja' : 'Nej'}`

    // Diet & Allergies
    const dietText = `\n\n[Kost & Allergier]\n- Kostpreferens: ${formData.dietPreference}\n- Allergier/Intoleranser: ${formData.hasAllergies}${formData.hasAllergies === 'Ja' ? ` (${formData.allergyDetails})` : ''}`

    // Mifflin-St Jeor Calorie Math
    const metrics = calculateCaloriesAndMacros()
    const calorieText = metrics ? `\n\n[Mifflin-St Jeor Kaloriberäkning]\n- Aktivitetsnivå: ${formData.activityLevel}\n- Kalorimål (${formData.weightGoal}): ${metrics.targetCalories} kcal (BMR: ${metrics.bmr} kcal, TDEE: ${metrics.tdee} kcal)\n- Proteintarget: ${metrics.protein}g (${metrics.protein * 4} kcal)\n- Fetttarget: ${metrics.fat}g (${metrics.fat * 9} kcal)\n- Kolhydratstarget: ${metrics.carbs}g (${metrics.carbs * 4} kcal)` : ''

    // Free trial specific details
    const freeTrialText = isFreeTrial ? `\n\n[Livsstil & Vanor]\n- Sömn: ${formData.sleepHours}\n- Vatten: ${formData.waterDaily}\n- Vanor: ${formData.habits.join(', ')}\n- Energinivå: ${formData.energyLevels}\n- Vardagsaktivitet: ${formData.typicalDay}\n- Viktförändringstyp: ${formData.weightChange}\n- Träningsfrekvens: ${formData.exerciseFrequency}\n- Senast idealvikt: ${formData.idealWeightTime}\n- Viktökning 3 år: ${formData.weightGained3Years}\n- Tidigare dieter: ${formData.triedDiets.join(', ')}\n- Matlagningstid: ${formData.mealPrepTime}\n- Frukosttid: ${formData.breakfastTime}\n- Lunchtid: ${formData.lunchTime}\n- Middagstid: ${formData.dinnerTime}\n- Köttrelation: ${formData.meatRelation}\n- Fläskrelation: ${formData.porkRelation}\n- Nötköttsrelation: ${formData.beefRelation}\n- Kycklingrelation: ${formData.chickenRelation}\n- Kalkonrelation: ${formData.turkeyRelation}\n- Lammrelation: ${formData.lambRelation}\n- Anka-relation: ${formData.duckRelation}\n- Äter fisk: ${formData.eatFish}\n- Huvudanledning komma i form: ${formData.mainGoalReason}\n- Speciellt tillfälle: ${formData.specialOccasion}${formData.eventDate ? ` (Datum: ${formData.eventDate})` : ''}\n\n[Träningsprogram & Utrustning]\n- Träningsdagar per vecka: ${formData.trainingDays}\n- Passlängd: ${formData.trainingDuration}\n- Träningsplats: ${formData.trainingLocation}\n- Tillgänglig utrustning: ${formData.equipmentAvailable}\n- Träningssyfte: ${formData.trainingReason}\n- Träningserfarenhet: ${formData.experienceLevel}\n- Tidigare träning/längd: ${formData.pastExperience}\n\n[Digitalt Avtal]\n- Godkänt allmänna villkor: ${formData.agreementConfirmed ? 'Ja' : 'Nej'}\n- Digital signatur status: ${formData.signature ? 'Signerad med canvas ritverktyg' : 'Ej signerad'}` : ''

    const customMessage = `[Interaktiv Analys]\n- Personnummer: ${formData.personalNumber}${targetWeightText}${bmiText}${bodyText}${goalsText}${focusText}${healthText}${dietText}${calorieText}${freeTrialText}\n\nMeddelande:\n${formData.message}`

    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age, 10),
        payNow: payNow,
        priceOption: isStudentOrSenior ? 'discounted' : 'regular',
        message: customMessage
      }

      // ── FREE TRIAL: Register account first, then save data & redirect ──
      if (isFreeTrial) {
        setIsAnalyzing(true)
        setProgress(0)

        // Animate progress bar (5 seconds for immersive premium scan experience)
        const duration = 5000
        const intervalTime = 30
        const steps = duration / intervalTime
        let currentStep = 0
        const timer = setInterval(async () => {
          currentStep++
          const p = Math.min(Math.round((currentStep / steps) * 100), 100)
          setProgress(p)

          if (currentStep >= steps) {
            clearInterval(timer)
            try {
              // 1. Register account
              const authData = await registerClient(
                formData.fullName,
                formData.phoneNumber,
                formData.email,
                formData.password
              )

              // 2. Store JWT token (auto-login)
              localStorage.setItem('client_token', authData.token)
              localStorage.setItem('client_user', authData.username)
              localStorage.setItem('client_name', formData.fullName)

              // 3. Save all onboarding answers for program generation
              const programData = {
                ...formData,
                password: undefined,        // Never store password
                confirmPassword: undefined,
                trialStartDate: new Date().toISOString(),
                bmi: calculateBmi(),
                calories: calculateCaloriesAndMacros(),
              }
              localStorage.setItem('client_program_data', JSON.stringify(programData))

              // 4. Also submit as lead (notify trainer)
              try { await submitLead(payload) } catch (_) {}

              // 5. Redirect to My Program (Unified client profile dashboard)
              setIsAnalyzing(false)
              navigate('/profil')
              window.location.reload()
            } catch (err) {
              setIsAnalyzing(false)
              // If email already exists, offer to log in instead
              if (err.message && err.message.toLowerCase().includes('redan')) {
                setError((language === 'en'
                  ? 'This email is already registered. Please log in: '
                  : 'Den här e-postadressen är redan registrerad. Logga in: ') + '/login')
              } else {
                setError(err.message || 'Kunde inte skapa konto. Försök igen.')
              }
              setLoading(false)
            }
          }
        }, intervalTime)
        return // exit early — free trial handled above
      }

      // ── REGULAR SUBMISSION (non-free-trial) ──
      // Simulate premium analysis loading for 5 seconds
      setIsAnalyzing(true)
      setProgress(0)

      const duration = 5000 // 5 seconds for immersive premium scan experience
      const intervalTime = 30
      const steps = duration / intervalTime
      let currentStep = 0

      const timer = setInterval(async () => {
        currentStep++
        const currentProgress = Math.min(Math.round((currentStep / steps) * 100), 100)
        setProgress(currentProgress)

        if (currentStep >= steps) {
          clearInterval(timer)
          
          // Send request after simulator reaches 100%
          try {
            const res = await submitLead(payload)
            
            if (res._offline) {
              setIsOffline(true)
              if (payNow) {
                setError(language === 'fa' 
                  ? 'پرداخت آنلاین در حالت آفلاین امکان‌پذیر نیست. لطفاً دوباره تلاش کنید یا تماس بگیرید.' 
                  : language === 'en' 
                  ? 'Online payment is not available in offline mode. Please try again or contact us.' 
                  : 'Onlinebetalning är inte tillgänglig i offline-läge. Försök igen eller kontakta oss.')
                setIsAnalyzing(false)
                setLoading(false)
                return
              }
              setIsAnalyzing(false)
              setSubmitted(true)
              return
            }
            
            if (payNow && res.stripeCheckoutUrl) {
              window.location.href = res.stripeCheckoutUrl
            } else {
              setIsAnalyzing(false)
              setSubmitted(true)
            }
          } catch (err) {
            setIsAnalyzing(false)
            setError(err.message || 'Ett fel uppstod när ansökan skickades. Kontrollera att servern körs.')
          } finally {
            setLoading(false)
          }
        }
      }, intervalTime)

    } catch (err) {
      setIsAnalyzing(false)
      setError(err.message || 'Ett fel uppstod när ansökan skickades. Kontrollera att servern körs.')
      setLoading(false)
    }
  }

  const showDiscountToggle = formData.trainingWish && (
    formData.trainingWish.toLowerCase().includes('projekt') ||
    formData.trainingWish.toLowerCase().includes('project') ||
    formData.trainingWish.toLowerCase().includes('teknik') ||
    formData.trainingWish.toLowerCase().includes('tech') ||
    formData.trainingWish.includes('پروژه') ||
    formData.trainingWish.includes('تکنیک')
  )

  const getScanStatusMessage = (p) => {
    if (p < 20) {
      if (language === 'fa') return 'شروع اسکن زیستی... (بررسی سن، جنسیت و شاخص توده بدنی)'
      if (language === 'en') return 'Initializing bio-scan... (Loading age, gender & BMI)'
      return 'Initierar bio-skanning... (Läser in ålder, kön och BMI)'
    }
    if (p < 40) {
      if (language === 'fa') return 'اسکن بالاتنه و قلب... (تحلیل ظرفیت و سابقه تمرینی)'
      if (language === 'en') return 'Scanning upper body & cardiovascular... (Analyzing capacity & experience)'
      return 'Skannar överkropp & hjärta... (Analyserar syreupptagningsförmåga & träningserfarenhet)'
    }
    if (p < 60) {
      if (language === 'fa') return 'اسکن شکم و سوخت‌وساز... (محاسبه کالری هدف و نیازهای غذایی)'
      if (language === 'en') return 'Scanning core & metabolism... (Calculating BMR, target calories & macros)'
      return 'Skannar magregion & metabolism... (Beräknar BMR, målkost och matsmältningspreferenser)'
    }
    if (p < 80) {
      if (language === 'fa') return 'اسکن پاها و مفاصل... (تنظیم تجهیزات در دسترس و حجم تمرین)'
      if (language === 'en') return 'Scanning joints & mobility... (Matching equipment & volume)'
      return 'Skannar ben & rörelseleder... (Matchar rätt utrustning och träningsvolym)'
    }
    if (p < 95) {
      if (language === 'fa') return 'ساخت برنامه تمرین و تغذیه اختصاصی... (اعمال بار اضافه تدریجی)'
      if (language === 'en') return 'Generating workout & meal plan... (Applying progressive overload)'
      return 'Genererar tränings- och kostprogram... (Anpassar progressiv överbelastning)'
    }
    if (language === 'fa') return 'اسکن کامل شد! در حال ایجاد حساب کاربری...'
    if (language === 'en') return 'Scan complete! Creating your account...'
    return 'Skanning klar! Skapar ditt konto...'
  }

  if (isAnalyzing) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '40px 24px' }}>
        <div className="glass-panel text-center fade-in" style={{ padding: '40px 30px', maxWidth: '500px', width: '100%', borderRadius: 'var(--border-radius-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', border: '1px solid rgba(0, 242, 254, 0.3)', boxShadow: '0 0 40px rgba(0, 242, 254, 0.15)' }}>
          
          <h2 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', color: 'var(--text-white)', fontWeight: 'bold', margin: 0, letterSpacing: '1px' }}>
            {language === 'fa' ? 'اسکن و آنالیز بدن' : language === 'en' ? 'BODY SCAN & ANALYSIS' : 'KROPPSSKANNING & ANALYS'}
          </h2>

          {/* Premium Animated Body Scanner */}
          <div className="body-scan-container">
            <div className="body-scan-grid"></div>
            <div className="scan-hud-element scan-hud-top-left">SYS_OK</div>
            <div className="scan-radar"></div>
            <img src="/body_scanner.png" alt="Body Scanner" className="body-scan-image" />
            <div className="body-scan-line"></div>
            <div className="body-scan-ring"></div>
            <div className="scan-hud-element scan-hud-bottom-right">{progress}%</div>
          </div>

          {/* Dynamic Status message */}
          <div className="scan-status-message">
            {getScanStatusMessage(progress)}
          </div>

          {/* Progress bar */}
          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${progress}%`, 
                background: 'linear-gradient(90deg, #00f2fe 0%, #4facfe 100%)', 
                boxShadow: '0 0 10px #00f2fe',
                borderRadius: '3px',
                transition: 'width 0.1s ease-out' 
              }}
            ></div>
          </div>

          {/* Checklist with dynamic checkboxes based on progress */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', textAlign: 'left', padding: '0 10px', marginTop: '10px' }}>
            {[
              { label: language === 'en' ? 'Reviewing your answers...' : 'Går igenom dina svar...', trigger: 20 },
              { label: language === 'en' ? 'Analyzing your body metrics...' : 'Analyserar dina kroppsmått...', trigger: 40 },
              { label: language === 'en' ? 'Calculating calorie & diet needs...' : 'Beräknar kalori- & kostbehov...', trigger: 60 },
              { label: language === 'en' ? 'Matching workout split & exercises...' : 'Matchar träningssplit & övningar...', trigger: 80 }
            ].map((item, idx) => {
              const isChecked = progress >= item.trigger
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.88rem', color: isChecked ? '#00f2fe' : 'var(--text-muted)', transition: 'all 0.3s' }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: isChecked ? 'none' : '1px solid var(--border-glass)',
                    backgroundColor: isChecked ? '#00f2fe' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#050a15',
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    boxShadow: isChecked ? '0 0 10px rgba(0, 242, 254, 0.4)' : 'none'
                  }}>
                    {isChecked ? '✓' : ''}
                  </div>
                  <span style={{ fontWeight: isChecked ? '600' : 'normal' }}>{item.label}</span>
                </div>
              )
            })}
          </div>

          <div style={{ color: 'var(--text-silver)', fontSize: '0.9rem', fontWeight: 'bold', marginTop: '10px' }}>
            {language === 'en' ? 'Over 10,000 People' : 'Över 10 000 personer'}
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
              {language === 'en' ? 'have chosen Muscle & Focus' : 'har valt Muscle & Focus'}
            </p>
          </div>

        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className={`apply-success container ${language === 'fa' ? 'rtl-align' : ''}`}>
        <div className="success-card glass-panel text-center">
          <div className="success-icon-wrapper">
            <Check size={40} className="success-icon" />
          </div>
          <h2>{t('applySuccessTitle')}</h2>
          <p>
            {t('applySuccessText')
              .replace('{name}', formData.fullName)
              .replace('{wish}', formData.trainingWish)}
          </p>
          <p className="success-subtext">
            {t('applySuccessSubtext')
              .replace('{email}', formData.email)
              .replace('{phone}', formData.phoneNumber)}
          </p>
          <div className="success-actions">
            <Link to="/" className="btn-primary">{t('applySuccessBack')}</Link>
          </div>
        </div>
      </div>
    )
  }

  const calculateCaloriesAndMacros = () => {
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height)
    const age = parseInt(formData.age, 10) || 25
    const gender = formData.gender || 'Kvinna'

    if (!weight || !height || !age) return null

    // Mifflin-St Jeor Formula
    let bmr = 0
    if (gender === 'Man') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    // Activity Factor (PAL)
    let factor = 1.2
    if (formData.activityLevel === 'Stillasittande') factor = 1.2
    else if (formData.activityLevel === 'Lätt aktiv') factor = 1.375
    else if (formData.activityLevel === 'Måttligt aktiv') factor = 1.55
    else if (formData.activityLevel === 'Mycket aktiv') factor = 1.725
    else if (formData.activityLevel === 'Extremt aktiv') factor = 1.9

    const tdee = Math.round(bmr * factor)

    // Goal adjustments (Deficit / Surplus / Balance)
    let goalAdjustment = 0
    let goalLabel = language === 'en' ? 'Maintenance (0 kcal)' : 'Balans (0 kcal)'
    if (formData.weightGoal === 'Viktnedgång') {
      goalAdjustment = -500
      goalLabel = language === 'en' ? 'Deficit (-500 kcal)' : 'Underskott (-500 kcal)'
    } else if (formData.weightGoal === 'Viktuppgång') {
      goalAdjustment = 300
      goalLabel = language === 'en' ? 'Surplus (+300 kcal)' : 'Överskott (+300 kcal)'
    }

    const targetCalories = Math.max(1000, tdee + goalAdjustment)

    // Macros:
    // 1. Protein: 1.8g per kg kroppsvikt
    // 2. Fett: 0.9g per kg kroppsvikt
    // 3. Kolhydrater: Resterande kalorier
    const protein = Math.round(1.8 * weight)
    const fat = Math.round(0.9 * weight)
    const proteinKcal = protein * 4
    const fatKcal = fat * 9
    const carbsKcal = Math.max(0, targetCalories - (proteinKcal + fatKcal))
    const carbs = Math.round(carbsKcal / 4)

    return {
      bmr: Math.round(bmr),
      factor,
      tdee,
      goalAdjustment,
      goalLabel,
      targetCalories,
      protein,
      fat,
      carbs
    }
  }

  const bmi = calculateBmi()
  const bmiCat = getBmiCategory(bmi)

  return (
    <div className={`apply-page container ${language === 'fa' ? 'rtl-align' : ''}`}>
      <div className="apply-grid">
        {/* Form Intro and Contact Info */}
        <div className="apply-info">
          <span className="subtitle">{t('applySubtitle')}</span>
          <h2>{t('applyTitle')}</h2>
          <p className="info-desc">
            {t('applyIntro')}
          </p>

          <div className="contact-info-list">
            <div className="contact-info-item">
              <Mail className="info-icon" />
              <div>
                <h4>{t('applyContactEmailTitle')}</h4>
                <p>info.musclefocus@gmail.com</p>
              </div>
            </div>
            <div className="contact-info-item">
              <Phone className="info-icon" />
              <div>
                <h4>{t('applyContactPhoneTitle')}</h4>
                <p>+46 (0) 70-036 12 89</p>
              </div>
            </div>
            <div className="contact-info-item">
              <MapPin className="info-icon" />
              <div>
                <h4>{t('applyContactLocationTitle')}</h4>
                <p>{t('applyContactLocationText')}</p>
              </div>
            </div>
          </div>

          <div className="apply-disclaimer">
            <Dumbbell size={16} className="disclaimer-icon" />
            <p>{t('applyDisclaimer')}</p>
          </div>
        </div>

        {/* Application Form */}
        <div className="apply-form-container glass-panel">
          {/* Progress Indicator */}
          <div className="form-steps-indicator" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontWeight: formStep === 1 ? 'bold' : 'normal', color: formStep === 1 ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
              1. {language === 'en' ? 'Create Profile' : 'Skapa Profil'}
            </span>
            <span style={{ fontWeight: formStep === 2 ? 'bold' : 'normal', color: formStep === 2 ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
              2. {language === 'en' ? 'Goals & Focus' : 'Mål & Fokus'}
            </span>
            <span style={{ fontWeight: formStep === 3 ? 'bold' : 'normal', color: formStep === 3 ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
              3. {language === 'en' ? 'Physical Info' : 'Fysisk Info'}
            </span>
            {isFreeTrial && (
              <span style={{ fontWeight: formStep === 4 ? 'bold' : 'normal', color: formStep === 4 ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                4. {language === 'en' ? 'Lifestyle' : 'Livsstil'}
              </span>
            )}
          </div>

          {/* Offline Badge */}
          {isOffline && (
            <div className="offline-badge apply-offline-badge">
              <AlertCircle size={16} />
              <span>
                {language === 'fa'
                  ? 'حالت آفلاین: اطلاعات به صورت محلی ذخیره می‌شوند. سرور در دسترس نیست.'
                  : language === 'en'
                  ? 'Offline Mode: Details are saved locally. Server is not available.'
                  : 'Offline-läge: Uppgifter sparas lokalt. Servern är inte tillgänglig.'}
              </span>
            </div>
          )}

          {error && (
            <div className="form-error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: CREATE PROFILE (CONTACT DETAILS) */}
          {formStep === 1 && (
            <div className="fade-in">
              <form className="apply-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label htmlFor="fullName">{t('applyLabelFullName')}</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={t('applyPlaceholderFullName')}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="gender">{t('applyLabelGender')}</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="Kvinna">{t('applyOptionFemale')}</option>
                      <option value="Man">{t('applyOptionMale')}</option>
                      <option value="Annat">{t('applyOptionOther')}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="age">{t('applyLabelAge')}</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      min="12"
                      max="100"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder={t('applyPlaceholderAge')}
                      required
                    />
                  </div>
                </div>

                {/* Conditional Guardian Contact Info fields if minor (age < 18) */}
                {formData.age && parseInt(formData.age, 10) < 18 && (
                  <div className="fade-in" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: 'var(--border-radius-sm)', padding: '16px', marginBottom: '20px' }}>
                    <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', color: '#ef4444', fontWeight: 'bold' }}>
                      ⚠️ {language === 'en' 
                        ? 'Under 18: Guardian details required to send the contract/agreement.' 
                        : 'Under 18 år: Uppgifter till vårdnadshavare krävs för att skicka avtalet.'}
                    </p>
                    <div className="form-row">
                      <div className="form-group" style={{ margin: 0 }}>
                        <label htmlFor="guardianEmail">{language === 'en' ? 'Guardian\'s Email *' : 'Vårdnadshavares E-post *'}</label>
                        <input
                          type="email"
                          id="guardianEmail"
                          name="guardianEmail"
                          value={formData.guardianEmail}
                          onChange={handleChange}
                          placeholder="mamma/pappa@mail.se"
                          required
                        />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label htmlFor="guardianPhone">{language === 'en' ? 'Guardian\'s Phone *' : 'Vårdnadshavares Tel *'}</label>
                        <input
                          type="tel"
                          id="guardianPhone"
                          name="guardianPhone"
                          value={formData.guardianPhone}
                          onChange={handleChange}
                          placeholder="070-123 45 67"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}


                <div className="form-group">
                  <label htmlFor="personalNumber">
                    {language === 'fa' ? 'کد ملی / شماره شناسایی *' : language === 'en' ? 'Personal Identity Number *' : 'Personnummer *'}
                  </label>
                  <input
                    type="text"
                    id="personalNumber"
                    name="personalNumber"
                    value={formData.personalNumber}
                    onChange={handleChange}
                    placeholder="ÅÅÅÅMMDD-XXXX"
                    required
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                    {language === 'fa' 
                      ? 'توجه: برای ثبت نام باید حداقل ۱۶ سال سن داشته باشید. شماره شناسایی برای ثبت قرارداد و تأیید سن الزامی است.' 
                      : language === 'en' 
                      ? 'Note: You must be at least 16 years old to apply. Required for contract and age verification.' 
                      : 'Obs: Du måste vara minst 16 år gammal för att ansöka. Krävs för avtalsregistrering och åldersverifiering.'}
                  </span>
                </div>

                <div className="form-group">
                  <label htmlFor="city">{t('applyLabelCity')}</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder={t('applyPlaceholderCity')}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">{t('applyLabelEmail')}</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('applyPlaceholderEmail')}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phoneNumber">{t('applyLabelPhone')}</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* ── FREE TRIAL: Create Account Password Block ── */}
                {isFreeTrial && (
                  <div className="fade-in" style={{
                    margin: '20px 0',
                    padding: '20px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(184,149,71,0.08) 0%, rgba(99,102,241,0.06) 100%)',
                    border: '1px solid rgba(184,149,71,0.25)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '1.3rem' }}>🔐</span>
                      <div>
                        <h4 style={{ color: 'var(--accent-gold)', margin: 0, fontSize: '0.95rem', fontWeight: 'bold' }}>
                          {language === 'en' ? 'Create your account' : 'Skapa ditt konto'}
                        </h4>
                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.78rem', marginTop: '2px' }}>
                          {language === 'en'
                            ? 'You will use this password to log in and view your 14-day program.'
                            : 'Du loggar in med detta lösenord för att se ditt 14-dagars program efter att du svarat på frågorna.'}
                        </p>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="password" style={{ fontSize: '0.82rem' }}>
                          {language === 'en' ? 'Password (min 6 characters)' : 'Lösenord (minst 6 tecken)'}
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          required
                          style={{ background: 'rgba(0,0,0,0.2)', border: formData.password.length > 0 && formData.password.length < 6 ? '1px solid #ef4444' : '1px solid var(--border-glass)' }}
                        />
                        {formData.password.length > 0 && formData.password.length < 6 && (
                          <span style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '3px', display: 'block' }}>
                            {language === 'en' ? 'Too short — min 6 chars' : 'För kort — minst 6 tecken'}
                          </span>
                        )}
                      </div>
                      <div className="form-group">
                        <label htmlFor="confirmPassword" style={{ fontSize: '0.82rem' }}>
                          {language === 'en' ? 'Confirm Password' : 'Bekräfta lösenord'}
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          required
                          style={{
                            background: 'rgba(0,0,0,0.2)',
                            border: formData.confirmPassword.length > 0
                              ? formData.confirmPassword === formData.password ? '1px solid #10b981' : '1px solid #ef4444'
                              : '1px solid var(--border-glass)'
                          }}
                        />
                        {formData.confirmPassword.length > 0 && formData.confirmPassword !== formData.password && (
                          <span style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '3px', display: 'block' }}>
                            {language === 'en' ? 'Does not match' : 'Matchar inte'}
                          </span>
                        )}
                        {formData.confirmPassword.length > 0 && formData.confirmPassword === formData.password && (
                          <span style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '3px', display: 'block' }}>
                            ✓ {language === 'en' ? 'Passwords match' : 'Matchar!'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="trainingWish">{t('applyLabelWish')}</label>
                  <select
                    id="trainingWish"
                    name="trainingWish"
                    value={formData.trainingWish}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t('applyPlaceholderWish')}</option>
                    {packagesList.map((pkg, idx) => (
                      <option key={idx} value={pkg}>{pkg}</option>
                    ))}
                  </select>
                </div>

                {showDiscountToggle && (
                  <div className="form-group checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px', marginBottom: '15px' }}>
                    <input
                      type="checkbox"
                      id="isStudentOrSenior"
                      checked={isStudentOrSenior}
                      onChange={(e) => setIsStudentOrSenior(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-cyan)' }}
                    />
                    <label htmlFor="isStudentOrSenior" style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-silver)', margin: 0, userSelect: 'none' }}>
                      {t('applyLabelStudentDiscount')}
                    </label>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="message">{t('applyLabelMessage')}</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('applyPlaceholderMessage')}
                    rows="4"
                  ></textarea>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button 
                    type="button" 
                    onClick={() => {
                      if (validateStep1()) {
                        setFormStep(2)
                      }
                    }} 
                    className="btn-primary" 
                    style={{ padding: '12px 32px' }}
                  >
                    {language === 'en' ? 'Continue' : 'Fortsätt'} <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: GOALS & FOCUS */}
          {formStep === 2 && (
            <div className="fade-in">
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-white)', marginBottom: '16px' }}>
                {language === 'en' ? 'What are your main goals?' : 'Vad är dina träningsmål?'}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {[
                  { id: 'lose_weight', label: language === 'en' ? 'Lose weight' : 'Gå ner i vikt', icon: '🔥' },
                  { id: 'get_fit', label: language === 'en' ? 'Get fit' : 'Komma i form', icon: '🏃' },
                  { id: 'gain_muscle', label: language === 'en' ? 'Gain muscle' : 'Bygga muskler', icon: '💪' },
                  { id: 'metabolism', label: language === 'en' ? 'Boost metabolism' : 'Öka förbränning', icon: '⚡' },
                  { id: 'energy', label: language === 'en' ? 'Improve energy levels' : 'Få mer energi i vardagen', icon: '☀️' },
                  { id: 'health', label: language === 'en' ? 'Improve overall health' : 'Bättre hälsa & livsbalans', icon: '❤️' }
                ].map(item => {
                  const isSelected = formData.goals.includes(item.id)
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleGoalToggle(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: 'var(--border-radius-sm)',
                        border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        backgroundColor: isSelected ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: isSelected ? 'var(--text-white)' : 'var(--text-silver)',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-white)', marginBottom: '16px' }}>
                {language === 'en' ? 'Any areas you\'d like to improve?' : 'Några områden du vill fokusera extra på?'}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
                {[
                  { id: 'chest', label: language === 'en' ? 'Chest' : 'Bröst', icon: '🔘' },
                  { id: 'belly', label: language === 'en' ? 'Belly / Core' : 'Mage / Midja', icon: '🌀' },
                  { id: 'legs', label: language === 'en' ? 'Legs' : 'Ben', icon: '🦵' },
                  { id: 'arms', label: language === 'en' ? 'Arms' : 'Armar', icon: '💪' },
                  { id: 'back', label: language === 'en' ? 'Back' : 'Rygg', icon: '🛡️' },
                  { id: 'butt', label: language === 'en' ? 'Glutes / Butt' : 'Säte / Rumpa', icon: '🍑' }
                ].map(item => {
                  const isSelected = formData.focusAreas.includes(item.id)
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleFocusToggle(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        borderRadius: 'var(--border-radius-sm)',
                        border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        backgroundColor: isSelected ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: isSelected ? 'var(--text-white)' : 'var(--text-silver)',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', border: '1.5px solid var(--text-muted)', borderRadius: '4px', backgroundColor: isSelected ? 'var(--accent-gold)' : 'transparent' }}>
                          {isSelected && <Check size={10} color="#000" style={{ strokeWidth: 3 }} />}
                        </span>
                        {item.label}
                      </span>
                      <span>{item.icon}</span>
                    </button>
                  )
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button type="button" onClick={() => setFormStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-silver)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowLeft size={16} /> {language === 'en' ? 'Back' : 'Bakåt'}
                </button>
                <button type="button" onClick={() => setFormStep(3)} className="btn-primary" style={{ padding: '12px 32px' }}>
                  {language === 'en' ? 'Continue' : 'Fortsätt'} <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PHYSICAL INFO & BMI */}
          {formStep === 3 && (
            <div className="fade-in">
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-white)', marginBottom: '16px' }}>
                {language === 'en' ? 'Choose your current body type:' : 'Välj din nuvarande kroppstyp:'}
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
                {[
                  { id: 'skinny', label: language === 'en' ? 'Skinny' : 'Smal' },
                  { id: 'regular', label: language === 'en' ? 'Regular' : 'Normal' },
                  { id: 'pot_belly', label: language === 'en' ? 'Pot belly' : 'Lite mage' },
                  { id: 'extra', label: language === 'en' ? 'Extra' : 'Kraftig / Övervikt' }
                ].map(item => {
                  const isSelected = formData.currentBody === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, currentBody: item.id }))}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--border-radius-sm)',
                        border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        backgroundColor: isSelected ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: isSelected ? 'var(--text-white)' : 'var(--text-silver)',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>

              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-white)', marginBottom: '16px' }}>
                {language === 'en' ? 'Choose the body you want:' : 'Välj din målkropp:'}
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
                {[
                  { id: 'smaller', label: language === 'en' ? 'Smaller size' : 'Mindre storlek' },
                  { id: 'lean', label: language === 'en' ? 'Lean / Toned' : 'Hård & Deffad' },
                  { id: 'athletic', label: language === 'en' ? 'Athletic' : 'Atletisk & Stark' },
                  { id: 'shredded', label: language === 'en' ? 'Shredded' : 'Muskelös / Rippad' }
                ].map(item => {
                  const isSelected = formData.desiredBody === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, desiredBody: item.id }))}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--border-radius-sm)',
                        border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        backgroundColor: isSelected ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: isSelected ? 'var(--text-white)' : 'var(--text-silver)',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>

              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-white)', marginBottom: '16px' }}>
                {language === 'en' ? 'Enter your metrics' : 'Ange dina mått'}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="height" style={{ fontSize: '0.78rem' }}>{language === 'en' ? 'Height (cm)' : 'Längd (cm)'}</label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="175"
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', padding: '10px' }}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="weight" style={{ fontSize: '0.78rem' }}>{language === 'en' ? 'Current (kg)' : 'Vikt (kg)'}</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="75"
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', padding: '10px' }}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="targetWeight" style={{ fontSize: '0.78rem' }}>{language === 'en' ? 'Target (kg)' : 'Målvikt (kg)'}</label>
                  <input
                    type="number"
                    id="targetWeight"
                    name="targetWeight"
                    value={formData.targetWeight}
                    onChange={handleChange}
                    placeholder="70"
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', padding: '10px' }}
                  />
                </div>
              </div>

              {/* Optional US Navy Body Fat % Measurements */}
              <div style={{ marginBottom: '16px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 'bold', marginBottom: '8px' }}>
                  {language === 'en' ? '📏 Optional Body Measurements (for US Navy Body Fat %):' : '📏 Valfria kroppsmått (för exakt US Navy Kroppsfett %):'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="neck" style={{ fontSize: '0.72rem' }}>{language === 'en' ? 'Neck (cm)' : 'Hals (cm)'}</label>
                    <input
                      type="number"
                      step="0.5"
                      id="neck"
                      name="neck"
                      value={formData.neck}
                      onChange={handleChange}
                      placeholder="35"
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', padding: '8px', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="waist" style={{ fontSize: '0.72rem' }}>{language === 'en' ? 'Waist (cm)' : 'Midja (cm)'}</label>
                    <input
                      type="number"
                      step="0.5"
                      id="waist"
                      name="waist"
                      value={formData.waist}
                      onChange={handleChange}
                      placeholder="75"
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', padding: '8px', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="hip" style={{ fontSize: '0.72rem' }}>{language === 'en' ? 'Hip (cm - Kvinna)' : 'Höft (cm - Kvinna)'}</label>
                    <input
                      type="number"
                      step="0.5"
                      id="hip"
                      name="hip"
                      value={formData.hip}
                      onChange={handleChange}
                      placeholder="95"
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', padding: '8px', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Activity level and weight goal select inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="activityLevel" style={{ fontSize: '0.78rem' }}>{language === 'en' ? 'Activity Level' : 'Aktivitetsnivå'}</label>
                  <select
                    id="activityLevel"
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleChange}
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', padding: '10px', height: '42px', color: 'var(--text-white)' }}
                  >
                    <option value="Stillasittande">{language === 'en' ? 'Sedentary (PAL 1.2 - No exercise)' : 'Stillasittande (PAL 1,2 - Ingen träning)'}</option>
                    <option value="Lätt aktiv">{language === 'en' ? 'Lightly Active (PAL 1.375 - 1-3x/week)' : 'Lätt aktiv (PAL 1,375 - Träning 1–3 ggr/v)'}</option>
                    <option value="Måttligt aktiv">{language === 'en' ? 'Moderately Active (PAL 1.55 - 3-5x/week)' : 'Måttligt aktiv (PAL 1,55 - Träning 3–5 ggr/v)'}</option>
                    <option value="Mycket aktiv">{language === 'en' ? 'Very Active (PAL 1.725 - 6-7x/week)' : 'Mycket aktiv (PAL 1,725 - Träning 6–7 ggr/v)'}</option>
                    <option value="Extremt aktiv">{language === 'en' ? 'Extremely Active (PAL 1.9 - Physical job)' : 'Extremt aktiv (PAL 1,9 - Hårt jobb + träning)'}</option>
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="weightGoal" style={{ fontSize: '0.78rem' }}>{language === 'en' ? 'Caloric Goal' : 'Mål för kaloriberäkning'}</label>
                  <select
                    id="weightGoal"
                    name="weightGoal"
                    value={formData.weightGoal}
                    onChange={handleChange}
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', padding: '10px', height: '42px', color: 'var(--text-white)' }}
                  >
                    <option value="Viktnedgång">{language === 'en' ? 'Weight Loss (Deficit -500 kcal)' : 'Viktnedgång (Underskott -500 kcal)'}</option>
                    <option value="Viktuppgång">{language === 'en' ? 'Muscle Gain (Surplus +300 kcal)' : 'Viktuppgång / Muskelbygge (Överskott +300 kcal)'}</option>
                    <option value="Bibehålla">{language === 'en' ? 'Maintenance (Balance 0 kcal)' : 'Bibehålla vikten (Balans 0 kcal)'}</option>
                  </select>
                </div>
              </div>

              {bmi && (
                <div 
                  className="glass-panel fade-in" 
                  style={{ 
                    padding: '20px', 
                    borderRadius: 'var(--border-radius-md)', 
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    marginBottom: '24px',
                    background: 'rgba(255,255,255,0.01)'
                  }}
                >
                  <h4 style={{ color: 'var(--text-white)', fontSize: '1rem', fontWeight: 'bold', margin: '0 0 16px 0', textAlign: 'center' }}>
                    {language === 'en' ? 'Your personal summary' : 'Din personliga sammanfattning'}
                  </h4>

                  {/* BMI Progress bar chart */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span>{language === 'en' ? 'Body Mass Index (BMI)' : 'Kroppsmasseindex (BMI)'}</span>
                      <span style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>{bmi}</span>
                    </div>
                    
                    {/* BMI Slider scale */}
                    <div style={{ position: 'relative', height: '8px', borderRadius: '4px', background: 'linear-gradient(to right, #3b82f6 0%, #10b981 30%, #f59e0b 70%, #ef4444 100%)', margin: '8px 0 20px 0' }}>
                      {/* Indicator dot */}
                      {(() => {
                        const numericBmi = parseFloat(bmi)
                        // Map BMI range (15 to 35) to percentage (0% to 100%)
                        let pct = ((numericBmi - 15) / 20) * 100
                        if (pct < 2) pct = 2
                        if (pct > 98) pct = 98
                        return (
                          <div style={{ position: 'absolute', left: `${pct}%`, top: '-4px', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#fff', border: '3px solid var(--accent-gold)', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}></div>
                            <span style={{ fontSize: '0.68rem', backgroundColor: 'var(--accent-gold)', color: '#000', padding: '1px 5px', borderRadius: '3px', fontWeight: 'bold', marginTop: '4px', whiteSpace: 'nowrap' }}>
                              You - {bmi}
                            </span>
                          </div>
                        )
                      })()}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '22px' }}>
                      <span>{language === 'en' ? 'Underweight' : 'Undervikt'}</span>
                      <span>{language === 'en' ? 'Healthy' : 'Normalvikt'}</span>
                      <span>{language === 'en' ? 'Overweight' : 'Övervikt'}</span>
                      <span>{language === 'en' ? 'Obese' : 'Fetma'}</span>
                    </div>
                  </div>

                  {/* Summary Box Message */}
                  <div 
                    style={{ 
                      padding: '10px 14px', 
                      borderRadius: '6px', 
                      backgroundColor: 'rgba(16, 185, 129, 0.08)', 
                      border: '1px solid rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>🎯</span>
                    <span>
                      {parseFloat(bmi) < 18.5 
                        ? (language === 'en' ? 'Focus on healthy weight gain & muscle building.' : 'Fokus på hälsosam viktuppgång & muskelbygge.')
                        : parseFloat(bmi) < 25
                        ? (language === 'en' ? 'Good starting BMI to get a fit body.' : 'Bra start-BMI för att skulptera och tona kroppen.')
                        : (language === 'en' ? 'Excellent starting point for fat loss and energy boost.' : 'Utmärkt utgångspunkt för fettförbränning och ökad energi.')}
                    </span>
                  </div>

                  {/* Real-time Calories & Macros Mifflin-St Jeor Panel */}
                  {(() => {
                    const metrics = calculateCaloriesAndMacros()
                    const numericBmi = parseFloat(bmi)
                    const age = parseInt(formData.age, 10) || 25
                    const factor = formData.gender === 'Man' ? 16.2 : 5.4
                    const deurenbergBf = (1.20 * numericBmi + 0.23 * age - factor).toFixed(1)

                    // US Navy body fat calculation if cm entered
                    const h = parseFloat(formData.height)
                    const w = parseFloat(formData.waist)
                    const n = parseFloat(formData.neck)
                    const hp = parseFloat(formData.hip)
                    let navyBf = null
                    if (h && w && n) {
                      if (formData.gender === 'Man' && w > n) {
                        const val = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450
                        if (!isNaN(val) && val >= 3 && val <= 60) navyBf = val.toFixed(1)
                      } else if (formData.gender !== 'Man' && hp && (w + hp > n)) {
                        const val = 495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.22100 * Math.log10(h)) - 450
                        if (!isNaN(val) && val >= 5 && val <= 65) navyBf = val.toFixed(1)
                      }
                    }

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Upper row: general stats and miniature silhouette */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px', alignItems: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-silver)' }}>
                              🔍 {language === 'en' ? 'Body Fat' : 'Kroppsfett'}: <strong style={{ color: 'var(--accent-cyan)' }}>{navyBf ? `${navyBf}% (US Navy)` : `${deurenbergBf}% (Est.)`}</strong>
                            </div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-silver)' }}>
                              📊 {language === 'en' ? 'BMR (Basal metabolism)' : 'BMR (Basalmetabolism)'}: <strong style={{ color: 'var(--text-white)' }}>{metrics ? `${metrics.bmr} kcal` : '--'}</strong>
                            </div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-silver)' }}>
                              ⚡ {language === 'en' ? 'TDEE (Daily energy need)' : 'TDEE (Dagligt energibehov)'}: <strong style={{ color: 'var(--text-white)' }}>{metrics ? `${metrics.tdee} kcal` : '--'}</strong>
                            </div>
                          </div>
                          
                          {/* Miniature silhouette graphics box */}
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px', background: 'rgba(0,0,0,0.15)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <span style={{ fontSize: '2rem' }}>{formData.gender === 'Man' ? '🏃‍♂️' : '🏃‍♀️'}</span>
                              <span style={{ fontSize: '0.62rem', color: 'var(--accent-gold)', fontWeight: 'bold', marginTop: '4px' }}>Muscle & Focus</span>
                            </div>
                          </div>
                        </div>

                        {metrics && (
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                            {/* Target Calories Badge */}
                            <div 
                              style={{ 
                                padding: '10px 14px', 
                                borderRadius: '6px', 
                                backgroundColor: 'rgba(184, 149, 71, 0.08)', 
                                border: '1px solid rgba(184, 149, 71, 0.15)',
                                color: 'var(--accent-gold)',
                                fontSize: '0.85rem',
                                fontWeight: 'bold',
                                marginBottom: '14px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}
                            >
                              <span>🔥 {language === 'en' ? 'Daily Target Calories:' : 'Ditt dagliga kalorimål:'}</span>
                              <span style={{ fontSize: '1rem', color: 'var(--text-white)' }}>{metrics.targetCalories} kcal</span>
                            </div>

                            {/* Macro Breakdown Rows */}
                            <h5 style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {language === 'en' ? 'Calculated Macro Target (Mifflin-St Jeor)' : 'Beräknad makrofördelning (Mifflin-St Jeor):'}
                            </h5>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                              {/* Protein */}
                              <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
                                <span style={{ display: 'block', fontSize: '0.68rem', color: '#38bdf8', fontWeight: 'bold', textTransform: 'uppercase' }}>Protein</span>
                                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', margin: '2px 0' }}>{metrics.protein}g</strong>
                                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{metrics.protein * 4} kcal</span>
                              </div>
                              {/* Fat */}
                              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
                                <span style={{ display: 'block', fontSize: '0.68rem', color: '#f59e0b', fontWeight: 'bold', textTransform: 'uppercase' }}>Fett</span>
                                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', margin: '2px 0' }}>{metrics.fat}g</strong>
                                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{metrics.fat * 9} kcal</span>
                              </div>
                              {/* Carbs */}
                              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
                                <span style={{ display: 'block', fontSize: '0.68rem', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase' }}>Kolhydrater</span>
                                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', margin: '2px 0' }}>{metrics.carbs}g</strong>
                                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{metrics.carbs * 4} kcal</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* Dietary Preferences Question */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                  {language === 'en' ? 'What is your dietary preference?' : 'Vilken kostpreferens har du?'}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                  {[
                    { id: 'Blandkost', label: language === 'en' ? 'Standard / All foods' : 'Blandkost' },
                    { id: 'Vegetarisk', label: language === 'en' ? 'Vegetarian' : 'Vegetarisk' },
                    { id: 'Vegansk', label: language === 'en' ? 'Vegan' : 'Vegansk' },
                    { id: 'Pescetarisk', label: language === 'en' ? 'Pescetarian' : 'Pescetarisk' },
                    { id: 'Annat', label: language === 'en' ? 'Other' : 'Annat' }
                  ].map(opt => {
                    const isSelected = formData.dietPreference === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, dietPreference: opt.id }))}
                        style={{
                          padding: '10px',
                          borderRadius: 'var(--border-radius-sm)',
                          border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                          backgroundColor: isSelected ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                          color: isSelected ? 'var(--text-white)' : 'var(--text-silver)',
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Food Allergies Question */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                  {language === 'en' ? 'Do you have any food allergies or intolerances?' : 'Har du några matallergier eller intoleranser?'}
                </label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  {['Ja', 'Nej'].map(opt => {
                    const isSelected = formData.hasAllergies === opt
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, hasAllergies: opt }))}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: 'var(--border-radius-sm)',
                          border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                          backgroundColor: isSelected ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                          color: isSelected ? 'var(--text-white)' : 'var(--text-silver)',
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        {opt === 'Ja' ? (language === 'en' ? 'Yes' : 'Ja') : (language === 'en' ? 'No' : 'Nej')}
                      </button>
                    )
                  })}
                </div>

                {formData.hasAllergies === 'Ja' && (
                  <div className="fade-in" style={{ marginTop: '10px' }}>
                    <textarea
                      name="allergyDetails"
                      value={formData.allergyDetails}
                      onChange={handleChange}
                      placeholder={language === 'en' ? 'Describe your allergies or food restrictions so we can adjust your diet plan safely...' : 'Beskriv dina allergier eller livsmedel du inte kan äta så vi kan anpassa kostschemat säkert...'}
                      rows="3"
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)' }}
                      required
                    ></textarea>
                  </div>
                )}
              </div>

              {/* Injuries & Medical Conditions Question */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                  {language === 'en' ? 'Do you have any injuries, medical conditions, or illnesses?' : 'Har du några skador, sjukdomar eller medicinska tillstånd?'}
                </label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  {['Ja', 'Nej'].map(opt => {
                    const isSelected = formData.hasInjuries === opt
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, hasInjuries: opt }))}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: 'var(--border-radius-sm)',
                          border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                          backgroundColor: isSelected ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                          color: isSelected ? 'var(--text-white)' : 'var(--text-silver)',
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        {opt === 'Ja' ? (language === 'en' ? 'Yes' : 'Ja') : (language === 'en' ? 'No' : 'Nej')}
                      </button>
                    )
                  })}
                </div>

                {formData.hasInjuries === 'Ja' && (
                  <div className="fade-in" style={{ marginTop: '10px' }}>
                    <textarea
                      name="injuryDetails"
                      value={formData.injuryDetails}
                      onChange={handleChange}
                      placeholder={language === 'en' ? 'Describe your injury or condition so we can safely customize your plan...' : 'Beskriv din skada eller ditt tillstånd så vi kan anpassa träningen säkert...'}
                      rows="3"
                      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)' }}
                      required
                    ></textarea>
                  </div>
                )}
              </div>

              {/* Health Declaration Checkbox */}
              <div 
                className="form-group checkbox-group" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '10px', 
                  marginTop: '15px', 
                  marginBottom: '25px',
                  background: 'rgba(255,255,255,0.02)',
                  padding: '12px',
                  borderRadius: 'var(--border-radius-sm)',
                  border: '1px solid var(--border-glass)'
                }}
              >
                <input
                  type="checkbox"
                  id="healthDeclarationConfirmed"
                  checked={formData.healthDeclarationConfirmed}
                  onChange={(e) => setFormData(prev => ({ ...prev, healthDeclarationConfirmed: e.target.checked }))}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-gold)', marginTop: '2px' }}
                />
                <label 
                  htmlFor="healthDeclarationConfirmed" 
                  style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-silver)', margin: 0, userSelect: 'none', lineHeight: '1.4' }}
                >
                  {language === 'fa' 
                    ? 'من تأیید می‌کنم که در سلامت کامل هستم و هیچ‌گونه آسیب یا بیماری که مانع از تمرین شود ندارم.' 
                    : language === 'en' 
                    ? 'I certify that I am in good health and do not have any injuries or illnesses that make training unsuitable.' 
                    : 'Jag intygar att jag är vid god hälsa och inte har några skador eller sjukdomar som gör träningen olämplig.'}
                </label>
              </div>

              {/* Action row (Submit buttons if paid package, otherwise Continue) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '10px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => setFormStep(2)} style={{ background: 'none', border: 'none', color: 'var(--text-silver)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowLeft size={16} /> {language === 'en' ? 'Back' : 'Bakåt'}
                </button>
                
                {isFreeTrial ? (
                  <button 
                    type="button" 
                    onClick={() => setFormStep(4)} 
                    className="btn-primary" 
                    style={{ padding: '12px 32px' }}
                    disabled={!formData.healthDeclarationConfirmed}
                  >
                    {language === 'en' ? 'Continue' : 'Fortsätt'} <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                      type="button" 
                      className="btn-secondary" 
                      onClick={(e) => handleFormSubmit(e, false)}
                      disabled={loading || !formData.healthDeclarationConfirmed}
                      style={{ padding: '12px 24px', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}
                    >
                      <Send size={14} style={{ marginRight: '8px' }} />
                      <span>{t('applyBtnSubmit')}</span>
                    </button>
                    
                    <button 
                      type="button" 
                      className="btn-primary" 
                      onClick={(e) => handleFormSubmit(e, true)}
                      disabled={loading || !formData.healthDeclarationConfirmed}
                      style={{ padding: '12px 24px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <CreditCard size={14} style={{ marginRight: '8px' }} />
                      <span>{t('applyBtnPayWithStripe')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: LIFESTYLE & HABITS (Only visible for Free Trial) */}
          {formStep === 4 && isFreeTrial && (
            <div className="fade-in">
              {/* Testimonial Banner */}
              <div className="glass-panel" style={{ padding: '15px', borderRadius: 'var(--border-radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '24px', display: 'flex', gap: '15px', background: 'rgba(16, 185, 129, 0.04)' }}>
                <img 
                  src="/cosmic_background_1781471732996.png" 
                  alt="Transformation" 
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                  onError={(e) => { e.target.src = '/why_choose_me.png' }}
                />
                <div>
                  <h4 style={{ color: '#10b981', margin: '0 0 4px 0', fontSize: '0.98rem', fontWeight: 'bold' }}>
                    {language === 'en' ? 'Get visible results in 4 weeks' : 'Få synliga resultat på 4 veckor'}
                  </h4>
                  <div style={{ display: 'flex', color: 'var(--accent-gold)', gap: '2px', marginBottom: '6px' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-silver)', lineHeight: '1.4', margin: 0 }}>
                    {language === 'en' 
                      ? '"I lost weight and gained strength following this plan. Highly recommend!" - Andy Price, 36' 
                      : '"Jag tappade fett och byggde muskler snabbt med detta upplägg. Rekommenderas starkt!" - Jonas, 36'}
                  </p>
                </div>
              </div>

              {/* Sleep Hours Question */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                  {language === 'en' ? 'How many hours do you usually sleep?' : 'Hur många timmar sover du vanligtvis?'}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { id: '<5', label: language === 'en' ? 'Less than 5h' : 'Mindre än 5 timmar' },
                    { id: '5-6', label: '5-6 timmar' },
                    { id: '7-8', label: '7-8 timmar' },
                    { id: '>8', label: language === 'en' ? 'More than 8h' : 'Mer än 8 timmar' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, sleepHours: item.label }))}
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--border-radius-sm)',
                        border: formData.sleepHours === item.label ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        backgroundColor: formData.sleepHours === item.label ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: formData.sleepHours === item.label ? 'var(--text-white)' : 'var(--text-silver)',
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Water Intake Question */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                  {language === 'en' ? 'How much water do you drink daily?' : 'Hur mycket vatten dricker du per dag?'}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { id: 'coffee', label: language === 'en' ? 'Just coffee/tea' : 'Bara kaffe eller te' },
                    { id: '2-5', label: language === 'en' ? '2-5 glasses' : '2-5 glas' },
                    { id: '6-8', label: language === 'en' ? '6-8 glasses' : '6-8 glas' },
                    { id: '8+', label: language === 'en' ? 'More than 8 glasses' : 'Mer än 8 glas' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, waterDaily: item.label }))}
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--border-radius-sm)',
                        border: formData.waterDaily === item.label ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        backgroundColor: formData.waterDaily === item.label ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: formData.waterDaily === item.label ? 'var(--text-white)' : 'var(--text-silver)',
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily habits checklist */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                  {language === 'en' ? 'Select all that you tend to do:' : 'Välj de vanor som stämmer in på dig:'}
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: 'late_eat', label: language === 'en' ? 'I eat late at night' : 'Jag äter sent på kvällen' },
                    { id: 'sweets', label: language === 'en' ? "I can't give up eating sweets" : 'Jag har svårt att motstå sötsaker' },
                    { id: 'soda', label: language === 'en' ? 'I love soft drinks / soda' : 'Jag dricker mycket läsk/energidryck' },
                    { id: 'alcohol', label: language === 'en' ? 'I consume alcohol from time to time' : 'Jag dricker alkohol då och då' },
                    { id: 'fastfood', label: language === 'en' ? 'I love fatty or salty foods' : 'Jag äter ofta fet/salt mat eller snabbmat' },
                    { id: 'none', label: language === 'en' ? 'None of the above' : 'Inget av ovanstående' }
                  ].map(item => {
                    const isSelected = formData.habits.includes(item.id)
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleHabitToggle(item.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 14px',
                          borderRadius: 'var(--border-radius-sm)',
                          border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                          backgroundColor: isSelected ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                          color: isSelected ? 'var(--text-white)' : 'var(--text-silver)',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', border: '1.5px solid var(--text-muted)', borderRadius: '4px', backgroundColor: isSelected ? 'var(--accent-gold)' : 'transparent', flexShrink: 0 }}>
                          {isSelected && <Check size={10} color="#000" style={{ strokeWidth: 3 }} />}
                        </span>
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Energy levels */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                  {language === 'en' ? 'What are your energy levels throughout the day?' : 'Hur är din energinivå under dagen?'}
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: 'low', label: language === 'en' ? 'Low, I feel tired throughout the day' : 'Låg, känner mig trött hela dagen', icon: '😴' },
                    { id: 'slump', label: language === 'en' ? 'Post lunch slump' : 'Trött efter lunch', icon: '🥱' },
                    { id: 'before_meals', label: language === 'en' ? 'Dragging before meals' : 'Trött och hungrig innan måltider', icon: '😕' },
                    { id: 'high', label: language === 'en' ? 'High and steady' : 'Hög och stabil energi', icon: '🤩' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, energyLevels: item.label }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: 'var(--border-radius-sm)',
                        border: formData.energyLevels === item.label ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        backgroundColor: formData.energyLevels === item.label ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: formData.energyLevels === item.label ? 'var(--text-white)' : 'var(--text-silver)',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span>{item.label}</span>
                      <span>{item.icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typical Day Activity Question */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                  {language === 'en' ? 'How would you describe your typical day?' : 'Hur skulle du beskriva en vanlig dag för dig?'}
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: 'sitting', label: language === 'en' ? 'I spend most of the day sitting' : 'Mest stillasittande under dagen', icon: '💻' },
                    { id: 'breaks', label: language === 'en' ? 'I take active breaks' : 'Jag tar aktiva pauser', icon: '🚶' },
                    { id: 'feet', label: language === 'en' ? "I'm on my feet all day long" : 'Står och går hela dagen', icon: '🏃' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, typicalDay: item.label }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: 'var(--border-radius-sm)',
                        border: formData.typicalDay === item.label ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        backgroundColor: formData.typicalDay === item.label ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: formData.typicalDay === item.label ? 'var(--text-white)' : 'var(--text-silver)',
                        fontSize: '0.88rem',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{item.label}</span>
                      <span>{item.icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight Change Question */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                  {language === 'en' ? 'How does your weight typically change?' : 'Hur brukar din vikt förändras?'}
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: 'fast_slow', label: language === 'en' ? 'I gain weight fast but lose it slowly' : 'Går upp snabbt men tappar långsamt', icon: '📉' },
                    { id: 'easily', label: language === 'en' ? 'I gain and lose weight easily' : 'Går upp och ner enkelt', icon: '⚖️' },
                    { id: 'struggle', label: language === 'en' ? 'I struggle to gain weight or muscle' : 'Kämpar med att gå upp i vikt eller muskler', icon: '📈' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, weightChange: item.label }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: 'var(--border-radius-sm)',
                        border: formData.weightChange === item.label ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        backgroundColor: formData.weightChange === item.label ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: formData.weightChange === item.label ? 'var(--text-white)' : 'var(--text-silver)',
                        fontSize: '0.88rem',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{item.label}</span>
                      <span>{item.icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Exercise Frequency Question */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                  {language === 'en' ? 'How often do you exercise?' : 'Hur ofta tränar du?'}
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: 'never', label: language === 'en' ? 'Never' : 'Aldrig', bars: '░░░' },
                    { id: 'month', label: language === 'en' ? 'Several times per month' : 'Några gånger i månaden', bars: '█░░' },
                    { id: 'week', label: language === 'en' ? 'Several times per week' : 'Några gånger i veckan', bars: '██░' },
                    { id: 'daily', label: language === 'en' ? 'Almost every day' : 'Nästan varje dag', bars: '███' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, exerciseFrequency: item.label }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: 'var(--border-radius-sm)',
                        border: formData.exerciseFrequency === item.label ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        backgroundColor: formData.exerciseFrequency === item.label ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: formData.exerciseFrequency === item.label ? 'var(--text-white)' : 'var(--text-silver)',
                        fontSize: '0.88rem',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{item.label}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.95rem', color: formData.exerciseFrequency === item.label ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                        {item.bars}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. Workout Habits, Experience & Availability Section */}
              <div style={{ marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px' }}>
                <h4 style={{ color: 'var(--accent-gold)', fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  🏃‍♂️ {language === 'en' ? 'Training Habits & Availability' : 'Träningsvanor & Tillgänglighet'}
                </h4>

                {/* Days per week */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                    {language === 'en' ? 'How many days a week do you want/can train?' : 'Hur många dagar i veckan vill/kan du träna?'}
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['1-2', '3', '4', '5', '6-7'].map(d => {
                      const isSelected = formData.trainingDays === d
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, trainingDays: d }))}
                          style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '4px',
                            border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                            backgroundColor: isSelected ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                            color: isSelected ? 'var(--text-white)' : 'var(--text-silver)',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          {d} {language === 'en' ? 'days' : 'dagar'}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Duration */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                    {language === 'en' ? 'How much time do you have per workout session?' : 'Hur lång tid har du per träningspass?'}
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['30 min', '45 min', '60 min', '90+ min'].map(dur => {
                      const isSelected = formData.trainingDuration === dur
                      return (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, trainingDuration: dur }))}
                          style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '4px',
                            border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                            backgroundColor: isSelected ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                            color: isSelected ? 'var(--text-white)' : 'var(--text-silver)',
                            fontSize: '0.82rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          {dur}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Location */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                    {language === 'en' ? 'Where do you train?' : 'Tränar du hemma, på gym, eller båda?'}
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['Hemma', 'Gym', 'Båda'].map(loc => {
                      const isSelected = formData.trainingLocation === loc
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, trainingLocation: loc }))}
                          style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '4px',
                            border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                            backgroundColor: isSelected ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                            color: isSelected ? 'var(--text-white)' : 'var(--text-silver)',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          {loc}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Equipment */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                    {language === 'en' ? 'What equipment do you have access to?' : 'Vilken utrustning har du tillgång till?'}
                  </label>
                  <select
                    name="equipmentAvailable"
                    value={formData.equipmentAvailable}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'var(--text-white)' }}
                  >
                    <option value="Fria vikter & maskiner">{language === 'en' ? 'Free weights & machines (Full Gym)' : 'Fria vikter & maskiner (Fullt gym)'}</option>
                    <option value="Endast fria vikter">{language === 'en' ? 'Only free weights (Dumbbells/barbells)' : 'Endast fria vikter (Hantlar/skivstång)'}</option>
                    <option value="Gummiband & kroppsvikt">{language === 'en' ? 'Resistance bands & bodyweight' : 'Gummiband & kroppsvikt'}</option>
                    <option value="Ingen utrustning alls">{language === 'en' ? 'No equipment at all (Pure bodyweight)' : 'Ingen utrustning alls'}</option>
                  </select>
                </div>

                {/* Purpose */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                    {language === 'en' ? 'Is this training for general health, a competition, or something else?' : 'Är det här för allmän hälsa, en tävling/event, eller något annat?'}
                  </label>
                  <select
                    name="trainingReason"
                    value={formData.trainingReason}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'var(--text-white)' }}
                  >
                    <option value="Allmän hälsa">{language === 'en' ? 'General health & wellbeing' : 'Allmän hälsa & välbefinnande'}</option>
                    <option value="Tävling/Event">{language === 'en' ? 'Competition / Event' : 'Tävling / Specifikt event'}</option>
                    <option value="Rehabilitering">{language === 'en' ? 'Rehabilitation & mobility' : 'Rehabilitering & rörlighet'}</option>
                    <option value="Annat">{language === 'en' ? 'Something else' : 'Något annat'}</option>
                  </select>
                </div>

                {/* Experience level */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                    {language === 'en' ? 'How much workout experience do you have?' : 'Hur mycket träningserfarenhet har du?'}
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['Nybörjare', 'Medel', 'Avancerad'].map(exp => {
                      const isSelected = formData.experienceLevel === exp
                      return (
                        <button
                          key={exp}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, experienceLevel: exp }))}
                          style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '4px',
                            border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                            backgroundColor: isSelected ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                            color: isSelected ? 'var(--text-white)' : 'var(--text-silver)',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          {exp}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Past experience */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                    {language === 'en' ? 'Have you done strength/cardio training before? How long?' : 'Har du tränat styrketräning/kondition tidigare? Hur länge?'}
                  </label>
                  <input
                    type="text"
                    name="pastExperience"
                    value={formData.pastExperience}
                    onChange={handleChange}
                    placeholder={language === 'en' ? 'e.g., Yes, 2 years of gym, or No, never.' : 't.ex., Ja, kört på gym till och från i 2 år.'}
                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'var(--text-white)' }}
                  />
                </div>

                {/* Detailed Injury, Pain & Movement limitation question */}
                <div style={{ marginBottom: '20px', backgroundColor: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.12)', borderRadius: '6px', padding: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                    ⚠️ {language === 'en' ? 'Do you have any injuries, pain, or movement limitations I should know about?' : 'Har du några skador, smärtor eller rörelsebegränsningar jag bör känna till?'}
                  </label>
                  
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    {['Ja', 'Nej'].map(opt => {
                      const isSelected = formData.hasInjuries === opt
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, hasInjuries: opt }))}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: '4px',
                            border: isSelected ? '2px solid #ef4444' : '1px solid var(--border-glass)',
                            backgroundColor: isSelected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0,0,0,0.2)',
                            color: isSelected ? '#ef4444' : 'var(--text-silver)',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          {opt}
                        </button>
                      )
                    })}
                  </div>

                  {formData.hasInjuries === 'Ja' && (
                    <textarea
                      name="injuryDetails"
                      value={formData.injuryDetails}
                      onChange={handleChange}
                      placeholder={language === 'en' ? 'Describe your injuries, pain or limitations...' : 'Beskriv dina skador, smärtor eller rörlighetsbegränsningar här...'}
                      rows="3"
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', borderRadius: '4px', color: 'var(--text-white)', marginTop: '8px' }}
                      required
                    ></textarea>
                  )}
                </div>
              </div>

              {/* Ideal Weight Time Question */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                  {language === 'en' ? 'When was the last time you were your ideal weight?' : 'När var du senast i din idealvikt?'}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { id: '1year', label: language === 'en' ? 'Less than a year ago' : 'Mindre än ett år sedan' },
                    { id: '1-2years', label: language === 'en' ? '1-2 years ago' : '1-2 år sedan' },
                    { id: '3years', label: language === 'en' ? 'More than 3 years ago' : 'Mer än 3 år sedan' },
                    { id: 'never', label: language === 'en' ? 'Never' : 'Aldrig' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, idealWeightTime: item.label }))}
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--border-radius-sm)',
                        border: formData.idealWeightTime === item.label ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        backgroundColor: formData.idealWeightTime === item.label ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: formData.idealWeightTime === item.label ? 'var(--text-white)' : 'var(--text-silver)',
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight Gained 3 Years Question */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                  {language === 'en' ? 'Have you gained weight in the last 3 years?' : 'Har du gått upp i vikt de senaste 3 åren?'}
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['Ja', 'Nej'].map(opt => {
                    const isSelected = formData.weightGained3Years === opt
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, weightGained3Years: opt }))}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: 'var(--border-radius-sm)',
                          border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                          backgroundColor: isSelected ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                          color: isSelected ? 'var(--text-white)' : 'var(--text-silver)',
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        {opt === 'Ja' ? (language === 'en' ? 'Yes' : 'Ja') : (language === 'en' ? 'No' : 'Nej')}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Diets Tried Checklist */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                  {language === 'en' ? 'Have you tried any of these diets in the last 3 years?' : 'Har du provat någon av dessa dieter de senaste 3 åren?'}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { id: 'keto', label: 'Keto diet' },
                    { id: 'fasting', label: language === 'en' ? 'Intermittent fasting' : 'Periodisk fasta' },
                    { id: 'vegetarian', label: language === 'en' ? 'Vegetarian diet' : 'Vegetarisk kost' },
                    { id: 'vegan', label: language === 'en' ? 'Vegan diet' : 'Vegansk kost' },
                    { id: 'lowcarb', label: 'Low-carb diet' },
                    { id: 'mediterranean', label: language === 'en' ? 'Mediterranean diet' : 'Medelhavskost' },
                    { id: 'glutenfree', label: language === 'en' ? 'Gluten-free diet' : 'Glutenfri kost' },
                    { id: 'none', label: language === 'en' ? 'None of the above' : 'Inget av ovanstående' }
                  ].map(item => {
                    const isSelected = formData.triedDiets.includes(item.id)
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleTriedDietToggle(item.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 12px',
                          borderRadius: 'var(--border-radius-sm)',
                          border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                          backgroundColor: isSelected ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                          color: isSelected ? 'var(--text-white)' : 'var(--text-silver)',
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px', border: '1.5px solid var(--text-muted)', borderRadius: '4px', backgroundColor: isSelected ? 'var(--accent-gold)' : 'transparent', flexShrink: 0 }}>
                          {isSelected && <Check size={10} color="#000" style={{ strokeWidth: 3 }} />}
                        </span>
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Meal Prep Time Question */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                  {language === 'en' ? 'How much time do you want to spend on meal prep?' : 'Hur mycket tid vill du lägga på matlagning?'}
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: '30m', label: language === 'en' ? 'Up to 30 minutes' : 'Upp till 30 minuter' },
                    { id: '1h', label: language === 'en' ? 'Up to 1 hour' : 'Upp till 1 timme' },
                    { id: '1h+', label: language === 'en' ? 'More than 1 hour' : 'Mer än 1 timme' },
                    { id: 'busy', label: language === 'en' ? "I'm too busy to cook" : 'Jag har för mycket att göra för att laga mat' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, mealPrepTime: item.label }))}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--border-radius-sm)',
                        border: formData.mealPrepTime === item.label ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        backgroundColor: formData.mealPrepTime === item.label ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: formData.mealPrepTime === item.label ? 'var(--text-white)' : 'var(--text-silver)',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Success weight loss curve visual card */}
              <div 
                className="glass-panel" 
                style={{ 
                  padding: '20px', 
                  borderRadius: 'var(--border-radius-md)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)', 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                  marginBottom: '28px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                }}
              >
                <h4 style={{ color: 'var(--text-white)', margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 'bold' }}>
                  {language === 'en' ? 'The last plan you\'ll ever need to lose weight' : 'Den sista planen du behöver för att gå ner i vikt'}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.4' }}>
                  {language === 'en' 
                    ? 'Lose weight within the first weeks and enjoy lasting results.' 
                    : 'Gå ner i vikt under de första veckorna och behåll resultaten livet ut.'}
                </p>
                
                {/* SVG Curve illustration similar to screenshot */}
                <div style={{ position: 'relative', height: '120px', width: '100%', background: 'rgba(0,0,0,0.15)', borderRadius: '6px', overflow: 'hidden', padding: '10px' }}>
                  <svg viewBox="0 0 400 100" style={{ width: '100%', height: '100%', display: 'block' }}>
                    {/* Gridlines */}
                    <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    
                    {/* Other programs curve (Jojo) */}
                    <path 
                      d="M 10,10 C 80,10 120,95 180,60 C 240,25 280,90 390,45" 
                      fill="none" 
                      stroke="#ef4444" 
                      strokeWidth="2.5" 
                      strokeDasharray="1"
                    />
                    
                    {/* Muscle & Focus curve (Sustainable) */}
                    <path 
                      d="M 10,10 C 80,10 160,80 230,82 C 300,83 340,84 390,85" 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="3.5"
                    />
                    
                    {/* Dots / labels on curve */}
                    <circle cx="230" cy="62" r="4" fill="#ef4444" />
                    <circle cx="230" cy="82" r="4" fill="#10b981" />
                  </svg>
                  
                  {/* Overlay labels */}
                  <span style={{ position: 'absolute', top: '18px', left: '160px', fontSize: '0.62rem', background: '#222', padding: '2px 5px', borderRadius: '3px', color: 'var(--text-silver)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {language === 'en' ? 'Other programs' : 'Andra dieter'}
                  </span>
                  <span style={{ position: 'absolute', bottom: '38px', left: '215px', fontSize: '0.62rem', background: '#10b981', padding: '2px 5px', borderRadius: '3px', color: '#000', fontWeight: 'bold' }}>
                    with Muscle & Focus
                  </span>
                  
                  <span style={{ position: 'absolute', bottom: '4px', left: '10px', fontSize: '0.58rem', color: 'var(--text-muted)' }}>Today</span>
                  <span style={{ position: 'absolute', bottom: '4px', right: '10px', fontSize: '0.58rem', color: 'var(--text-muted)' }}>Lasting results</span>
                </div>
              </div>

              {/* Breakfast Time Question */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                  {language === 'en' ? 'When do you usually have breakfast?' : 'När brukar du äta frukost?'}
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: '6-8', label: language === 'en' ? 'Between 6 and 8 am' : 'Mellan 06:00 och 08:00' },
                    { id: '8-10', label: language === 'en' ? 'Between 8 and 10 am' : 'Mellan 08:00 och 10:00' },
                    { id: '10-12', label: language === 'en' ? 'Between 10 am and noon' : 'Mellan 10:00 och 12:00' },
                    { id: 'skip', label: language === 'en' ? 'I usually skip breakfast' : 'Jag brukar hoppa över frukost' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, breakfastTime: item.label }))}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--border-radius-sm)',
                        border: formData.breakfastTime === item.label ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        backgroundColor: formData.breakfastTime === item.label ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: formData.breakfastTime === item.label ? 'var(--text-white)' : 'var(--text-silver)',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lunch Time Question */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                  {language === 'en' ? 'How about lunch?' : 'När brukar du äta lunch?'}
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: '10-12', label: language === 'en' ? 'Between 10 am and noon' : 'Mellan 10:00 och 12:00' },
                    { id: '12-2', label: language === 'en' ? 'Between noon and 2 pm' : 'Mellan 12:00 och 14:00' },
                    { id: '2-4', label: language === 'en' ? 'Between 2 and 4 pm' : 'Mellan 14:00 och 16:00' },
                    { id: 'skip', label: language === 'en' ? 'I usually skip lunch' : 'Jag brukar hoppa över lunch' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, lunchTime: item.label }))}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--border-radius-sm)',
                        border: formData.lunchTime === item.label ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        backgroundColor: formData.lunchTime === item.label ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: formData.lunchTime === item.label ? 'var(--text-white)' : 'var(--text-silver)',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dinner Time Question */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                  {language === 'en' ? 'What time do you have dinner?' : 'Vilken tid brukar du äta middag?'}
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: '4-6', label: language === 'en' ? 'Between 4 and 6 pm' : 'Mellan 16:00 och 18:00' },
                    { id: '6-8', label: language === 'en' ? 'Between 6 and 8 pm' : 'Mellan 18:00 och 20:00' },
                    { id: '8-10', label: language === 'en' ? 'Between 8 and 10 pm' : 'Mellan 20:00 och 22:00' },
                    { id: 'skip', label: language === 'en' ? 'I usually skip dinner' : 'Jag brukar hoppa över middag' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, dinnerTime: item.label }))}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--border-radius-sm)',
                        border: formData.dinnerTime === item.label ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        backgroundColor: formData.dinnerTime === item.label ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: formData.dinnerTime === item.label ? 'var(--text-white)' : 'var(--text-silver)',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meat Relationship Question */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                  {language === 'en' ? "What's your relationship with meat?" : 'Vad är din relation till kött?'}
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: 'love', label: language === 'en' ? 'I love it' : 'Jag älskar det' },
                    { id: 'rarely', label: language === 'en' ? 'I rarely eat it' : 'Jag äter det sällan' },
                    { id: 'never', label: language === 'en' ? "I don't eat it" : 'Jag äter det inte alls' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, meatRelation: item.label }))}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--border-radius-sm)',
                        border: formData.meatRelation === item.label ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        backgroundColor: formData.meatRelation === item.label ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: formData.meatRelation === item.label ? 'var(--text-white)' : 'var(--text-silver)',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pork, Beef, Chicken, Turkey, Lamb, Duck Preferences */}
              {formData.meatRelation !== 'Jag äter det inte alls' && formData.meatRelation !== "I don't eat it" && (
                <div className="fade-in">
                  <label style={{ display: 'block', fontSize: '1rem', color: 'var(--text-white)', marginBottom: '14px', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '6px' }}>
                    {language === 'en' ? 'Love it or Hate it: Protein Options' : 'Gillar eller ogillar du dessa proteinkällor?'}
                  </label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-8px', marginBottom: '16px' }}>
                    {language === 'en' ? 'If you don\'t know, go for Neutral.' : 'Om du är osäker, välj Neutral.'}
                  </p>

                  {[
                    { id: 'porkRelation', label: language === 'en' ? 'Pork' : 'Fläskkött', emoji: '🥓' },
                    { id: 'beefRelation', label: language === 'en' ? 'Beef' : 'Nötkött', emoji: '🥩' },
                    { id: 'chickenRelation', label: language === 'en' ? 'Chicken' : 'Kyckling', emoji: '🍗' },
                    { id: 'turkeyRelation', label: language === 'en' ? 'Turkey' : 'Kalkon', emoji: '🦃' },
                    { id: 'lambRelation', label: language === 'en' ? 'Lamb' : 'Lammkött', emoji: '🍖' },
                    { id: 'duckRelation', label: language === 'en' ? 'Duck' : 'Anka', emoji: '🦆' }
                  ].map(meat => (
                    <div 
                      key={meat.id} 
                      className="glass-panel" 
                      style={{ 
                        padding: '12px 14px', 
                        borderRadius: 'var(--border-radius-sm)', 
                        marginBottom: '14px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '8px',
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid rgba(255,255,255,0.04)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: 'var(--text-white)', fontSize: '0.92rem' }}>
                        <span>{meat.emoji}</span>
                        <span>{meat.label}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        {[
                          { id: 'hate', label: language === 'en' ? 'Hate' : 'Ogillar', color: 'rgba(239, 68, 68, 0.15)', activeBorder: '2px solid #ef4444', activeColor: '#ef4444' },
                          { id: 'neutral', label: language === 'en' ? 'Neutral' : 'Neutral', color: 'rgba(255, 255, 255, 0.05)', activeBorder: '2px solid var(--text-muted)', activeColor: 'var(--text-white)' },
                          { id: 'love', label: language === 'en' ? 'Love' : 'Älskar', color: 'rgba(16, 185, 129, 0.15)', activeBorder: '2px solid #10b981', activeColor: '#10b981' }
                        ].map(opt => {
                          const isSelected = formData[meat.id] === opt.label
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, [meat.id]: opt.label }))}
                              style={{
                                flex: 1,
                                padding: '8px',
                                borderRadius: '4px',
                                border: isSelected ? opt.activeBorder : '1px solid var(--border-glass)',
                                backgroundColor: isSelected ? opt.color : 'rgba(0,0,0,0.15)',
                                color: isSelected ? opt.activeColor : 'var(--text-silver)',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                fontWeight: '600'
                              }}
                            >
                              {opt.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Success weight loss curve visual card */}
              <div 
                className="glass-panel" 
                style={{ 
                  padding: '20px', 
                  borderRadius: 'var(--border-radius-md)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)', 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                  marginBottom: '28px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                }}
              >
                <h4 style={{ color: 'var(--text-white)', margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 'bold' }}>
                  {language === 'en' ? 'The last plan you\'ll ever need to lose weight' : 'Den sista planen du behöver för att gå ner i vikt'}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.4' }}>
                  {language === 'en' 
                    ? 'Lose weight within the first weeks and enjoy lasting results.' 
                    : 'Gå ner i vikt under de första veckorna och behåll resultaten livet ut.'}
                </p>
                
                {/* SVG Curve illustration similar to screenshot */}
                <div style={{ position: 'relative', height: '120px', width: '100%', background: 'rgba(0,0,0,0.15)', borderRadius: '6px', overflow: 'hidden', padding: '10px' }}>
                  <svg viewBox="0 0 400 100" style={{ width: '100%', height: '100%', display: 'block' }}>
                    {/* Gridlines */}
                    <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    
                    {/* Other programs curve (Jojo) */}
                    <path 
                      d="M 10,10 C 80,10 120,95 180,60 C 240,25 280,90 390,45" 
                      fill="none" 
                      stroke="#ef4444" 
                      strokeWidth="2.5" 
                      strokeDasharray="1"
                    />
                    
                    {/* Muscle & Focus curve (Sustainable) */}
                    <path 
                      d="M 10,10 C 80,10 160,80 230,82 C 300,83 340,84 390,85" 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="3.5"
                    />
                    
                    {/* Dots / labels on curve */}
                    <circle cx="230" cy="62" r="4" fill="#ef4444" />
                    <circle cx="230" cy="82" r="4" fill="#10b981" />
                  </svg>
                  
                  {/* Overlay labels */}
                  <span style={{ position: 'absolute', top: '18px', left: '160px', fontSize: '0.62rem', background: '#222', padding: '2px 5px', borderRadius: '3px', color: 'var(--text-silver)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {language === 'en' ? 'Other programs' : 'Andra dieter'}
                  </span>
                  <span style={{ position: 'absolute', bottom: '38px', left: '215px', fontSize: '0.62rem', background: '#10b981', padding: '2px 5px', borderRadius: '3px', color: '#000', fontWeight: 'bold' }}>
                    with Muscle & Focus
                  </span>
                  
                  <span style={{ position: 'absolute', bottom: '4px', left: '10px', fontSize: '0.58rem', color: 'var(--text-muted)' }}>Today</span>
                  <span style={{ position: 'absolute', bottom: '4px', right: '10px', fontSize: '0.58rem', color: 'var(--text-muted)' }}>Lasting results</span>
                </div>
              </div>

              {/* Eat Fish Question */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                  {language === 'en' ? 'Do you eat fish?' : 'Äter du fisk?'}
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: 'yes', label: language === 'en' ? 'Yes' : 'Ja' },
                    { id: 'sometimes', label: language === 'en' ? 'Sometimes' : 'Ibland' },
                    { id: 'no', label: language === 'en' ? 'No' : 'Nej' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, eatFish: item.label }))}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--border-radius-sm)',
                        border: formData.eatFish === item.label ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        backgroundColor: formData.eatFish === item.label ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: formData.eatFish === item.label ? 'var(--text-white)' : 'var(--text-silver)',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Reason to Get in Shape Question */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                  {language === 'en' ? 'What\'s the main reason why you want to get in shape?' : 'Vad är din huvudanledning att du vill komma i form?'}
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: 'confidence', label: language === 'en' ? 'Feel more confident in my body' : 'Känna mig mer självsäker i min kropp' },
                    { id: 'attractive', label: language === 'en' ? 'Become more attractive' : 'Bli mer attraktiv' },
                    { id: 'healthy', label: language === 'en' ? 'Feel healthier and more energetic' : 'Känna mig hälsosammare och piggare' },
                    { id: 'mental', label: language === 'en' ? 'Improve my mental health' : 'Förbättra min mentala hälsa' },
                    { id: 'clothes', label: language === 'en' ? 'Fit in my clothes better' : 'Sitta bättre i mina kläder' },
                    { id: 'other', label: language === 'en' ? 'Other' : 'Annat' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, mainGoalReason: item.label }))}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--border-radius-sm)',
                        border: formData.mainGoalReason === item.label ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        backgroundColor: formData.mainGoalReason === item.label ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: formData.mainGoalReason === item.label ? 'var(--text-white)' : 'var(--text-silver)',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Occasion Question */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                  {language === 'en' ? 'Is there a special occasion you want to lose weight for?' : 'Finns det ett speciellt tillfälle du vill komma i form för?'}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { id: 'vacation', label: language === 'en' ? 'Vacation' : 'Semester', emoji: '✈️' },
                    { id: 'wedding', label: language === 'en' ? 'Wedding' : 'Bröllop', emoji: '💍' },
                    { id: 'beach', label: language === 'en' ? 'Beach trip' : 'Strandresa', emoji: '🌴' },
                    { id: 'anniversary', label: language === 'en' ? 'Anniversary' : 'Årsdag', emoji: '🫶' },
                    { id: 'birthday', label: language === 'en' ? 'Birthday' : 'Födelsedag', emoji: '🎉' },
                    { id: 'family', label: language === 'en' ? 'Family occasion' : 'Familjehögtid', emoji: '🏠' },
                    { id: 'sport', label: language === 'en' ? 'Sporting event' : 'Sportevenemang', emoji: '🥇' },
                    { id: 'other', label: language === 'en' ? 'Other' : 'Annat', emoji: '👆' },
                    { id: 'no', label: language === 'en' ? 'No' : 'Nej', emoji: '🚫' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, specialOccasion: item.label }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: 'var(--border-radius-sm)',
                        border: formData.specialOccasion === item.label ? '2px solid var(--accent-gold)' : '1px solid var(--border-glass)',
                        backgroundColor: formData.specialOccasion === item.label ? 'rgba(184, 149, 71, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: formData.specialOccasion === item.label ? 'var(--text-white)' : 'var(--text-silver)',
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{item.label}</span>
                      <span>{item.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Date Question (only shown if specialOccasion is selected and is not No/Nej) */}
              {formData.specialOccasion && formData.specialOccasion !== 'Nej' && formData.specialOccasion !== 'No' && (
                <div className="fade-in" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: '600' }}>
                    {language === 'en' ? 'When is your event?' : 'När är ditt evenemang?'}
                  </label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.4' }}>
                    {language === 'en' 
                      ? 'We\'ll tailor your plan to help you get in shape and feel your best for the special occasion!' 
                      : 'Vi anpassar din plan för att hjälpa dig komma i form och känna dig på topp inför det speciella tillfället!'}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      style={{ 
                        background: 'rgba(0,0,0,0.2)', 
                        border: '1px solid var(--border-glass)', 
                        padding: '12px', 
                        color: 'var(--text-white)',
                        borderRadius: 'var(--border-radius-sm)',
                        fontSize: '0.9rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, eventDate: 'Skipped' }))}
                      style={{
                        padding: '10px',
                        background: 'none',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#ef4444',
                        borderRadius: 'var(--border-radius-sm)',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      {language === 'en' ? 'Skip this question' : 'Hoppa över denna fråga'}
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Weight Prediction Timeline Card (Shown if height and current weight + target weight exist) */}
              {formData.weight && formData.targetWeight && (
                <div 
                  className="glass-panel fade-in" 
                  style={{ 
                    padding: '20px', 
                    borderRadius: 'var(--border-radius-md)', 
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    marginBottom: '24px',
                    background: 'rgba(255,255,255,0.01)'
                  }}
                >
                  {(() => {
                    const currentW = parseFloat(formData.weight)
                    const targetW = parseFloat(formData.targetWeight)
                    const weightDiff = currentW - targetW
                    
                    // Predict date: assume a healthy, sustainable loss of 0.75 kg per week
                    const weeksNeeded = Math.max(Math.ceil(weightDiff / 0.75), 1)
                    const targetDateObj = new Date()
                    targetDateObj.setDate(targetDateObj.getDate() + (weeksNeeded * 7))
                    
                    // Formatter
                    const options = { month: 'short', day: 'numeric', year: 'numeric' }
                    const formattedPredictDate = targetDateObj.toLocaleDateString(language === 'en' ? 'en-US' : 'sv-SE', options)
                    const formattedToday = new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'sv-SE', { month: 'short', day: 'numeric' })
                    
                    const occasionText = formData.specialOccasion && formData.specialOccasion !== 'Nej' && formData.specialOccasion !== 'No'
                      ? ` ${language === 'en' ? 'before your' : 'innan din'} ${formData.specialOccasion.toLowerCase()}`
                      : ''

                    return (
                      <>
                        <h4 style={{ color: 'var(--text-white)', fontSize: '1.15rem', fontWeight: 'bold', margin: '0 0 4px 0', textAlign: 'center', lineHeight: '1.4' }}>
                          {language === 'en' ? 'We predict that you\'ll weigh ' : 'Vi förutspår att du kommer att väga '}
                          <span style={{ color: 'var(--accent-gold)' }}>{targetW} kg</span>
                          {language === 'en' ? ' by ' : ' till '}
                          <span style={{ color: 'var(--accent-gold)' }}>{formattedPredictDate}!</span>
                        </h4>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', margin: '0 0 20px 0' }}>
                          {language === 'en' ? 'achieving your goal' : 'når ditt mål'}{occasionText}
                        </p>

                        {/* Line Chart prediction SVG */}
                        <div style={{ position: 'relative', height: '140px', width: '100%', background: 'rgba(0,0,0,0.15)', borderRadius: '6px', overflow: 'hidden', padding: '10px 10px 24px 10px', marginBottom: '16px' }}>
                          <svg viewBox="0 0 400 100" style={{ width: '100%', height: '100%', display: 'block' }}>
                            {/* Horizontal gridlines */}
                            <line x1="0" y1="10" x2="400" y2="10" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                            <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                            <line x1="0" y1="90" x2="400" y2="90" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                            
                            {/* Gradient Area under curve */}
                            <defs>
                              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.15" />
                                <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            
                            <path 
                              d="M 10,10 Q 150,15 250,60 T 380,90 L 380,100 L 10,100 Z" 
                              fill="url(#chartGrad)"
                            />

                            {/* Weight Curve */}
                            <path 
                              d="M 10,10 Q 150,15 250,60 T 380,90" 
                              fill="none" 
                              stroke="var(--accent-gold)" 
                              strokeWidth="3"
                            />

                            {/* Goal node label */}
                            <circle cx="380" cy="90" r="5" fill="var(--accent-gold)" />
                            
                            <text x="10" y="102" fill="var(--text-muted)" fontSize="8" fontFamily="inherit">{formattedToday}</text>
                            <text x="340" y="102" fill="var(--text-muted)" fontSize="8" fontFamily="inherit">{formattedPredictDate}</text>
                          </svg>

                          {/* Event marker box */}
                          {formData.eventDate && formData.eventDate !== 'Skipped' && (
                            <div style={{ position: 'absolute', top: '15px', right: '80px', fontSize: '0.62rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-silver)' }}>
                              📅 {formData.specialOccasion || 'Event'}
                            </div>
                          )}

                          {/* Goal flag badge */}
                          <div style={{ position: 'absolute', bottom: '26px', right: '14px', backgroundColor: '#10b981', color: '#000', fontWeight: 'bold', padding: '2px 6px', borderRadius: '3px', fontSize: '0.65rem' }}>
                            Goal: {targetW} kg
                          </div>
                        </div>

                        {/* Good news alert box */}
                        <div 
                          style={{ 
                            padding: '10px 14px', 
                            borderRadius: '6px', 
                            backgroundColor: 'rgba(16, 185, 129, 0.08)', 
                            border: '1px solid rgba(16, 185, 129, 0.15)',
                            color: '#10b981',
                            fontSize: '0.78rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <span>🙌</span>
                          <span>
                            {language === 'en' 
                              ? `Good news! Based on similar users, we predict that you'll achieve your goal weight of ${targetW} kg before ${formattedPredictDate}.` 
                              : `Goda nyheter! Baserat på liknande användare förutspår vi att du kommer att nå din målvikt på ${targetW} kg innan ${formattedPredictDate}.`}
                          </span>
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}

              {/* Based on your food preferences card */}
              <div 
                className="glass-panel" 
                style={{ 
                  padding: '24px', 
                  borderRadius: 'var(--border-radius-md)', 
                  border: '1px solid rgba(255, 255, 255, 0.06)', 
                  background: 'rgba(255,255,255,0.01)',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}
              >
                <h4 style={{ color: 'var(--text-white)', margin: '0 0 16px 0', fontSize: '1.05rem', fontWeight: 'bold' }}>
                  {language === 'en' ? 'Based on your food preferences, we\'ve created' : 'Baserat på dina kostpreferenser har vi skapat'}
                </h4>
                <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--accent-gold)', margin: '10px 0', textShadow: '0 0 20px rgba(184, 149, 71, 0.3)' }}>
                  500+
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-white)', fontWeight: 'bold', margin: '0 0 6px 0' }}>
                  {language === 'en' ? 'Meal combinations' : 'Måltidskombinationer'}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-silver)', margin: 0, lineHeight: '1.4' }}>
                  {language === 'en' 
                    ? 'that are the perfect fit for you and will help you lose weight in the most enjoyable way!' 
                    : 'som passar dig perfekt och kommer hjälpa dig att nå dina mål på det mest njutbara sättet!'}
                </p>
              </div>

              {/* Success weight loss curve visual card */}
              <div 
                className="glass-panel" 
                style={{ 
                  padding: '20px', 
                  borderRadius: 'var(--border-radius-md)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)', 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                  marginBottom: '28px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                }}
              >
                <h4 style={{ color: 'var(--text-white)', margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 'bold' }}>
                  {language === 'en' ? 'The last plan you\'ll ever need to lose weight' : 'Den sista planen du behöver för att gå ner i vikt'}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.4' }}>
                  {language === 'en' 
                    ? 'Lose weight within the first weeks and enjoy lasting results.' 
                    : 'Gå ner i vikt under de första veckorna och behåll resultaten livet ut.'}
                </p>
                
                {/* SVG Curve illustration similar to screenshot */}
                <div style={{ position: 'relative', height: '120px', width: '100%', background: 'rgba(0,0,0,0.15)', borderRadius: '6px', overflow: 'hidden', padding: '10px' }}>
                  <svg viewBox="0 0 400 100" style={{ width: '100%', height: '100%', display: 'block' }}>
                    {/* Gridlines */}
                    <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    
                    {/* Other programs curve (Jojo) */}
                    <path 
                      d="M 10,10 C 80,10 120,95 180,60 C 240,25 280,90 390,45" 
                      fill="none" 
                      stroke="#ef4444" 
                      strokeWidth="2.5" 
                      strokeDasharray="1"
                    />
                    
                    {/* Muscle & Focus curve (Sustainable) */}
                    <path 
                      d="M 10,10 C 80,10 160,80 230,82 C 300,83 340,84 390,85" 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="3.5"
                    />
                    
                    {/* Dots / labels on curve */}
                    <circle cx="230" cy="62" r="4" fill="#ef4444" />
                    <circle cx="230" cy="82" r="4" fill="#10b981" />
                  </svg>
                  
                  {/* Overlay labels */}
                  <span style={{ position: 'absolute', top: '18px', left: '160px', fontSize: '0.62rem', background: '#222', padding: '2px 5px', borderRadius: '3px', color: 'var(--text-silver)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {language === 'en' ? 'Other programs' : 'Andra dieter'}
                  </span>
                  <span style={{ position: 'absolute', bottom: '38px', left: '215px', fontSize: '0.62rem', background: '#10b981', padding: '2px 5px', borderRadius: '3px', color: '#000', fontWeight: 'bold' }}>
                    with Muscle & Focus
                  </span>
                  
                  <span style={{ position: 'absolute', bottom: '4px', left: '10px', fontSize: '0.58rem', color: 'var(--text-muted)' }}>Today</span>
                  <span style={{ position: 'absolute', bottom: '4px', right: '10px', fontSize: '0.58rem', color: 'var(--text-muted)' }}>Lasting results</span>
                </div>
              </div>

              {/* Allmänna villkor Contract Text */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '1rem', color: 'var(--text-white)', marginBottom: '8px', fontWeight: 'bold' }}>
                  {language === 'en' ? 'General Terms and Conditions' : 'Allmänna villkor'}
                </label>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-silver)', marginBottom: '10px' }}>
                  {language === 'en' 
                    ? 'Please review the agreement below. You must accept these terms and sign digitally to activate your free trial.' 
                    : 'Vänligen läs igenom avtalet nedan. Du måste godkänna villkoren och signera digitalt för att aktivera din gratisperiod.'}
                </p>

                {/* Scrollable Terms Container */}
                <div 
                  style={{ 
                    maxHeight: '180px', 
                    overflowY: 'scroll', 
                    background: 'rgba(0,0,0,0.3)', 
                    border: '1px solid var(--border-glass)', 
                    padding: '15px', 
                    borderRadius: 'var(--border-radius-sm)', 
                    fontSize: '0.8rem', 
                    color: 'var(--text-silver)', 
                    lineHeight: '1.5',
                    textAlign: 'left',
                    marginBottom: '15px'
                  }}
                >
                  <h4 style={{ color: 'var(--text-white)', marginTop: 0, fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '4px' }}>
                    ALLMÄNNA VILLKOR - GRATIS PROVPERIOD
                  </h4>
                  <p><strong>Gratis 2-veckors provperiod – Personlig träning</strong></p>
                  
                  <p><strong>1. Deltagande och ålder</strong></p>
                  <ul>
                    <li>Kunden måste vara fyllda minst 16 år för att delta i provperioden och i den personliga träningen.</li>
                    <li>Är kunden under 18 år kan skriftligt godkännande från vårdnadshavare krävas innan träningen påbörjas.</li>
                    <li>Genom att registrera sig för provperioden bekräftar kunden att ovanstående åldersvillkor är uppfyllt.</li>
                  </ul>

                  <p><strong>2. Vad ingår i provperioden</strong></p>
                  <p>Under den kostnadsfria 2-veckorsperioden ingår:</p>
                  <ul>
                    <li>Ett personligt anpassat träningsprogram.</li>
                    <li>Ett personligt kostschema.</li>
                    <li>Tillgång till träningsprogrammet och kostschemat digitalt under hela testperioden.</li>
                    <li>Löpande kontakt med din personliga tränare för frågor och stöttning.</li>
                  </ul>
                  <p>Exakt antal ingående pass, uppföljningstillfällen och kommunikationskanaler specificeras separat vid uppstart.</p>

                  <p><strong>3. Vad händer efter provperioden</strong></p>
                  <ul>
                    <li>Provperioden på 2 veckor upphör automatiskt när perioden löper ut.</li>
                    <li>Ingen automatisk övergång till betalabonnemang sker – kunden behöver aktivt teckna ett abonnemang om hen vill fortsätta.</li>
                    <li>Ingen dold avgift eller extra kostnad tillkommer i samband med att provperioden avslutas.</li>
                    <li>Kunden behöver inte säga upp något eller vidta någon åtgärd för att undvika debitering – utan aktivt val upphör samarbetet helt kostnadsfritt.</li>
                  </ul>

                  <p><strong>4. Hälsa, kost och specialbehov</strong></p>
                  <ul>
                    <li>Kunden intygar att hen är vid god hälsa och inte har skador eller medicinska tillstånd som gör träningen olämplig, samt informerar tränaren om eventuella hälsoproblem innan träningen påbörjas.</li>
                    <li>Om kunden har allergi eller överkänslighet mot viss mat måste detta meddelas tränaren innan kostschemat upprättas.</li>
                    <li>Om kunden inte äter kött erbjuds ett vegetariskt kostschema som anpassas efter kundens önskemål och behov.</li>
                    <li>Det är kundens ansvar att informera tränaren om ändrade förutsättningar under provperiodens gång.</li>
                  </ul>

                  <p><strong>5. Ansvar och ansvarsfriskrivning</strong></p>
                  <p>Träningsprogrammet och kostschemat är framtagna för att följas i sin helhet. Tränaren/företaget ansvarar inte för skador eller hälsoproblem som uppstår om kunden inte följer programmen eller tränar felaktigt. Träning sker på eget ansvar.</p>

                  <p><strong>6. Immaterialrätt och konfidentialitet</strong></p>
                  <ul>
                    <li>Samtliga tränings- och kostprogram är upphovsrättsligt skyddade och tillhör tränaren/företaget.</li>
                    <li>Programmen är endast avsedda för kundens personliga bruk och får inte spridas till tredje part.</li>
                  </ul>

                  <p><strong>7. Personuppgifter (GDPR)</strong></p>
                  <p>Personuppgifter och hälsorelaterad information behandlas i enlighet med gällande dataskyddslagstiftning (GDPR) endast för kommunikation och anpassning av träningsprogrammen.</p>

                  <p><strong>8. Ändringar av villkoren</strong></p>
                  <p>Tränaren förbehåller sig rätten att uppdatera dessa villkor. Eventuella ändringar meddelas kunden i god tid.</p>

                  <p><strong>9. Tillämplig lag</strong></p>
                  <p>Dessa villkor regleras av svensk lag. Tvist löses i första hand genom dialog.</p>
                </div>

                {/* Consent Checkbox */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '20px' }}>
                  <input
                    type="checkbox"
                    id="agreementConfirmed"
                    checked={formData.agreementConfirmed}
                    onChange={(e) => setFormData(prev => ({ ...prev, agreementConfirmed: e.target.checked }))}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-gold)', marginTop: '2px' }}
                  />
                  <label htmlFor="agreementConfirmed" style={{ fontSize: '0.85rem', color: 'var(--text-white)', cursor: 'pointer', userSelect: 'none', lineHeight: '1.4' }}>
                    {language === 'en' 
                      ? 'I hereby confirm that I am at least 16 years old, have read and fully accept the General Terms and Conditions.' 
                      : 'Jag bekräftar härmed att jag är minst 16 år gammal, har tagit del av och godkänner de allmänna villkoren.'}
                  </label>
                </div>

                {/* Digital Signature Drawing Canvas Pad */}
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-white)', marginBottom: '6px', fontWeight: '600' }}>
                    {language === 'en' ? 'Digital Signature:' : 'Digital underskrift:'}
                  </label>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    {language === 'en' ? 'Draw your signature inside the box below:' : 'Rita din namnteckning med muspekaren eller fingret i rutan nedan:'}
                  </p>
                  
                  <div style={{ position: 'relative', width: '100%', maxWidth: '400px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '6px', border: '1px dashed var(--border-glass)', padding: '5px' }}>
                    <canvas
                      ref={canvasRef}
                      width={388}
                      height={120}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      style={{
                        display: 'block',
                        width: '100%',
                        height: '120px',
                        cursor: 'crosshair',
                        touchAction: 'none'
                      }}
                    />
                    
                    {formData.signature && (
                      <span style={{ position: 'absolute', bottom: '8px', left: '12px', fontSize: '0.62rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        ✓ {language === 'en' ? 'Signed' : 'Signerad'}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={clearSignature}
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        padding: '3px 8px',
                        fontSize: '0.68rem',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--border-glass)',
                        color: 'var(--text-silver)',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {language === 'en' ? 'Clear' : 'Rensa'}
                    </button>
                  </div>
                </div>

              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '10px' }}>
                <button type="button" onClick={() => setFormStep(3)} style={{ background: 'none', border: 'none', color: 'var(--text-silver)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowLeft size={16} /> {language === 'en' ? 'Back' : 'Bakåt'}
                </button>
                <button 
                  type="button" 
                  onClick={(e) => handleFormSubmit(e, false)} 
                  className="btn-primary" 
                  disabled={
                    loading || 
                    !formData.sleepHours || 
                    !formData.waterDaily || 
                    !formData.energyLevels || 
                    formData.habits.length === 0 ||
                    !formData.typicalDay ||
                    !formData.weightChange ||
                    !formData.exerciseFrequency ||
                    !formData.idealWeightTime ||
                    !formData.weightGained3Years ||
                    formData.triedDiets.length === 0 ||
                    !formData.mealPrepTime ||
                    !formData.breakfastTime ||
                    !formData.lunchTime ||
                    !formData.dinnerTime ||
                    !formData.meatRelation ||
                    !formData.eatFish ||
                    !formData.mainGoalReason ||
                    !formData.specialOccasion ||
                    !formData.agreementConfirmed ||
                    !formData.signature ||
                    ((formData.meatRelation !== 'Jag äter det inte alls' && formData.meatRelation !== "I don't eat it") && (
                      !formData.porkRelation ||
                      !formData.beefRelation ||
                      !formData.chickenRelation ||
                      !formData.turkeyRelation ||
                      !formData.lambRelation ||
                      !formData.duckRelation
                    ))
                  }
                  style={{ padding: '12px 32px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Send size={14} />
                  <span>{loading ? t('applyBtnSending') : t('applyBtnSubmit')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Apply
