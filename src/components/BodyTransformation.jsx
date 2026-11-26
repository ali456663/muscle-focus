import { useId } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import './BodyTransformation.css'

/*
 * "Nu vs Mål" – visar kundens nuvarande kropp och målkroppen sida vid sida.
 * Figurerna ritas som SVG utifrån kön, vald kroppstyp och BMI, så varje kund
 * får en egen bild. Figurerna är neutrala skyltdockor (ingen hudfärg) och är
 * en illustration – inte ett löfte om exakt resultat.
 *
 * Används i ansökan (gratis provperiod, sista steget) och under "Mina uppgifter".
 */

// ───────────────────────── Text ─────────────────────────
const TEXT = {
  sv: {
    title: 'Min drömkropp',
    intro: 'Så här ser vägen ut från din kropp i dag till målet du valt. De första 14 dagarna lägger grunden.',
    now: 'Nu',
    goal: 'Mål',
    weight: 'Vikt',
    bmi: 'BMI',
    change: 'Förändring',
    time: 'Beräknad tid',
    weeks: (n) => `ca ${n} veckor`,
    keep: 'Behåll vikten',
    benefitsTitle: 'Det här bygger vi mot',
    planTitle: 'Dina 14 gratis dagar',
    plan: [
      ['Dag 1–3', 'Startmöte, mätningar och ditt personliga tränings- och kostschema.'],
      ['Dag 4–10', 'Du tränar efter programmet och vi justerar efter din återkoppling.'],
      ['Dag 11–14', 'Uppföljning: vad har förändrats och hur ser vägen ut mot målet?'],
    ],
    tip: 'Tips: mät midjan samma tid varje vecka – den visar förändringen tidigare än vågen.',
    disclaimer: 'Bilden är en illustration baserad på dina uppgifter, inte ett löfte om exakt resultat. Hur snabbt kroppen förändras beror på träning, kost, sömn och hälsa.',
    missing: 'Fyll i längd, vikt och kroppstyp i provperiodsformuläret så visar vi din personliga kroppsresa här.',
    figureAlt: (label, type) => `Illustration: ${label.toLowerCase()} – ${type}`,
    current: { skinny: 'Smal', regular: 'Normal', pot_belly: 'Lite mage', extra: 'Kraftig' },
    desired: { smaller: 'Mindre storlek', lean: 'Hård & deffad', athletic: 'Atletisk & stark', shredded: 'Muskulös & rippad' },
    benefits: {
      smaller: ['Lägre vikt och mindre midjemått', 'Mer energi i vardagen', 'Kläderna sitter bättre'],
      lean: ['Lägre fettprocent', 'Synlig muskeldefinition', 'Fastare och spänstigare kropp'],
      athletic: ['Starkare och bredare överkropp', 'Bättre kondition och hållning', 'Balanserad, funktionell styrka'],
      shredded: ['Maximal muskeldefinition', 'Låg fettprocent', 'Tydliga magmuskler och axlar'],
    },
  },
  en: {
    title: 'My dream body',
    intro: 'This is the path from your body today to the goal you chose. The first 14 days lay the foundation.',
    now: 'Now',
    goal: 'Goal',
    weight: 'Weight',
    bmi: 'BMI',
    change: 'Change',
    time: 'Estimated time',
    weeks: (n) => `about ${n} weeks`,
    keep: 'Maintain weight',
    benefitsTitle: 'What we are building towards',
    planTitle: 'Your 14 free days',
    plan: [
      ['Day 1–3', 'Kick-off, measurements and your personal training and nutrition plan.'],
      ['Day 4–10', 'You train with the program and we adjust it based on your feedback.'],
      ['Day 11–14', 'Follow-up: what has changed and what does the path to your goal look like?'],
    ],
    tip: 'Tip: measure your waist at the same time every week – it shows change earlier than the scale.',
    disclaimer: 'The image is an illustration based on your details, not a promise of exact results. How fast your body changes depends on training, nutrition, sleep and health.',
    missing: 'Fill in your height, weight and body type in the free trial form and we will show your personal body journey here.',
    figureAlt: (label, type) => `Illustration: ${label.toLowerCase()} – ${type}`,
    current: { skinny: 'Skinny', regular: 'Regular', pot_belly: 'Some belly', extra: 'Heavier' },
    desired: { smaller: 'Smaller size', lean: 'Lean & toned', athletic: 'Athletic & strong', shredded: 'Muscular & shredded' },
    benefits: {
      smaller: ['Lower weight and a smaller waist', 'More energy every day', 'Clothes fit better'],
      lean: ['Lower body fat', 'Visible muscle definition', 'A firmer, more toned body'],
      athletic: ['Stronger, broader upper body', 'Better fitness and posture', 'Balanced, functional strength'],
      shredded: ['Maximum muscle definition', 'Low body fat', 'Defined abs and shoulders'],
    },
  },
  fa: {
    title: 'بدن رویایی من',
    intro: 'این مسیر از بدن امروز شما تا هدفی است که انتخاب کرده‌اید. ۱۴ روز اول پایه کار را می‌سازد.',
    now: 'اکنون',
    goal: 'هدف',
    weight: 'وزن',
    bmi: 'BMI',
    change: 'تغییر',
    time: 'زمان تخمینی',
    weeks: (n) => `حدود ${n.toLocaleString('fa-IR')} هفته`,
    keep: 'حفظ وزن',
    benefitsTitle: 'به سمت این اهداف می‌رویم',
    planTitle: '۱۴ روز رایگان شما',
    plan: [
      ['روز ۱ تا ۳', 'جلسه شروع، اندازه‌گیری‌ها و برنامه تمرینی و غذایی شخصی شما.'],
      ['روز ۴ تا ۱۰', 'طبق برنامه تمرین می‌کنید و ما بر اساس بازخورد شما آن را تنظیم می‌کنیم.'],
      ['روز ۱۱ تا ۱۴', 'پیگیری: چه چیزی تغییر کرده و مسیر رسیدن به هدف چگونه است؟'],
    ],
    tip: 'نکته: دور کمر را هر هفته در یک زمان ثابت اندازه بگیرید – تغییر را زودتر از ترازو نشان می‌دهد.',
    disclaimer: 'این تصویر بر اساس اطلاعات شما ساخته شده و وعده نتیجه دقیق نیست. سرعت تغییر بدن به تمرین، تغذیه، خواب و سلامت بستگی دارد.',
    missing: 'قد، وزن و نوع بدن خود را در فرم دوره آزمایشی وارد کنید تا مسیر شخصی بدن شما را اینجا نشان دهیم.',
    figureAlt: (label, type) => `تصویر: ${label} – ${type}`,
    current: { skinny: 'لاغر', regular: 'معمولی', pot_belly: 'کمی شکم', extra: 'دارای اضافه وزن' },
    desired: { smaller: 'سایز کوچک‌تر', lean: 'لاغر و سفت', athletic: 'ورزشکاری و قوی', shredded: 'عضلانی و کات' },
    benefits: {
      smaller: ['وزن کمتر و دور کمر کوچک‌تر', 'انرژی بیشتر در زندگی روزمره', 'لباس‌ها بهتر اندازه می‌شوند'],
      lean: ['درصد چربی کمتر', 'عضلات نمایان', 'بدنی سفت‌تر و متناسب‌تر'],
      athletic: ['بالاتنه قوی‌تر و پهن‌تر', 'آمادگی جسمانی و فرم بدن بهتر', 'قدرت متعادل و کاربردی'],
      shredded: ['حداکثر تفکیک عضلات', 'درصد چربی پایین', 'عضلات شکم و شانه مشخص'],
    },
  },
}

