/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

/*
 * Cookie-/samtyckeshantering (GDPR + Lagen om elektronisk kommunikation, LEK 9 kap. 28 §).
 *
 * - "necessary" är alltid på: inloggning, språkval och själva samtyckesvalet.
 * - Övriga kategorier är AV tills besökaren aktivt godkänner dem (inga förkryssade rutor).
 * - Valet sparas med version och datum så att samtycket kan visas upp i efterhand,
 *   och frågan ställs igen efter 12 månader eller om CONSENT_VERSION höjs.
 *
 * Lägger du till ett analys- eller marknadsföringsverktyg (t.ex. Google Analytics, Meta Pixel):
 * ladda det ENDAST när hasConsent('analytics') / hasConsent('marketing') är true,
 * lägg till det i cookietabellen på /integritetspolicy och höj CONSENT_VERSION.
 */

export const CONSENT_VERSION = 1
const STORAGE_KEY = 'cookie_consent'
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000 // 12 månader

export const CONSENT_CATEGORIES = ['necessary', 'analytics', 'marketing']

function readStoredConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed.version !== CONSENT_VERSION) return null
    if (!parsed.date || Date.now() - new Date(parsed.date).getTime() > MAX_AGE_MS) return null
    return parsed
  } catch {
    return null
  }
}

/** Kan användas även utanför React, t.ex. innan ett tredjepartsskript laddas. */
export function hasConsent(category) {
  if (category === 'necessary') return true
  const consent = readStoredConsent()
  return Boolean(consent?.categories?.[category])
}

const CookieConsentContext = createContext(null)

export function CookieConsentProvider({ children }) {
  const [consent, setConsent] = useState(readStoredConsent)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const save = useCallback((categories) => {
    const record = {
      version: CONSENT_VERSION,
      date: new Date().toISOString(),
      categories: { ...categories, necessary: true },
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
    } catch {
      // Lagring blockerad (t.ex. privat läge) – valet gäller då bara under besöket.
    }
    setConsent(record)
    setSettingsOpen(false)
    window.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: record }))
  }, [])

  const value = useMemo(() => ({
    consent,
    hasDecided: consent !== null,
    settingsOpen,
    openSettings: () => setSettingsOpen(true),
    closeSettings: () => setSettingsOpen(false),
    acceptAll: () => save({ analytics: true, marketing: true }),
    rejectAll: () => save({ analytics: false, marketing: false }),
    save,
  }), [consent, settingsOpen, save])

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext)
  if (!ctx) throw new Error('useCookieConsent måste användas inom <CookieConsentProvider>')
  return ctx
}
