import { useState } from 'react'

/*
 * "Egna extraövningar" – kunden kan själv lägga till övningar att göra efter
 * det ordinarie 60-minuterspasset. Sparas i webbläsaren (localStorage) per
 * kund, vecka och dag. Synkas inte till servern.
 * Föräldern sätter key={storageKey} så att komponenten startar om när dag/vecka byts.
 */

const MAX_ITEMS = 10
const EMPTY = { name: '', sets: '', reps: '', note: '' }

function load(key) {
  try {
    const raw = localStorage.getItem(key)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

const cell = { padding: '10px 14px', borderBottom: '1px solid #e5e7eb', verticalAlign: 'middle' }
const input = {
  width: '100%', padding: '9px 10px', border: '1px solid #d1d5db', borderRadius: '8px',
  fontSize: '0.85rem', color: '#111827', background: '#fff', boxSizing: 'border-box',
}

export default function CustomExtras({ storageKey }) {
  const [items, setItems] = useState(() => load(storageKey))
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')

  const persist = (next) => {
    setItems(next)
    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
    } catch {
      // Lagring blockerad – listan gäller bara under besöket
    }
  }

  const add = (e) => {
    e.preventDefault()
    const name = form.name.trim()
    if (!name) {
      setError('Skriv namnet på övningen.')
      return
    }
    if (items.length >= MAX_ITEMS) {
      setError(`Du kan lägga till högst ${MAX_ITEMS} extraövningar per pass.`)
      return
    }
    persist([...items, { id: Date.now(), name, sets: form.sets.trim(), reps: form.reps.trim(), note: form.note.trim() }])
    setForm(EMPTY)
    setError('')
  }

  const remove = (id) => persist(items.filter((it) => it.id !== id))
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  return (
    <div style={{ marginBottom: '35px' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '900', textTransform: 'uppercase', borderLeft: '4px solid #10b981', paddingLeft: '10px', color: '#111827', marginBottom: '6px' }}>
        Extra – dina egna övningar
      </h3>
      <p style={{ margin: '0 0 14px', fontSize: '0.85rem', color: '#4b5563' }}>
        Vill du träna mer efter de 60 minuterna? Lägg till egna övningar här. De sparas för den här dagen på den här enheten.
      </p>

      {items.length > 0 && (
        <div style={{ overflowX: 'auto', marginBottom: '14px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#ecfdf5', borderBottom: '2px solid #a7f3d0' }}>
                <th style={{ padding: '10px 14px' }}>Övning</th>
                <th style={{ padding: '10px 14px', width: '70px' }}>Set</th>
                <th style={{ padding: '10px 14px', width: '90px' }}>Reps</th>
                <th style={{ padding: '10px 14px' }}>Anteckning</th>
                <th style={{ padding: '10px 14px', width: '60px' }} aria-label="Ta bort"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td style={{ ...cell, fontWeight: 'bold', color: '#1f2937' }}>{it.name}</td>
                  <td style={cell}>{it.sets || '–'}</td>
                  <td style={cell}>{it.reps || '–'}</td>
                  <td style={{ ...cell, color: '#4b5563' }}>{it.note || '–'}</td>
                  <td style={cell}>
                    <button
                      type="button"
                      onClick={() => remove(it.id)}
                      aria-label={`Ta bort ${it.name}`}
                      title="Ta bort"
                      style={{ border: '1px solid #fecaca', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', width: '34px', height: '34px', cursor: 'pointer', fontSize: '1rem' }}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form onSubmit={add} style={{ display: 'grid', gridTemplateColumns: 'minmax(160px, 2fr) minmax(60px, 0.6fr) minmax(70px, 0.8fr) minmax(140px, 2fr) auto', gap: '8px', alignItems: 'end' }} className="custom-extras-form">
        <label style={{ fontSize: '0.75rem', color: '#374151', fontWeight: 600 }}>
          Övning
          <input style={input} value={form.name} onChange={set('name')} maxLength={60} placeholder="t.ex. Hammercurl" />
        </label>
        <label style={{ fontSize: '0.75rem', color: '#374151', fontWeight: 600 }}>
          Set
          <input style={input} value={form.sets} onChange={set('sets')} maxLength={4} inputMode="numeric" placeholder="3" />
        </label>
        <label style={{ fontSize: '0.75rem', color: '#374151', fontWeight: 600 }}>
          Reps
          <input style={input} value={form.reps} onChange={set('reps')} maxLength={12} placeholder="10–12" />
        </label>
        <label style={{ fontSize: '0.75rem', color: '#374151', fontWeight: 600 }}>
          Anteckning
          <input style={input} value={form.note} onChange={set('note')} maxLength={100} placeholder="Vikt, känsla…" />
        </label>
        <button type="submit" style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#10b981', color: '#fff', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          + Lägg till
        </button>
      </form>
      {error && <p role="alert" style={{ margin: '8px 0 0', color: '#b91c1c', fontSize: '0.82rem' }}>{error}</p>}
      <style>{`
        @media (max-width: 720px) {
          .custom-extras-form { grid-template-columns: 1fr 1fr !important; }
          .custom-extras-form label:first-child, .custom-extras-form label:nth-child(4), .custom-extras-form button { grid-column: 1 / -1; }
        }
      `}</style>
    </div>
  )
}
