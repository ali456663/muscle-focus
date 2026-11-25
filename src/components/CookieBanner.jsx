import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Cookie, X } from 'lucide-react'
import { useCookieConsent } from '../context/CookieConsentContext'
import { useLanguage } from '../hooks/useLanguage'
import './CookieBanner.css'

const TEXT = {
  sv: {
    title: 'Vi värnar om din integritet',
    body: 'Vi använder nödvändig lagring i din webbläsare för att sajten ska fungera, till exempel inloggning och språkval. Analys- och marknadsföringscookies används bara om du godkänner dem.',
    readMore: 'Läs vår integritetspolicy',
    acceptAll: 'Acceptera alla',
    rejectAll: 'Endast nödvändiga',
    customize: 'Anpassa',
    settingsTitle: 'Cookie-inställningar',
    save: 'Spara mina val',
    close: 'Stäng',
    alwaysOn: 'Alltid på',
    notUsed: 'Används inte i dag – ditt val sparas och gäller om vi inför sådana tjänster.',
    categories: {
      necessary: ['Nödvändiga', 'Krävs för att sajten ska fungera: inloggning, språkval och att komma ihåg ditt cookieval. Kan inte stängas av.'],
      analytics: ['Analys', 'Hjälper oss förstå hur sajten används (anonym besöksstatistik) så att vi kan förbättra den.'],
      marketing: ['Marknadsföring', 'Används för att visa relevanta erbjudanden och mäta kampanjer, även hos tredje part.'],
    },
  },
  en: {
    title: 'We care about your privacy',
    body: 'We use necessary browser storage to make the site work, such as login and language choice. Analytics and marketing cookies are only used if you accept them.',
    readMore: 'Read our privacy policy',
    acceptAll: 'Accept all',
    rejectAll: 'Necessary only',
    customize: 'Customize',
    settingsTitle: 'Cookie settings',
    save: 'Save my choices',
    close: 'Close',
    alwaysOn: 'Always on',
    notUsed: 'Not used today – your choice is saved and applies if we introduce such services.',
    categories: {
      necessary: ['Necessary', 'Required for the site to work: login, language choice and remembering your cookie choice. Cannot be turned off.'],
      analytics: ['Analytics', 'Helps us understand how the site is used (anonymous visitor statistics) so we can improve it.'],
      marketing: ['Marketing', 'Used to show relevant offers and measure campaigns, including by third parties.'],
    },
  },
  fa: {
    title: 'ما به حریم خصوصی شما اهمیت می‌دهیم',
    body: 'ما از ذخیره‌سازی ضروری در مرورگر شما برای عملکرد سایت استفاده می‌کنیم، مانند ورود به حساب و انتخاب زبان. کوکی‌های تحلیلی و بازاریابی فقط با موافقت شما استفاده می‌شوند.',
    readMore: 'سیاست حفظ حریم خصوصی',
    acceptAll: 'پذیرش همه',
    rejectAll: 'فقط ضروری',
    customize: 'تنظیمات',
    settingsTitle: 'تنظیمات کوکی',
    save: 'ذخیره انتخاب‌ها',
    close: 'بستن',
    alwaysOn: 'همیشه فعال',
    notUsed: 'در حال حاضر استفاده نمی‌شود – انتخاب شما ذخیره می‌شود.',
    categories: {
      necessary: ['ضروری', 'برای عملکرد سایت لازم است: ورود، انتخاب زبان و به خاطر سپردن انتخاب کوکی شما.'],
      analytics: ['تحلیلی', 'به ما کمک می‌کند بفهمیم سایت چگونه استفاده می‌شود تا آن را بهبود دهیم.'],
      marketing: ['بازاریابی', 'برای نمایش پیشنهادهای مرتبط و اندازه‌گیری کمپین‌ها استفاده می‌شود.'],
    },
  },
}

// Kategorier som faktiskt används på sajten i dag. Lägg till 'analytics'/'marketing' här när de införs.
const CATEGORIES_IN_USE = ['necessary']

function CookieSettings({ tx, onClose }) {
  const { consent, save } = useCookieConsent()
  const [choices, setChoices] = useState({
    analytics: Boolean(consent?.categories?.analytics),
    marketing: Boolean(consent?.categories?.marketing),
  })
  const dialogRef = useRef(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    dialogRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  return (
    <div className="cookie-overlay" onClick={onClose}>
      <div
        className="cookie-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-settings-title"
        tabIndex={-1}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cookie-dialog-header">
          <h2 id="cookie-settings-title">{tx.settingsTitle}</h2>
          <button type="button" className="cookie-icon-btn" onClick={onClose} aria-label={tx.close}>
            <X size={20} />
          </button>
        </div>

        <ul className="cookie-category-list">
          {Object.entries(tx.categories).map(([key, [label, desc]]) => {
            const locked = key === 'necessary'
            const inputId = `cookie-cat-${key}`
            return (
              <li key={key} className="cookie-category">
                <div className="cookie-category-text">
                  <label htmlFor={inputId}>{label}</label>
                  <p>{desc}</p>
                  {!CATEGORIES_IN_USE.includes(key) && <p className="cookie-note">{tx.notUsed}</p>}
                </div>
                {locked ? (
                  <span className="cookie-always-on">{tx.alwaysOn}</span>
                ) : (
                  <input
                    id={inputId}
                    type="checkbox"
                    role="switch"
                    className="cookie-switch"
                    checked={choices[key]}
                    onChange={(e) => setChoices((c) => ({ ...c, [key]: e.target.checked }))}
                  />
                )}
              </li>
            )
          })}
        </ul>

        <div className="cookie-actions">
          <button type="button" className="cookie-btn" onClick={() => save({ analytics: false, marketing: false })}>{tx.rejectAll}</button>
          <button type="button" className="cookie-btn" onClick={() => save(choices)}>{tx.save}</button>
          <button type="button" className="cookie-btn" onClick={() => save({ analytics: true, marketing: true })}>{tx.acceptAll}</button>
        </div>
      </div>
    </div>
  )
}

export default function CookieBanner() {
  const { hasDecided, settingsOpen, openSettings, closeSettings, acceptAll, rejectAll } = useCookieConsent()
  const { language } = useLanguage()
  const tx = TEXT[language] || TEXT.sv

  return (
    <>
      {!hasDecided && !settingsOpen && (
        <section className="cookie-banner" role="region" aria-label={tx.title}>
          <div className="cookie-banner-text">
            <h2><Cookie size={18} aria-hidden="true" /> {tx.title}</h2>
            <p>
              {tx.body}{' '}
              <Link to="/integritetspolicy#cookies">{tx.readMore}</Link>
            </p>
          </div>
          <div className="cookie-actions">
            <button type="button" className="cookie-btn" onClick={rejectAll}>{tx.rejectAll}</button>
            <button type="button" className="cookie-btn cookie-btn-ghost" onClick={openSettings}>{tx.customize}</button>
            <button type="button" className="cookie-btn" onClick={acceptAll}>{tx.acceptAll}</button>
          </div>
        </section>
      )}
      {settingsOpen && <CookieSettings tx={tx} onClose={closeSettings} />}
    </>
  )
}
