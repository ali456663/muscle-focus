import React, { useState } from 'react';

const MUSCLES = {
  "Bröst": {
    primary: "Bänkpress",
    act: [["Stora bröstmuskeln", 90], ["Främre axel", 80], ["Triceps", 75], ["Rotatorkuff & bål", 55]],
    tips: [
      "Håll skulderbladen ihopdragna genom hela lyftet för stabilare bänkposition.",
      "Kontrollerad excentrisk fas (2–3 sek ner) ger mer mikroskada att bygga från.",
      "Undvik att träna bröst igen förrän 48–72 timmar passerat."
    ]
  },
  "Rygg": {
    primary: "Marklyft / Latsdrag",
    act: [["Latissimus dorsi", 85], ["Trapezius", 70], ["Nedre rygg (erector spinae)", 80], ["Biceps & underarmar", 50]],
    tips: [
      "Håll bålen spänd och ryggen neutral genom hela rörelsen.",
      "Prioritera grepp-styrka — den tryter ofta före ryggen.",
      "Extra rörlighet för höftböjare hjälper återhämtningen."
    ]
  },
  "Ben": {
    primary: "Knäböj",
    act: [["Fyrhövdade lårmuskeln", 88], ["Sätesmuskler", 75], ["Baklår (hamstrings)", 60], ["Bål", 65]],
    tips: [
      "Ben tar längst att återhämta — räkna med 72 timmar innan nästa benpass.",
      "Lätt promenad dagen efter ökar blodflödet utan att belasta ytterligare.",
      "Extra fokus på vätska och elektrolyter denna dag."
    ]
  },
  "Axlar": {
    primary: "Militärpress",
    act: [["Axlar (deltoideus)", 88], ["Triceps", 65], ["Övre bröst", 50], ["Bål (stabilisering)", 60]],
    tips: [
      "Axlar är känsliga för överbelastning — lyssna på tidiga signaler av irritation.",
      "Rörlighetsövningar för rotatorkuffen hjälper skadeförebyggande.",
      "Undvik tunga axelpass två dagar i rad."
    ]
  },
  "Armar": {
    primary: "Hantelcurl / Triceps pushdown",
    act: [["Biceps", 85], ["Triceps", 85], ["Underarmar", 60], ["Axlar (stabilisering)", 40]],
    tips: [
      "Mindre muskelgrupper återhämtar sig ofta snabbare — 48 timmar räcker oftast.",
      "Grepp-variation (över/undergrepp) ger jämnare belastning.",
      "Sträck ut underarmarna lätt efter passet."
    ]
  },
  "Bål/Core": {
    primary: "Plankan / Cable crunch",
    act: [["Raka bukmuskeln", 80], ["Sneda bukmuskler", 70], ["Nedre rygg (stabilisering)", 55], ["Höftböjare", 40]],
    tips: [
      "Core återhämtar snabbt — kan tränas oftare än stora muskelgrupper.",
      "Fokusera på kontrollerad andning i varje repetition.",
      "Undvik att spänna nacken istället för magen."
    ]
  }
};

const INTENSITY_MET = {
  "Lätt (RPE 1–4)": 3.0,
  "Måttlig (RPE 5–7)": 5.0,
  "Hög (RPE 8–10)": 6.5
};

