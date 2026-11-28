/*
 * Vilodag – visas i stället för ett träningspass på dagar med splitType 'rest'.
 * Vatten- och proteinmängder räknas ut från kundens vikt när den finns.
 * Allmänna råd för friska vuxna – inte medicinska råd.
 */

const box = { background: '#fff', borderRadius: '10px', padding: '14px 16px', border: '1px solid #d1fae5' }
const h = { color: '#065f46', display: 'block', marginBottom: '6px', fontSize: '0.92rem' }
const ul = { margin: 0, paddingInlineStart: '18px', fontSize: '0.85rem', color: '#1f2937', lineHeight: 1.6 }

export default function RestDayCard({ weightKg }) {
  const w = Number(String(weightKg || '').replace(',', '.'))
  const hasWeight = Number.isFinite(w) && w > 30 && w < 250
  const waterL = hasWeight ? (Math.round(w * 0.035 * 10) / 10).toLocaleString('sv-SE') : null
  const proteinMin = hasWeight ? Math.round(w * 1.6) : null
  const proteinMax = hasWeight ? Math.round(w * 2) : null

  return (
    <div style={{ marginBottom: '30px' }}>
      <div style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '20px 22px', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 6px', fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase', color: '#064e3b' }}>
          🛋️ Vilodag – återhämtning
        </h3>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#065f46', lineHeight: 1.55 }}>
          Idag bygger kroppen muskler. Det är under vilan som musklerna repareras och blir starkare – vilan är lika viktig som träningen.
          En muskelgrupp behöver ungefär <strong>48 timmar</strong> för att återhämta sig efter ett tungt pass, och leder och senor behöver också tid.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
        <div style={box}>
          <strong style={h}>💧 Drick vatten</strong>
          <ul style={ul}>
            <li>{waterL ? <>Sikta på ca <strong>{waterL} liter</strong> vatten idag (ca 35 ml per kilo kroppsvikt).</> : 'Sikta på ca 35 ml vatten per kilo kroppsvikt, oftast 2–3 liter.'}</li>
            <li>Ljusgul urin är ett bra tecken på att du dricker tillräckligt.</li>
            <li>Begränsa alkohol – det försämrar sömnen och återhämtningen.</li>
          </ul>
        </div>

        <div style={box}>
          <strong style={h}>🍎 Ät för återhämtning</strong>
          <ul style={ul}>
            <li>{proteinMin ? <>Protein: ca <strong>{proteinMin}–{proteinMax} g</strong> idag, fördelat på 3–5 måltider.</> : 'Protein i varje måltid, fördelat över dagen.'}</li>
            <li>Frukt och grönsaker – till exempel bär, banan, apelsin och spenat – ger vitaminer och antioxidanter.</li>
            <li>Ät som vanligt även på vilodagen – musklerna behöver energi för att växa.</li>
          </ul>
        </div>

        <div style={box}>
          <strong style={h}>😴 Sov ordentligt</strong>
          <ul style={ul}>
            <li>7–9 timmars sömn – det är då mest muskelreparation sker.</li>
            <li>Gå och lägg dig ungefär samma tid varje kväll.</li>
            <li>Undvik skärmar den sista halvtimmen innan du somnar.</li>
          </ul>
        </div>

        <div style={box}>
          <strong style={h}>🚶 Aktiv vila</strong>
          <ul style={ul}>
            <li>En lugn promenad på 20–30 minuter ökar blodflödet och minskar stelhet.</li>
            <li>10–15 minuters lätt stretching eller rörlighetsträning för höfter, axlar och rygg.</li>
            <li>Foam rolling (skumrulle) på stela muskler, 1–2 minuter per område.</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: '12px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 16px', fontSize: '0.85rem', color: '#78350f', lineHeight: 1.55 }}>
        <strong>⚠️ Lyssna på kroppen:</strong> Träningsvärk är normalt, men skarp smärta i en led eller muskel är det inte.
        Känner du dig ovanligt trött eller får ont – vila en extra dag och hör av dig till din coach.
      </div>
    </div>
  )
}
