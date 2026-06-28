'use client'

import { useState } from 'react'
import { stageLabel } from '@/lib/stages'

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
  winner_team_id: string | null
}

const KO_ROUNDS: { key: string; label: string }[] = [
  { key: 'r32',   label: '16avos' },
  { key: 'r16',   label: 'Octavos' },
  { key: 'qf',    label: 'Cuartos' },
  { key: 'sf',    label: 'Semis' },
  { key: 'third', label: '3er P.' },
  { key: 'final', label: 'Final' },
]

function MatchRow({ match }: { match: Match }) {
  const [homeScore, setHomeScore] = useState(match.home_score ?? 0)
  const [awayScore, setAwayScore] = useState(match.away_score ?? 0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [winner, setWinner] = useState<string | null>(match.winner_team_id ?? null)

  const isFinished = match.status === 'finished'
  const isKo = match.stage !== 'group'
  const needWinner = isKo && homeScore === awayScore   // empate en eliminatoria => penales
  const date = new Date(match.match_date).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'America/Argentina/Buenos_Aires' })

  async function handleSave() {
    setSaving(true); setError(''); setSaved(false)
    const res = await fetch('/api/admin/update-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId: match.id, homeScore, awayScore, winnerTeamId: needWinner ? winner : null }),
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
          {stageLabel(match.stage, match.group_letter)} · {date}
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

      {/* Empate en eliminatoria: definir quién avanzó por penales */}
      {needWinner && (
        <div style={{ marginTop: 10, padding: '8px 10px', borderRadius: 10, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
          <p style={{ fontSize: 10, fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 6px' }}>
            Empate · ¿Quién avanzó por penales?
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            {[{ id: match.home_team_id, name: match.home_team.name }, { id: match.away_team_id, name: match.away_team.name }].map(({ id, name }) => {
              const sel = winner === id
              return (
                <button key={id} onClick={() => setWinner(id)}
                  style={{
                    flex: 1, padding: '7px 8px', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase',
                    background: sel ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'rgba(255,255,255,0.06)',
                    border: sel ? '1px solid transparent' : '1px solid rgba(255,255,255,0.15)',
                    color: sel ? '#000' : 'rgba(255,255,255,0.7)',
                  }}>
                  {sel ? '✓ ' : ''}{name}
                </button>
              )
            })}
          </div>
          {!winner && (
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', margin: '6px 0 0' }}>
              Elegí quién pasó para que se complete la llave siguiente.
            </p>
          )}
        </div>
      )}

      {error && <p style={{ color: '#f87171', fontSize: 11, marginTop: 6, marginBottom: 0 }}>{error}</p>}
    </div>
  )
}

function counter(ms: Match[]): string {
  const done = ms.filter(m => m.status === 'finished').length
  return `${done}/${ms.length}`
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
  const groupLetters = Object.keys(byGroup).sort((a, b) => a.localeCompare(b))

  const byRound: Record<string, Match[]> = {}
  for (const m of ko) {
    if (!byRound[m.stage]) byRound[m.stage] = []
    byRound[m.stage].push(m)
  }
  const roundsAvail = KO_ROUNDS.filter(r => (byRound[r.key]?.length ?? 0) > 0)

  const [tab, setTab] = useState<'groups' | 'ko'>('groups')
  const [selGroup, setSelGroup] = useState<string>(groupLetters[0] ?? '')
  const [selRound, setSelRound] = useState<string>(roundsAvail[0]?.key ?? 'r32')

  const shown = tab === 'groups' ? (byGroup[selGroup] ?? []) : (byRound[selRound] ?? [])

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, padding: 4, borderRadius: 16, background: 'rgba(0,0,0,0.25)' }}>
        {([['groups', '🌎 Grupos'], ['ko', '⚡ Eliminatorias']] as const).map(([key, label]) => {
          const active = tab === key
          return (
            <button key={key} onClick={() => setTab(key)}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 12, fontWeight: 900, fontSize: 13, border: 'none', cursor: 'pointer',
                background: active ? (key === 'groups' ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'linear-gradient(135deg, #f59e0b, #ef4444)') : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.45)',
              }}>
              {label}
            </button>
          )
        })}
      </div>

      {/* Pills */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 14 }}>
        {tab === 'groups'
          ? groupLetters.map(letter => {
              const active = selGroup === letter
              return (
                <button key={letter} onClick={() => setSelGroup(letter)}
                  style={{
                    flexShrink: 0, minWidth: 52, padding: '8px 6px', borderRadius: 14, cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                    background: active ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'rgba(255,255,255,0.06)',
                    border: active ? '1px solid transparent' : '1px solid rgba(255,255,255,0.1)',
                    color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                  }}>
                  <span style={{ fontSize: 16, fontWeight: 900, lineHeight: 1 }}>{letter}</span>
                  <span style={{ fontSize: 9, fontWeight: 700 }}>{counter(byGroup[letter])}</span>
                </button>
              )
            })
          : roundsAvail.length === 0
            ? <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', padding: '8px 4px' }}>Todavía no hay eliminatorias cargadas.</span>
            : roundsAvail.map(({ key, label }) => {
                const active = selRound === key
                return (
                  <button key={key} onClick={() => setSelRound(key)}
                    style={{
                      flexShrink: 0, padding: '8px 14px', borderRadius: 14, cursor: 'pointer', whiteSpace: 'nowrap',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                      background: active ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : 'rgba(255,255,255,0.06)',
                      border: active ? '1px solid transparent' : '1px solid rgba(255,255,255,0.1)',
                      color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                    }}>
                    <span style={{ fontSize: 13, fontWeight: 900, lineHeight: 1 }}>{label}</span>
                    <span style={{ fontSize: 9, fontWeight: 700 }}>{counter(byRound[key])}</span>
                  </button>
                )
              })}
      </div>

      {/* Partidos del segmento seleccionado */}
      <div>
        {shown.map(m => <MatchRow key={m.id} match={m} />)}
      </div>
    </div>
  )
}