// ───────────────────────── Kroppsmått ─────────────────────────
// Halva bredder (px) i en figur som är 420 px hög. Basen justeras per kroppstyp.
const BASE = {
  male:   { shoulder: 44, chest: 38, waist: 30, hip: 32, thigh: 15, calf: 10, arm: 8.5, neck: 8.5 },
  female: { shoulder: 36, chest: 32, waist: 24, hip: 35, thigh: 15.5, calf: 9.5, arm: 7, neck: 7 },
}

// Multiplikatorer per kroppstyp: [axlar, bröst, midja, höft, lår, arm], mage (extra midja), muskler (0–1)
const SHAPES = {
  skinny:    { m: [0.92, 0.88, 0.86, 0.9, 0.82, 0.82], belly: 0, muscle: 0 },
  regular:   { m: [1, 1, 1, 1, 1, 1], belly: 0, muscle: 0.1 },
  pot_belly: { m: [1, 1.04, 1.22, 1.06, 1.05, 1.04], belly: 0.12, muscle: 0 },
  extra:     { m: [1.08, 1.16, 1.36, 1.22, 1.24, 1.2], belly: 0.1, muscle: 0 },
  smaller:   { m: [0.97, 0.95, 0.9, 0.94, 0.93, 0.94], belly: 0, muscle: 0.2 },
  lean:      { m: [1.02, 1, 0.86, 0.95, 0.95, 0.98], belly: 0, muscle: 0.55 },
  athletic:  { m: [1.12, 1.1, 0.9, 0.98, 1.06, 1.12], belly: 0, muscle: 0.75 },
  shredded:  { m: [1.18, 1.14, 0.84, 0.96, 1.08, 1.18], belly: 0, muscle: 1 },
}