export default function PassrapportWidget({ initialDay = 1, initialMuscle = "Bröst", initialWeight = 52 }) {
  const [day, setDay] = useState(initialDay);
  const [totalDays, setTotalDays] = useState(6);
  const [muscle, setMuscle] = useState(initialMuscle in MUSCLES ? initialMuscle : "Bröst");
  const [weight, setWeight] = useState(initialWeight);
  const [duration, setDuration] = useState(55);
  const [intensity, setIntensity] = useState("Måttlig (RPE 5–7)");
  const [lastLift, setLastLift] = useState(30);
  const [thisLift, setThisLift] = useState(32);
  const [unit] = useState("kg");
  const [daysToCheckin, setDaysToCheckin] = useState(6);
  const [coachNote, setCoachNote] = useState("Fokusera på jämn intensitet genom passet. Håll vilotiderna strikta på baslyften för optimal återhämtning.");

  const currentMuscleData = MUSCLES[muscle] || MUSCLES["Bröst"];

  const calcKcal = () => {
    const met = INTENSITY_MET[intensity] || 5.0;
    const w = parseFloat(weight) || 52;
    const d = parseFloat(duration) || 55;
    const kcal = (met * 3.5 * w / 200) * d;
    return Math.round(kcal);
  };

  const kcal = calcKcal();
  const delta = (parseFloat(thisLift) || 0) - (parseFloat(lastLift) || 0);
  const deltaCls = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const deltaTxt = delta > 0
    ? `+${delta} kg sen förra ${muscle.toLowerCase()}passet`
    : delta < 0
    ? `${delta} kg sen förra passet`
    : 'Oförändrat sen förra passet';

  return (
    <div style={{
      fontFamily: '-apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
      background: '#F6F4EF',
      color: '#152238',
      padding: '24px 20px 40px',
      borderRadius: '16px',
      border: '1px solid #DAD5C8',
      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
      maxWidth: '920px',
      margin: '20px auto 30px',
      boxSizing: 'border-box'
    }}>
      {/* Masthead */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        borderBottom: '3px solid #152238',
        paddingBottom: '14px',
        marginBottom: '20px'
      }}>
        <h1 style={{ fontSize: '15px', letterSpacing: '3px', textTransform: 'uppercase', margin: 0, fontWeight: '800' }}>
          PASSRAPPORT
        </h1>
        <span style={{ fontSize: '11px', letterSpacing: '2px', color: '#5B6B7D', textTransform: 'uppercase', fontWeight: '700' }}>
          Mall · koppla till kalkylator
        </span>
      </div>

      {/* Input Rail */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '10px 14px',
        background: '#FFFFFF',
        border: '1px solid #DAD5C8',
        padding: '16px',
        marginBottom: '22px',
        borderRadius: '8px'
      }}>
        {/* Dag i programmet */}
        <div>
          <label style={{ display: 'block', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#5B6B7D', marginBottom: '4px', fontWeight: '700' }}>
            Dag i programmet
          </label>
          <input
            type="number"
            min="1"
            max={totalDays}
            value={day}
            onChange={e => setDay(parseInt(e.target.value, 10) || 1)}
            style={{ width: '100%', padding: '7px 8px', fontSize: '14px', border: '1px solid #DAD5C8', background: '#FCFBF8', color: '#152238', borderRadius: '4px' }}
          />
        </div>

        {/* Antal dagar/vecka */}
        <div>
          <label style={{ display: 'block', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#5B6B7D', marginBottom: '4px', fontWeight: '700' }}>
            Antal dagar/vecka
          </label>
          <input
            type="number"
            min="1"
            max="14"
            value={totalDays}
            onChange={e => setTotalDays(parseInt(e.target.value, 10) || 6)}
            style={{ width: '100%', padding: '7px 8px', fontSize: '14px', border: '1px solid #DAD5C8', background: '#FCFBF8', color: '#152238', borderRadius: '4px' }}
          />
        </div>

        {/* Muskelgrupp */}
        <div>
          <label style={{ display: 'block', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#5B6B7D', marginBottom: '4px', fontWeight: '700' }}>
            Muskelgrupp
          </label>
          <select
            value={muscle}
            onChange={e => setMuscle(e.target.value)}
            style={{ width: '100%', padding: '7px 8px', fontSize: '14px', border: '1px solid #DAD5C8', background: '#FCFBF8', color: '#152238', borderRadius: '4px' }}
          >
            {Object.keys(MUSCLES).map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Klientens vikt */}
        <div>
          <label style={{ display: 'block', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#5B6B7D', marginBottom: '4px', fontWeight: '700' }}>
            Klientens vikt (kg)
          </label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={e => setWeight(parseFloat(e.target.value) || 0)}
            style={{ width: '100%', padding: '7px 8px', fontSize: '14px', border: '1px solid #DAD5C8', background: '#FCFBF8', color: '#152238', borderRadius: '4px' }}
          />
        </div>

        {/* Passets längd */}
        <div>
          <label style={{ display: 'block', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#5B6B7D', marginBottom: '4px', fontWeight: '700' }}>
            Passets längd (min)
          </label>
          <input
            type="number"
            value={duration}
            onChange={e => setDuration(parseInt(e.target.value, 10) || 0)}
            style={{ width: '100%', padding: '7px 8px', fontSize: '14px', border: '1px solid #DAD5C8', background: '#FCFBF8', color: '#152238', borderRadius: '4px' }}
          />
        </div>

        {/* Intensitet */}
        <div>
          <label style={{ display: 'block', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#5B6B7D', marginBottom: '4px', fontWeight: '700' }}>
            Intensitet
          </label>
          <select
            value={intensity}
            onChange={e => setIntensity(e.target.value)}
            style={{ width: '100%', padding: '7px 8px', fontSize: '14px', border: '1px solid #DAD5C8', background: '#FCFBF8', color: '#152238', borderRadius: '4px' }}
          >
            {Object.keys(INTENSITY_MET).map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        {/* Förra passets vikt */}
        <div>
          <label style={{ display: 'block', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#5B6B7D', marginBottom: '4px', fontWeight: '700' }}>
            Förra passets vikt (kg)
          </label>
          <input
            type="number"
            step="0.5"
            value={lastLift}
            onChange={e => setLastLift(parseFloat(e.target.value) || 0)}
            style={{ width: '100%', padding: '7px 8px', fontSize: '14px', border: '1px solid #DAD5C8', background: '#FCFBF8', color: '#152238', borderRadius: '4px' }}
          />
        </div>

        {/* Dagens vikt */}
        <div>
          <label style={{ display: 'block', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#5B6B7D', marginBottom: '4px', fontWeight: '700' }}>
            Dagens vikt (kg)
          </label>
          <input
            type="number"
            step="0.5"
            value={thisLift}
            onChange={e => setThisLift(parseFloat(e.target.value) || 0)}
            style={{ width: '100%', padding: '7px 8px', fontSize: '14px', border: '1px solid #DAD5C8', background: '#FCFBF8', color: '#152238', borderRadius: '4px' }}
          />
        </div>

        {/* Dagar till avstämning */}
        <div>
          <label style={{ display: 'block', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#5B6B7D', marginBottom: '4px', fontWeight: '700' }}>
            Dagar till nästa avstämning
          </label>
          <input
            type="number"
            min="0"
            value={daysToCheckin}
            onChange={e => setDaysToCheckin(parseInt(e.target.value, 10) || 0)}
            style={{ width: '100%', padding: '7px 8px', fontSize: '14px', border: '1px solid #DAD5C8', background: '#FCFBF8', color: '#152238', borderRadius: '4px' }}
          />
        </div>
      </div>

      {/* Session Meter */}
      <div style={{ marginBottom: '26px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#5B6B7D', marginBottom: '7px', fontWeight: '700' }}>
          <span>Träningsblock</span>
          <span>Dag {day} av {totalDays}</span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {Array.from({ length: totalDays }, (_, idx) => {
            const dayNum = idx + 1;
            const isDone = dayNum < day;
            const isCurrent = dayNum === day;
            return (
              <div
                key={dayNum}
                style={{
                  flex: 1,
                  height: '10px',
                  background: isDone ? '#152238' : isCurrent ? '#B8892B' : '#E7E2D4',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease'
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Headline Card */}
      <div style={{
        background: '#152238',
        color: '#F6F4EF',
        padding: '22px 24px',
        marginBottom: '3px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '10px',
        borderRadius: '8px 8px 0 0'
      }}>
        <div>
          <div style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.75 }}>
            Dag {day} · {muscle}fokuserat pass
          </div>
          <h2 style={{ fontSize: '28px', margin: '2px 0 0', fontWeight: '800' }}>
            $MuskelGrupp = {muscle}
          </h2>
        </div>
        <div style={{ fontSize: '12px', opacity: 0.8, textAlign: 'right', maxWidth: '240px', lineHeight: 1.4 }}>
          Styrketräning bygger en starkare motor i kroppen — inte bara en kaloriförbrukare under passet.
        </div>
      </div>

      {/* Scoreboard */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        background: '#FFFFFF',
        border: '1px solid #DAD5C8',
        borderTop: 'none',
        marginBottom: '3px'
      }}>
        {/* Stat 1: Kcal */}
        <div style={{ padding: '18px 20px', borderRight: '1px solid #DAD5C8' }}>
          <div style={{ fontSize: '30px', fontWeight: '800', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            ~{kcal} <small style={{ fontSize: '14px', fontWeight: '600', color: '#5B6B7D' }}>kcal</small>
          </div>
          <div style={{ fontSize: '10.5px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#5B6B7D', marginTop: '6px', fontWeight: '700' }}>
            Uppskattad förbränning
          </div>
        </div>

        {/* Stat 2: Toppvikt */}
        <div style={{ padding: '18px 20px', borderRight: '1px solid #DAD5C8' }}>
          <div style={{ fontSize: '30px', fontWeight: '800', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {thisLift} <small style={{ fontSize: '14px', fontWeight: '600', color: '#5B6B7D' }}>{unit}</small>
          </div>
          <div style={{
            fontSize: '12px',
            marginTop: '4px',
            fontWeight: '700',
            color: deltaCls === 'up' ? '#2E7D46' : deltaCls === 'down' ? '#9C3B32' : '#5B6B7D'
          }}>
            {deltaTxt}
          </div>
          <div style={{ fontSize: '10.5px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#5B6B7D', marginTop: '6px', fontWeight: '700' }}>
            Toppvikt · {currentMuscleData.primary}
          </div>
        </div>

        {/* Stat 3: Duration */}
        <div style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '30px', fontWeight: '800', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {duration} <small style={{ fontSize: '14px', fontWeight: '600', color: '#5B6B7D' }}>min</small>
          </div>
          <div style={{ fontSize: '10.5px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#5B6B7D', marginTop: '6px', fontWeight: '700' }}>
            Passets längd
          </div>
        </div>
      </div>

      {/* Grid 2: Activation + Recovery */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '3px', marginBottom: '3px' }}>
        {/* Panel 1: Muscle Activation */}
        <div style={{ background: '#FFFFFF', border: '1px solid #DAD5C8', padding: '20px 22px' }}>
          <h3 style={{ fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 14px', color: '#5B6B7D', fontWeight: '800', borderBottom: '1px solid #DAD5C8', paddingBottom: '8px' }}>
            Muskelaktivering · {currentMuscleData.primary}
          </h3>
          {currentMuscleData.act.map(([actName, actPct], idx) => (
            <div key={idx} style={{ marginBottom: idx === currentMuscleData.act.length - 1 ? '0' : '11px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                <span>{actName}</span>
                <span style={{ fontWeight: '700' }}>{actPct}%</span>
              </div>
              <div style={{ height: '7px', background: '#EDE9DD', position: 'relative', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${actPct}%`, background: '#9C3B32', transition: 'width 0.5s ease' }} />
              </div>
            </div>
          ))}
          <div style={{ fontSize: '10px', color: '#5B6B7D', marginTop: '10px', lineHeight: 1.5 }}>
            Aktiveringsprofil gäller för {currentMuscleData.primary.toLowerCase()} specifikt — övriga övningar i passet kan aktivera musklerna olika mycket.
          </div>
        </div>

        {/* Panel 2: Recovery Tips */}
        <div style={{ background: '#FFFFFF', border: '1px solid #DAD5C8', padding: '20px 22px' }}>
          <h3 style={{ fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 14px', color: '#5B6B7D', fontWeight: '800', borderBottom: '1px solid #DAD5C8', paddingBottom: '8px' }}>
            Återhämtning idag
          </h3>
          {currentMuscleData.tips.map((tipText, idx) => (
            <div key={idx} style={{ fontSize: '13px', lineHeight: 1.55, marginBottom: '10px', paddingLeft: '14px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#B8892B', fontWeight: '800' }}>—</span>
              {tipText}
            </div>
          ))}
        </div>
      </div>

      {/* Check-in Note Card */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #DAD5C8',
        padding: '18px 22px',
        marginBottom: '3px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{ fontSize: '13px', lineHeight: 1.5, maxWidth: '560px' }}>
          <b style={{ color: '#152238' }}>Fettprocent och vikt uppdateras inte per pass.</b> Det går inte att mäta fettförlust tillförlitligt på en enskild träning — vikt, midjemått och ev. InBody stäms av vid nästa avstämning istället.
        </div>
        <div style={{ fontSize: '26px', fontWeight: '800', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
          {daysToCheckin}
          <span style={{ display: 'block', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#5B6B7D', fontWeight: '700' }}>
            Dagar kvar
          </span>
        </div>
      </div>

      {/* Coach Comment Card */}
      <div style={{ background: '#FFFFFF', border: '1px solid #DAD5C8', padding: '20px 22px', borderRadius: '0 0 8px 8px' }}>
        <h3 style={{ fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 10px', color: '#5B6B7D', fontWeight: '800' }}>
          Coach-kommentar
        </h3>
        <textarea
          value={coachNote}
          onChange={e => setCoachNote(e.target.value)}
          placeholder="Skriv dina anteckningar eller feedback..."
          style={{
            width: '100%',
            minHeight: '64px',
            border: '1px solid #DAD5C8',
            background: '#FCFBF8',
            padding: '10px 12px',
            fontFamily: 'inherit',
            fontSize: '13.5px',
            lineHeight: 1.5,
            color: '#152238',
            borderRadius: '4px',
            resize: 'vertical'
          }}
        />
      </div>

      {/* Footnote */}
      <div style={{ fontSize: '10.5px', color: '#5B6B7D', textAlign: 'center', marginTop: '18px', lineHeight: 1.6 }}>
        Platshållare för koppling till kalkylator: $Dag · $MuskelGrupp · $KcalFörbrukning · $ToppviktFörra · $ToppviktIdag · $DagarTillAvstämning<br />
        Kalorier beräknas via MET-formel: kcal = MET × 3,5 × vikt(kg) / 200 × minuter — endast en uppskattning, ej exakt mätning.
      </div>
    </div>
  );
}
