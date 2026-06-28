'use client'

import { useState } from 'react'

interface Match {
  id: string
  home_team_id: string
  away_team_id: string
  home_team: { name: string }
  away_team: { name: string }
  home_score: number | null
  away_score: number | null
  status: string
  match_date: string
  group_letter: string | null
  stage: string
  sort_order: number
}

function MatchRow({ match }: { match: Match }) {
  const [homeScore, setHomeScore] = useState(match.home_score ?? 0)
  const [awayScore, setAwayScore] = useState(match.away_score ?? 0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const isFinished = match.status === 'finished'
  const date = new Date(match.match_date).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'America/Argentina/Buenos_Aires' })

  async function handleSave() {
    setSaving(true); setError(''); setSaved(false)
    const res = await fetch('/api/admin/update-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId: match.id, homeScore, awayScore }),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { setError(data.error ?? 'Error'); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{
      background: isFinished ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.05)',
      border: `1px solid ${isFinished ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
      borderRadius: 16, padding: '12px 14px', marginBottom: 8,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>
          {match.stage === 'group' ? `Grupo ${match.group_letter}` : match.stage} · {date}
        </span>
        {isFinished && (
          <span style={{ fontSize: 10, fontWeight: 900, color: '#22c55e', background: 'rgba(34,197,94,0.15)', padding: '2px 8px', borderRadius: 20 }}>✓ Finalizado</span>
        )}
      </div>

      {/* Teams + Scores */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ flex: 1, fontSize: 13, fontWeight: 700, textAlign: 'right', textTransform: 'uppercase' }}>{match.home_team.name}</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            type="number" min={0} max={20} value={homeScore}
            onChange={e => setHomeScore(Math.max(0, parseInt(e.target.value) || 0))}
            style={{ width: 48, height: 44, textAlign: 'center', fontSize: 22, fontWeight: 900, background: 'rgba(59,130,246,0.15)', border: '2px solid rgba(59,130,246,0.4)', borderRadius: 10, color: '#fff', outline: 'none' }}
          />
          <span style={{ fontSize: 18, fontWeight: 900, color: 'rgba(255,255,255,0.3)' }}>-</span>
          <input
            type="number" min={0} max={20} value={awayScore}
            onChange={e => setAwayScore(Math.max(0, parseInt(e.target.value) || 0))}
            style={{ width: 48, height: 44, textAlign: 'center', fontSize: 22, fontWeight: 900, background: 'rgba(59,130,246,0.15)', border: '2px solid rgba(59,130,246,0.4)', borderRadius: 10, color: '#fff', outline: 'none' }}
          />
        </div>

        <span style={{ flex: 1, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>{match.away_team.name}</span>

        <button
          onClick={handleSave} disabled={saving}
          style={{
            padding: '8px 14px', borderRadius: 10, fontWeight: 900, fontSize: 12, cursor: 'pointer', border: 'none',
            background: saved ? '#22c55e' : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            color: '#000', flexShrink: 0,
          }}>
          {saving ? '...' : saved ? '✓' : 'Guardar'}
        </button>
      </div>

      {error && <p style={{ color: '#f87171', fontSize: 11, marginTop: 6, marginBottom: 0 }}>{error}</p>}
    </div>
  )
}

export default function AdminMatchList({ matches }: { matches: Match[] }) {
  const groups = matches.filter(m => m.stage === 'group')
  const ko = matches.filter(m => m.stage !== 'group')

  const byGroup: Record<string, Match[]> = {}
  for (const m of groups) {
    const k = m.group_letter ?? 'X'
    if (!byGroup[k]) byGroup[k] = []
    byGroup[k].push(m)
  }

  return (
    <div>
      {Object.entries(byGroup).sort(([a], [b]) => a.localeCompare(b)).map(([letter, ms]) => (
        <div key={letter} style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
            Grupo {letter}
          </h2>
          {ms.map(m => <MatchRow key={m.id} match={m} />)}
        </div>
      ))}
      {ko.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
            Eliminatorias
          </h2>
          {ko.map(m => <MatchRow key={m.id} match={m} />)}
        </div>
      )}
    </div>
  )
}