const bmiOf = (kg, cm) => (kg > 0 && cm > 0 ? kg / ((cm / 100) ** 2) : null)

// Finjustera bredden efter BMI (dämpat – kroppstypen styr mest)
const fatFactor = (bmi) => (bmi ? Math.min(1.22, Math.max(0.88, 1 + (bmi - 23) * 0.018)) : 1)

function shapeFor(sex, type, bmi) {
  const b = sex === 'neutral'
    ? Object.fromEntries(Object.keys(BASE.male).map((k) => [k, (BASE.male[k] + BASE.female[k]) / 2]))
    : BASE[sex]
  const s = SHAPES[type] || SHAPES.regular
  const f = fatFactor(bmi)
  const soft = (x) => 1 + (x - 1) * 0.6 // BMI påverkar axlar mindre än midja
  return {
    shoulder: b.shoulder * s.m[0] * soft(f),
    chest: b.chest * s.m[1] * soft(f),
    waist: b.waist * s.m[2] * f * (1 + s.belly),
    hip: b.hip * s.m[3] * f,
    thigh: b.thigh * s.m[4] * f,
    calf: b.calf * (0.9 + 0.1 * s.m[4]) * soft(f),
    arm: b.arm * s.m[5] * soft(f),
    neck: b.neck * (sex === 'male' ? 1 + s.muscle * 0.15 : 1),
    muscle: s.muscle,
  }
}

// Mjuk kurva genom punkter (Catmull-Rom → kubisk Bézier)
function smooth(points) {
  let d = ''
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}

// Bana runt en mittlinje med varierande bredd (armar och ben)
function limb(center, widths) {
  const left = []
  const right = []
  for (let i = 0; i < center.length; i++) {
    const [x, y] = center[i]
    const [nx, ny] = center[Math.min(i + 1, center.length - 1)]
    const [px, py] = center[Math.max(i - 1, 0)]
    const dx = nx - px
    const dy = ny - py
    const len = Math.hypot(dx, dy) || 1
    const ox = (-dy / len) * widths[i]
    const oy = (dx / len) * widths[i]
    left.push([x + ox, y + oy])
    right.push([x - ox, y - oy])
  }
  const r = right.reverse()
  return `M ${left[0][0].toFixed(1)} ${left[0][1].toFixed(1)}${smooth(left)} L ${r[0][0].toFixed(1)} ${r[0][1].toFixed(1)}${smooth(r)} Z`
}

