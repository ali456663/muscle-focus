import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { useCookieConsent } from '../context/CookieConsentContext'
import './Privacy.css'

// Kontaktuppgifter för integritetsfrågor. Uppdatera här om adressen ändras.
const CONTACT_EMAIL = 'info.musclefocus@gmail.com'
const LAST_UPDATED = '2026-11-25'

const CONTENT = {
  sv: {
    title: 'Integritetspolicy',
    docTitle: 'Integritetspolicy & Cookies | Muscle & Focus',
    intro: 'Här beskriver vi vilka personuppgifter vi samlar in, varför, på vilken laglig grund, hur länge vi sparar dem och vilka rättigheter du har enligt dataskyddsförordningen (GDPR).',
    updated: 'Senast uppdaterad',
    cookieButton: 'Ändra cookie-inställningar',
    sections: [
      {
        id: 'ansvarig',
        h: '1. Personuppgiftsansvarig',
        p: [`Muscle & Focus (Lic. PT Ali Wafa) är personuppgiftsansvarig för behandlingen av dina personuppgifter. Frågor om integritet, eller om du vill utöva dina rättigheter, skickar du till ${CONTACT_EMAIL}.`],
      },
      {
        id: 'uppgifter',
        h: '2. Vilka uppgifter vi behandlar och varför',
        table: {
          head: ['Ändamål', 'Uppgifter', 'Laglig grund', 'Lagringstid'],
          rows: [
            ['Ansökan och skräddarsytt tränings-/kostprogram', 'Namn, e-post, telefon, personnummer, ålder, kön, ort, längd, vikt, kroppsmått, mål och träningsbakgrund', 'Avtal (art. 6.1 b)', 'Under avtalet och 12 månader därefter. Ansökningar som inte leder till avtal raderas efter 12 månader.'],
            ['Anpassning av programmet till skador och allergier', 'Hälsouppgifter: skador, allergier och liknande', 'Ditt uttryckliga samtycke (art. 9.2 a) – kan återkallas när som helst', 'Raderas när samtycket återkallas eller när avtalet upphör.'],
            ['Klienter 16–17 år', 'Vårdnadshavares e-post och telefon', 'Avtal (art. 6.1 b)', 'Som för ansökan ovan.'],
            ['Kundkonto och inloggning', 'Namn, telefon, e-post, lösenord (lagras krypterat/hashat), träningshistorik', 'Avtal (art. 6.1 b)', 'Tills du avslutar kontot, därefter raderas uppgifterna inom 30 dagar.'],
            ['Hitta träningskompis', 'De uppgifter du själv publicerar i annonsen', 'Samtycke (art. 6.1 a)', 'Tills du tar bort annonsen, dock längst 6 månader.'],
            ['Betalning och bokföring', 'Namn, köpt paket, belopp, betalningsreferens', 'Rättslig förpliktelse (art. 6.1 c) – bokföringslagen', '7 år enligt bokföringslagen.'],
            ['Säkerhet och felsökning', 'IP-adress, tidpunkt och serverloggar', 'Berättigat intresse (art. 6.1 f) – att skydda tjänsten mot intrång', 'Högst 90 dagar.'],
          ],
        },
        after: ['Vi säljer aldrig dina personuppgifter och använder dem inte för automatiserade beslut eller profilering.'],
      },
      {
        id: 'mottagare',
        h: '3. Vilka vi delar uppgifter med',
        p: ['Vi anlitar personuppgiftsbiträden som behandlar uppgifter för vår räkning enligt personuppgiftsbiträdesavtal:'],
        list: [
          'Stripe – betalningar. Kortuppgifter hanteras direkt av Stripe och når aldrig oss.',
          'Webbhotell och server (Netlify och Render) – drift av webbplatsen och databasen.',
          'Google (Gmail) – e-postkorrespondens med dig.',
          'jsDelivr – levererar övningsbilder. Din webbläsare skickar då din IP-adress till jsDelivr.',
        ],
        after: ['Vissa leverantörer finns i USA. Överföringen sker då med stöd av EU-kommissionens beslut om EU–US Data Privacy Framework eller EU:s standardavtalsklausuler. Länkar till YouTube och partnerbutiker öppnar externa webbplatser som har egna integritetspolicyer.'],
      },
      {
        id: 'cookies',
        h: '4. Cookies och lagring i webbläsaren',
        p: ['Vi använder i dag endast nödvändig lagring (localStorage) som krävs för att sajten ska fungera. Den kräver inte samtycke enligt lagen om elektronisk kommunikation. Vi använder inga analys- eller marknadsföringscookies. Om vi inför sådana kommer de bara att användas efter att du har godkänt dem i cookie-bannern.'],
        table: {
          head: ['Namn', 'Syfte', 'Typ', 'Lagringstid'],
          rows: [
            ['cookie_consent', 'Kommer ihåg ditt cookieval', 'Nödvändig', '12 månader'],
            ['language', 'Kommer ihåg valt språk', 'Nödvändig', 'Tills du rensar webbläsaren'],
            ['client_token, client_user, client_name, client_email', 'Håller dig inloggad på ditt kundkonto', 'Nödvändig', 'Tills du loggar ut'],
            ['client_program_data', 'Sparar ditt träningsprogram lokalt', 'Nödvändig', 'Tills du loggar ut'],
            ['admin_token, admin_user', 'Inloggning för administratör', 'Nödvändig', 'Tills administratören loggar ut'],
            ['musclefocus_buddies_offline', 'Sparar en annons till Hitta träningskompis tillfälligt om servern inte svarar, så att den kan skickas senare. Ansökningar sparas aldrig i webbläsaren.', 'Nödvändig', 'Tills annonsen har skickats'],
          ],
        },
        cookieButton: true,
      },
      {
        id: 'rattigheter',
        h: '5. Dina rättigheter',
        p: ['Enligt GDPR har du rätt att:'],
        list: [
          'få tillgång till de uppgifter vi har om dig (registerutdrag),',
          'få felaktiga uppgifter rättade,',
          'få dina uppgifter raderade ("rätten att bli bortglömd"),',
          'begränsa eller invända mot behandlingen,',
          'få ut dina uppgifter i ett maskinläsbart format (dataportabilitet),',
          'när som helst återkalla ett samtycke, utan att det påverkar behandlingen innan återkallelsen.',
        ],
        after: [`Kontakta oss på ${CONTACT_EMAIL}. Vi svarar inom en månad. Är du missnöjd med hur vi behandlar dina uppgifter kan du klaga hos Integritetsskyddsmyndigheten (IMY), www.imy.se.`],
      },
      {
        id: 'sakerhet',
        h: '6. Säkerhet och personuppgiftsincidenter',
        p: ['All trafik krypteras med HTTPS, lösenord lagras aldrig i klartext och åtkomst till administrationen är begränsad till behörig personal. Om en personuppgiftsincident inträffar som kan innebära en risk för dig anmäler vi den till IMY inom 72 timmar och informerar dig om risken är hög.'],
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    docTitle: 'Privacy Policy & Cookies | Muscle & Focus',
    intro: 'This policy describes which personal data we collect, why, on what legal basis, how long we keep it and what rights you have under the General Data Protection Regulation (GDPR).',
    updated: 'Last updated',
    cookieButton: 'Change cookie settings',
    sections: [
      {
        id: 'ansvarig',
        h: '1. Data controller',
        p: [`Muscle & Focus (Lic. PT Ali Wafa) is the controller of your personal data. Send privacy questions or requests to exercise your rights to ${CONTACT_EMAIL}.`],
      },
      {
        id: 'uppgifter',
        h: '2. What data we process and why',
        table: {
          head: ['Purpose', 'Data', 'Legal basis', 'Retention'],
          rows: [
            ['Application and tailored training/nutrition program', 'Name, email, phone, personal identity number, age, gender, city, height, weight, body measurements, goals and training background', 'Contract (Art. 6(1)(b))', 'During the contract and 12 months after. Applications that do not lead to a contract are deleted after 12 months.'],
            ['Adapting the program to injuries and allergies', 'Health data: injuries, allergies and similar', 'Your explicit consent (Art. 9(2)(a)) – can be withdrawn at any time', 'Deleted when consent is withdrawn or the contract ends.'],
            ['Clients aged 16–17', "Guardian's email and phone", 'Contract (Art. 6(1)(b))', 'As for applications above.'],
            ['Customer account and login', 'Name, phone, email, password (stored hashed), training history', 'Contract (Art. 6(1)(b))', 'Until you close the account; then deleted within 30 days.'],
            ['Find a training buddy', 'The information you publish in your listing', 'Consent (Art. 6(1)(a))', 'Until you remove the listing, at most 6 months.'],
            ['Payment and accounting', 'Name, package purchased, amount, payment reference', 'Legal obligation (Art. 6(1)(c)) – Swedish Bookkeeping Act', '7 years under the Bookkeeping Act.'],
            ['Security and troubleshooting', 'IP address, time and server logs', 'Legitimate interest (Art. 6(1)(f)) – protecting the service against attacks', 'At most 90 days.'],
          ],
        },
        after: ['We never sell your personal data and do not use it for automated decision-making or profiling.'],
      },
      {
        id: 'mottagare',
        h: '3. Who we share data with',
        p: ['We use processors that handle data on our behalf under data processing agreements:'],
        list: [
          'Stripe – payments. Card details are handled directly by Stripe and never reach us.',
          'Hosting and servers (Netlify and Render) – running the website and database.',
          'Google (Gmail) – email correspondence with you.',
          'jsDelivr – delivers exercise images. Your browser then sends your IP address to jsDelivr.',
        ],
        after: ['Some providers are located in the USA. Transfers are then based on the EU–US Data Privacy Framework adequacy decision or the EU Standard Contractual Clauses. Links to YouTube and partner shops open external websites with their own privacy policies.'],
      },
      {
        id: 'cookies',
        h: '4. Cookies and browser storage',
        p: ['Today we only use necessary storage (localStorage) required for the site to work. It does not require consent under the Swedish Electronic Communications Act. We do not use analytics or marketing cookies. If we introduce them, they will only be used after you accept them in the cookie banner.'],
        table: {
          head: ['Name', 'Purpose', 'Type', 'Retention'],
          rows: [
            ['cookie_consent', 'Remembers your cookie choice', 'Necessary', '12 months'],
            ['language', 'Remembers your language', 'Necessary', 'Until you clear your browser'],
            ['client_token, client_user, client_name, client_email', 'Keeps you logged in to your account', 'Necessary', 'Until you log out'],
            ['client_program_data', 'Stores your training program locally', 'Necessary', 'Until you log out'],
            ['admin_token, admin_user', 'Administrator login', 'Necessary', 'Until the administrator logs out'],
            ['musclefocus_buddies_offline', 'Temporarily stores a training-buddy listing if the server does not respond, so it can be sent later. Applications are never stored in the browser.', 'Necessary', 'Until the listing has been sent'],
          ],
        },
        cookieButton: true,
      },
      {
        id: 'rattigheter',
        h: '5. Your rights',
        p: ['Under the GDPR you have the right to:'],
        list: [
          'access the data we hold about you,',
          'have inaccurate data corrected,',
          'have your data erased ("right to be forgotten"),',
          'restrict or object to processing,',
          'receive your data in a machine-readable format (data portability),',
          'withdraw consent at any time, without affecting processing before the withdrawal.',
        ],
        after: [`Contact us at ${CONTACT_EMAIL}. We respond within one month. If you are unhappy with how we handle your data, you can lodge a complaint with the Swedish Authority for Privacy Protection (IMY), www.imy.se.`],
      },
      {
        id: 'sakerhet',
        h: '6. Security and personal data breaches',
        p: ['All traffic is encrypted with HTTPS, passwords are never stored in plain text and access to administration is limited to authorized staff. If a personal data breach occurs that may pose a risk to you, we report it to IMY within 72 hours and inform you if the risk is high.'],
      },
    ],
  },
}

function Table({ head, rows }) {
  return (
    <div className="privacy-table-wrap" tabIndex={0}>
      <table className="privacy-table">
        <thead>
          <tr>{head.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => <td key={i} data-label={head[i]}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Privacy() {
  const { language } = useLanguage()
  const { openSettings } = useCookieConsent()
  const { hash } = useLocation()
  const c = CONTENT[language] || CONTENT.en

  useEffect(() => {
    document.title = c.docTitle
  }, [c.docTitle])

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
  }, [hash])

  return (
    <div className={`privacy-page container ${language === 'fa' ? 'rtl-align' : ''}`}>
      <header className="page-hero">
        <h1 className="page-title">{c.title}</h1>
        <p className="page-intro">{c.intro}</p>
        <p className="privacy-updated">{c.updated}: {LAST_UPDATED}</p>
      </header>

      <div className="privacy-content">
        {c.sections.map((s) => (
          <section key={s.id} id={s.id} className="privacy-section">
            <h2>{s.h}</h2>
            {s.p && s.p.map((t) => <p key={t}>{t}</p>)}
            {s.table && <Table {...s.table} />}
            {s.list && <ul>{s.list.map((li) => <li key={li}>{li}</li>)}</ul>}
            {s.after && s.after.map((t) => <p key={t}>{t}</p>)}
            {s.cookieButton && (
              <button type="button" className="cookie-btn" onClick={openSettings}>{c.cookieButton}</button>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}

export default Privacy