function BodyFigure({ sex, type, bmi, variant, label }) {
  const uid = useId().replace(/:/g, '')
  const s = shapeFor(sex, type, bmi)
  const cx = 100

  // Bål (högersida, speglas)
  const side = [
    [cx + s.neck, 68],
    [cx + s.neck + (s.shoulder - s.neck) * 0.55, 74],
    [cx + s.shoulder * 0.96, 84],
    [cx + s.shoulder, 98],
    [cx + s.chest, 122],
    [cx + s.waist, 168],
    [cx + s.hip, 208],
    [cx + s.hip * 0.94, 232],
  ]
  const mirrored = side.map(([x, y]) => [2 * cx - x, y]).reverse()
  const torso = `M ${side[0][0]} ${side[0][1]}${smooth(side)} L ${cx} 238 L ${mirrored[0][0].toFixed(1)} ${mirrored[0][1]}${smooth(mirrored)} Z`

  // Ben
  const legGap = 3
  const legX = (dir) => cx + dir * (s.hip * 0.5 + legGap * 0.3)
  const leg = (dir) => limb(
    [[legX(dir), 222], [legX(dir) + dir * 1, 270], [legX(dir) + dir * 1.5, 318], [legX(dir) + dir * 1, 352], [legX(dir) + dir * 0.5, 396]],
    [s.thigh * 1.08, s.thigh * 0.9, s.calf * 0.85, s.calf, s.calf * 0.55],
  )

  // Armar – en bit ut från kroppen (naturlig pose)
  const arm = (dir) => {
    const sx = cx + dir * (s.shoulder - s.arm * 0.9)
    return limb(
      [[sx, 84], [sx + dir * 4, 108], [sx + dir * 8, 140], [sx + dir * 12, 172], [sx + dir * 15, 204], [sx + dir * 17, 230]],
      [s.arm * 1.15, s.arm * (1.08 + s.muscle * 0.28), s.arm * 0.95, s.arm * 0.84, s.arm * 0.72, s.arm * 0.6],
    )
  }

  const isGoal = variant === 'goal'
  const m = s.muscle
  const chestY = 116
  const absTop = 140

  return (
    <svg viewBox="0 0 200 430" className="bt-figure-svg" role="img" aria-label={label}>
      <defs>
        <linearGradient id={`fill-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={isGoal ? '#F1E6C8' : '#DCE3DE'} />
          <stop offset="1" stopColor={isGoal ? '#B99950' : '#7F9287'} />
        </linearGradient>
        <radialGradient id={`floor-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={isGoal ? 'rgba(200,162,78,0.55)' : 'rgba(143,161,150,0.35)'} />
          <stop offset="1" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* Podium */}
      <ellipse cx="100" cy="408" rx="86" ry="16" fill={`url(#floor-${uid})`} />
      <ellipse cx="100" cy="402" rx="62" ry="9" fill="#101b15" stroke={isGoal ? '#C8A24E' : '#3A4C41'} strokeWidth="1.5" />

      <g fill={`url(#fill-${uid})`}>
        {sex !== 'male' && (
          // Hår (långt) bakom huvudet
          <path d="M 80 34 C 78 10, 122 10, 120 34 C 124 62, 120 84, 113 92 L 87 92 C 80 84, 76 62, 80 34 Z" opacity="0.9" fill={isGoal ? '#8E7438' : '#55665B'} />
        )}
        <path d={arm(1)} />
        <path d={arm(-1)} />
        <ellipse cx={cx + (s.shoulder - s.arm * 0.9) + 17.5} cy="236" rx={s.arm * 0.62} ry={s.arm * 0.95} />
        <ellipse cx={cx - (s.shoulder - s.arm * 0.9) - 17.5} cy="236" rx={s.arm * 0.62} ry={s.arm * 0.95} />
        <path d={leg(1)} />
        <path d={leg(-1)} />
        <path d={torso} />
        <rect x={cx - s.neck} y="52" width={s.neck * 2} height="22" rx="4" />
        <ellipse cx="100" cy="36" rx="16" ry="20" />
        {sex === 'male' && <path d="M 84 30 C 84 12, 116 12, 116 30 C 110 22, 90 22, 84 30 Z" fill={isGoal ? '#8E7438' : '#55665B'} />}
      </g>

      {/* Träningskläder */}
      <g fill={isGoal ? '#1E2D24' : '#24352B'} opacity="0.92">
        <path d={`M ${cx - s.hip * 0.98} 204 L ${cx + s.hip * 0.98} 204 L ${cx + s.hip * 1.02} 252 L ${cx + 4} 256 L ${cx} 240 L ${cx - 4} 256 L ${cx - s.hip * 1.02} 252 Z`} />
        {sex !== 'male' && (
          <path d={`M ${cx - s.chest * 0.98} 106 Q ${cx} 98 ${cx + s.chest * 0.98} 106 L ${cx + s.chest * 0.9} 138 Q ${cx} 144 ${cx - s.chest * 0.9} 138 Z`} />
        )}
      </g>

      {/* Muskeldefinition för atletiska mål */}
      {m > 0.4 && (
        <g fill="none" stroke="rgba(90,70,30,0.55)" strokeWidth="1.3" strokeLinecap="round" opacity={0.4 + m * 0.5}>
          {/* Axlar */}
          <path d={`M ${cx + s.shoulder - 4} 96 q -8 10 -6 22`} />
          <path d={`M ${cx - s.shoulder + 4} 96 q 8 10 6 22`} />
          {sex === 'male' && (
            <>
              <path d={`M ${cx - s.chest * 0.85} ${chestY} Q ${cx - s.chest * 0.4} ${chestY + 12} ${cx - 2} ${chestY + 4}`} />
              <path d={`M ${cx + s.chest * 0.85} ${chestY} Q ${cx + s.chest * 0.4} ${chestY + 12} ${cx + 2} ${chestY + 4}`} />
            </>
          )}
          {/* Mage */}
          <path d={`M ${cx} ${absTop} L ${cx} ${absTop + 52}`} />
          {m > 0.7 && [0, 16, 32].map((dy) => (
            <path key={dy} d={`M ${cx - 9} ${absTop + 8 + dy} Q ${cx} ${absTop + 11 + dy} ${cx + 9} ${absTop + 8 + dy}`} />
          ))}
          {/* Lår */}
          <path d={`M ${legX(1) - 4} 262 q 4 22 2 40`} />
          <path d={`M ${legX(-1) + 4} 262 q -4 22 -2 40`} />
        </g>
      )}
    </svg>
  )
}

// ───────────────────────── Härledning från uppgifterna ─────────────────────────
function sexOf(gender) {
  const g = String(gender || '').toLowerCase()
  if (g === 'man' || g === 'male' || g === 'مرد') return 'male'
  if (g === 'kvinna' || g === 'female' || g === 'زن') return 'female'
  return 'neutral'
}

function currentTypeFrom(data, bmi) {
  if (SHAPES[data.currentBody] && ['skinny', 'regular', 'pot_belly', 'extra'].includes(data.currentBody)) return data.currentBody
  if (!bmi) return 'regular'
  if (bmi < 19.5) return 'skinny'
  if (bmi < 25) return 'regular'
  if (bmi < 29) return 'pot_belly'
  return 'extra'
}

function desiredTypeFrom(data) {
  if (['smaller', 'lean', 'athletic', 'shredded'].includes(data.desiredBody)) return data.desiredBody
  if (data.weightGoal === 'Viktuppgång') return 'athletic'
  if (data.weightGoal === 'Bibehålla') return 'lean'
  return 'smaller'
}

export default function BodyTransformation({ data, compact = false }) {
  const { language } = useLanguage()
  const tx = TEXT[language] || TEXT.sv
  const num = (v) => (v === '' || v == null ? null : Number(String(v).replace(',', '.')))
  const fmt = (v, d = 0) => (language === 'fa' ? v.toLocaleString('fa-IR', { maximumFractionDigits: d }) : v.toLocaleString(language === 'en' ? 'en-GB' : 'sv-SE', { maximumFractionDigits: d }))

  const height = num(data?.height)
  const weight = num(data?.weight)
  const target = num(data?.targetWeight) || weight

  if (!data || !height || !weight) {
    return (
      <section className="bt bt-empty">
        <h2>{tx.title}</h2>
        <p>{tx.missing}</p>
      </section>
    )
  }

  const sex = sexOf(data.gender)
  const bmiNow = bmiOf(weight, height)
  const bmiGoal = bmiOf(target, height)
  const nowType = currentTypeFrom(data, bmiNow)
  const goalType = desiredTypeFrom(data)
  const diff = target - weight
  const weeks = Math.abs(diff) < 0.5 ? null : Math.max(2, Math.ceil(Math.abs(diff) / (diff < 0 ? 0.75 : 0.35)))
  const benefits = tx.benefits[goalType]

  const stat = (labelKey, value) => (
    <div className="bt-stat">
      <span>{tx[labelKey]}</span>
      <strong>{value}</strong>
    </div>
  )

  return (
    <section className={`bt ${compact ? 'bt-compact' : ''}`} aria-labelledby="bt-title">
      <header className="bt-head">
        <h2 id="bt-title">{tx.title}</h2>
        <p>{tx.intro}</p>
      </header>

      <div className="bt-stage">
        <figure className="bt-side bt-now">
          <span className="bt-chip">{tx.now}</span>
          <BodyFigure sex={sex} type={nowType} bmi={bmiNow} variant="now" label={tx.figureAlt(tx.now, tx.current[nowType])} />
          <figcaption>
            <span className="bt-type">{tx.current[nowType]}</span>
            <div className="bt-stats">
              {stat('weight', `${fmt(weight, 1)} ${language === 'fa' ? 'کیلوگرم' : 'kg'}`)}
              {stat('bmi', fmt(bmiNow, 1))}
            </div>
          </figcaption>
        </figure>

        <div className="bt-middle">
          <span className="bt-vs">VS</span>
          <div className="bt-delta">
            <span>{tx.change}</span>
            <strong>{Math.abs(diff) < 0.5 ? tx.keep : language === 'fa' ? `${fmt(Math.abs(diff), 1)} کیلوگرم ${diff > 0 ? 'افزایش' : 'کاهش'}` : `${diff > 0 ? '+' : '−'}${fmt(Math.abs(diff), 1)} kg`}</strong>
            {weeks && (
              <>
                <span>{tx.time}</span>
                <strong>{tx.weeks(weeks)}</strong>
              </>
            )}
          </div>
        </div>

        <figure className="bt-side bt-goal">
          <span className="bt-chip bt-chip-goal">{tx.goal}</span>
          <BodyFigure sex={sex} type={goalType} bmi={bmiGoal} variant="goal" label={tx.figureAlt(tx.goal, tx.desired[goalType])} />
          <figcaption>
            <span className="bt-type">{tx.desired[goalType]}</span>
            <div className="bt-stats">
              {stat('weight', `${fmt(target, 1)} ${language === 'fa' ? 'کیلوگرم' : 'kg'}`)}
              {stat('bmi', fmt(bmiGoal, 1))}
            </div>
          </figcaption>
        </figure>
      </div>

      <div className="bt-info">
        <div className="bt-benefits">
          <h3>{tx.benefitsTitle}</h3>
          <ul>
            {benefits.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </div>
        {!compact && (
          <div className="bt-plan">
            <h3>{tx.planTitle}</h3>
            <ol>
              {tx.plan.map(([when, what]) => (
                <li key={when}><strong>{when}</strong><span>{what}</span></li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <p className="bt-tip">{tx.tip}</p>
      <p className="bt-disclaimer">{tx.disclaimer}</p>
    </section>
  )
}
