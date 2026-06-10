'use client'

import { useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Match } from '@/lib/types'
import TeamFlag from '@/components/TeamFlag'
import ClosingWarning from '@/components/ClosingWarning'
import LocalTime from '@/components/LocalTime'

const STAGE_LABELS: Record<string, string> = {
  r32: '⚡ Octavos de Final',
  r16: '⚡ Cuartos de Final',
  sf: '🔥 Semifinales',
  final: '🏆 Final',
}

function ScoreInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(value + 1)}
        className="rounded-xl text-xl font-black flex items-center justify-center active:scale-90 transition-transform"
        style={{ width: 36, height: 36, background: 'rgba(59,130,246,0.5)', color: '#fff', border: '1px solid rgba(59,130,246,0.7)', flexShrink: 0 }}
      >+</button>
      <input
        type="number" min={0} max={20} value={value}
        onChange={e => onChange(Math.max(0, parseInt(e.target.value) || 0))}
        className="text-center outline-none font-black"
        style={{
          width: 48, height: 52, fontSize: 28,
          background: 'rgba(59,130,246,0.15)',
          border: '2px solid rgba(59,130,246,0.5)',
          borderRadius: 12, color: '#fff', flexShrink: 0,
        }}
      />
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="rounded-xl text-xl font-black flex items-center justify-center active:scale-90 transition-transform"
        style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }}
      >−</button>
    </div>
  )
}

function SaveButton({ saving, saved, hasPred, onClick }: { saving: boolean; saved: boolean; hasPred: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick} disabled={saving}
      className="w-full mt-5 py-4 rounded-2xl font-black text-base active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      style={{
        background: saved
          ? 'linear-gradient(135deg, #22c55e, #16a34a)'
          : hasPred
          ? 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(99,102,241,0.3))'
          : 'linear-gradient(135deg, #3b82f6, #6366f1)',
        border: saved ? '1px solid #22c55e' : hasPred ? '1px solid rgba(59,130,246,0.5)' : 'none',
        color: '#fff',
        boxShadow: saved ? '0 0 20px rgba(34,197,94,0.4)' : !hasPred ? '0 0 20px rgba(59,130,246,0.3)' : 'none',
      }}
    >
      {saving ? '⏳ Guardando...' : saved ? '✅ ¡Guardado!' : hasPred ? '✏️ Actualizar' : '💾 Guardar pronóstico'}
    </button>
  )
}

interface CachedPred { home: number; away: number }

function MatchCard({ match, userId, cachedPred, onSaved }: {
  match: Match; userId: string
  cachedPred?: CachedPred
  onSaved: (matchId: string, home: number, away: number) => void
}) {
  const pred = match.user_prediction
  const deadline = new Date(match.match_date ?? '')
  deadline.setMinutes(deadline.getMinutes() - 30)
  const isLocked = new Date() >= deadline || match.status === 'finished'

  const initHome = cachedPred?.home ?? pred?.home_score ?? 0
  const initAway = cachedPred?.away ?? pred?.away_score ?? 0

  const [home, setHome] = useState(initHome)
  const [away, setAway] = useState(initAway)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [hasPred, setHasPred] = useState(!!(pred || cachedPred))

  const save = useCallback(async () => {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('predictions').upsert(
      { user_id: userId, match_id: match.id, home_score: home, away_score: away },
      { onConflict: 'user_id,match_id' }
    )
    setSaving(false)
    if (error) {
      alert('Error al guardar, intentá de nuevo')
      return
    }
    setSaved(true); setHasPred(true)
    onSaved(match.id, home, away)
    setTimeout(() => setSaved(false), 2000)
  }, [userId, match.id, home, away, onSaved])

  const points = pred?.points
  const ptColor = points === 4 ? '#22c55e' : points === 3 ? '#f59e0b' : '#f87171'

  return (
    <div className="rounded-3xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${hasPred && !isLocked ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.1)'}`,
        boxShadow: hasPred && !isLocked ? '0 4px 24px rgba(59,130,246,0.1)' : 'none',
      }}>
      {/* Cabecera */}
      <div className="flex items-center justify-between px-4 py-2.5"
        style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>
          <LocalTime dateStr={match.match_date ?? ''} />
        </span>
        {match.status === 'finished' && (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>FINALIZADO</span>
        )}
        {isLocked && match.status !== 'finished' && (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: 'rgba(248,113,113,0.2)', color: '#f87171' }}>🔒 CERRADO</span>
        )}
        {!isLocked && (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>● ABIERTO</span>
        )}
      </div>

      <div className="px-4 py-5">
        {match.status === 'finished' ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 flex justify-center"><TeamFlag teamId={match.home_team_id} teamName={match.home_team?.name ?? ''} size="lg" /></div>
            <div className="flex flex-col items-center gap-1 min-w-[5.5rem]">
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.4)' }}>Resultado</span>
              <span style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1 }}>{match.home_score} - {match.away_score}</span>
              {points !== null && points !== undefined && (
                <span className="text-sm font-black px-3 py-1 rounded-full" style={{ background: ptColor, color: '#fff' }}>+{points} pts</span>
              )}
              {pred ? (
                <div style={{ marginTop: 4, padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block' }}>Mi pronóstico</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: 'rgba(255,255,255,0.7)' }}>{pred.home_score} - {pred.away_score}</span>
                </div>
              ) : (
                <span className="text-[10px]" style={{ color: '#f87171', marginTop: 4 }}>Sin pronóstico</span>
              )}
            </div>
            <div className="flex-1 flex justify-center"><TeamFlag teamId={match.away_team_id} teamName={match.away_team?.name ?? ''} size="lg" /></div>
          </div>
        ) : isLocked ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 flex justify-center"><TeamFlag teamId={match.home_team_id} teamName={match.home_team?.name ?? ''} size="lg" /></div>
            <div className="flex flex-col items-center gap-2 min-w-[5rem]">
              <span className="text-3xl">🔒</span>
              {pred ? <span style={{ fontSize: 28, fontWeight: 900 }}>{pred.home_score} - {pred.away_score}</span>
                    : <span className="text-xs text-center" style={{ color: '#f87171' }}>Sin pronóstico</span>}
            </div>
            <div className="flex-1 flex justify-center"><TeamFlag teamId={match.away_team_id} teamName={match.away_team?.name ?? ''} size="lg" /></div>
          </div>
        ) : (
          <>
            {/* Banderas arriba */}
            <div className="flex items-center justify-around mb-3">
              <div className="flex-1 flex justify-center">
                <TeamFlag teamId={match.home_team_id} teamName={match.home_team?.name ?? ''} size="lg" />
              </div>
              <span style={{ fontSize: 20, fontWeight: 900, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>VS</span>
              <div className="flex-1 flex justify-center">
                <TeamFlag teamId={match.away_team_id} teamName={match.away_team?.name ?? ''} size="lg" />
              </div>
            </div>
            {/* Inputs abajo centrados */}
            <div className="flex items-center justify-center gap-3">
              <ScoreInput value={home} onChange={setHome} />
              <span style={{ fontSize: 22, fontWeight: 900, color: 'rgba(255,255,255,0.3)' }}>–</span>
              <ScoreInput value={away} onChange={setAway} />
            </div>
            <ClosingWarning matchDate={match.match_date ?? ''} />
            <SaveButton saving={saving} saved={saved} hasPred={hasPred} onClick={save} />
          </>
        )}
      </div>
    </div>
  )
}

interface Props {
  groups: Record<string, Match[]>
  groupMatches: string[]
  koMatches: string[]
  userId: string
}

export default function MatchList({ groups, groupMatches, koMatches, userId }: Props) {
  const searchParams = useSearchParams()
  const initialGroup = searchParams.get('grupo')
    ? `group_${searchParams.get('grupo')}`
    : groupMatches[0] ?? ''
  const [activeTab, setActiveTab] = useState<'groups' | 'ko'>('groups')
  const [selectedGroup, setSelectedGroup] = useState<string>(initialGroup)
  const groupLetters = groupMatches.map(k => k.replace('group_', ''))
  const [predCache, setPredCache] = useState<Record<string, CachedPred>>({})
  const [visibleUpcoming, setVisibleUpcoming] = useState(5)

  const handleSaved = useCallback((matchId: string, home: number, away: number) => {
    setPredCache(prev => ({ ...prev, [matchId]: { home, away } }))
  }, [])

  // Todos los partidos no terminados, ordenados por fecha
  const upcomingMatches = Object.values(groups).flat()
    .filter(m => m.status !== 'finished')
    .sort((a, b) => new Date(a.match_date ?? '').getTime() - new Date(b.match_date ?? '').getTime())
    // dedup por id
    .filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i)

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-5 p-1 rounded-2xl" style={{ background: 'rgba(0,0,0,0.25)' }}>
        {(['groups', 'ko'] as const).map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="flex-1 py-3 rounded-xl text-sm font-black transition-all"
            style={{
              background: activeTab === tab
                ? i === 0 ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'linear-gradient(135deg, #f59e0b, #ef4444)'
                : 'transparent',
              color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.4)',
              boxShadow: activeTab === tab ? `0 4px 14px ${i === 0 ? 'rgba(59,130,246,0.35)' : 'rgba(245,158,11,0.35)'}` : 'none',
            }}>
            {tab === 'groups' ? '🌎 Grupos' : '⚡ Eliminatorias'}
          </button>
        ))}
      </div>

      {activeTab === 'groups' && (
        <>
          {/* Pills de grupo */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-5" style={{ scrollbarWidth: 'none' }}>
            {groupLetters.map(letter => {
              const key = `group_${letter}`
              const open = (groups[key] ?? []).filter(m => m.status !== 'finished')
              const done = open.filter(m => m.user_prediction).length
              const total = open.length
              const allDone = total > 0 && done >= total
              const isActive = selectedGroup === key
              return (
                <button key={letter} onClick={() => setSelectedGroup(key)}
                  className="flex-shrink-0 flex flex-col items-center gap-1 rounded-2xl transition-all active:scale-95"
                  style={{
                    minWidth: 52, padding: '10px 8px',
                    background: isActive ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
                      : allDone ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.07)',
                    border: isActive ? '1px solid transparent'
                      : allDone ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.1)',
                    boxShadow: isActive ? '0 4px 16px rgba(59,130,246,0.4)' : 'none',
                    color: isActive ? '#fff' : allDone ? '#22c55e' : 'rgba(255,255,255,0.5)',
                  }}>
                  <span style={{ fontSize: 18, fontWeight: 900, lineHeight: 1 }}>{letter}</span>
                  <span style={{ fontSize: 9, fontWeight: 700 }}>{allDone ? '✓' : `${done}/${total}`}</span>
                </button>
              )
            })}
          </div>

          <div className="space-y-4">
            {(groups[selectedGroup] ?? []).map(m => <MatchCard key={m.id} match={m} userId={userId} cachedPred={predCache[m.id]} onSaved={handleSaved} />)}
          </div>
        </>
      )}

      {activeTab === 'ko' && (
        <div className="space-y-6">
          {koMatches.length === 0 ? (
            <div className="text-center py-16" style={{ color: 'var(--muted)' }}>
              <p style={{ fontSize: 56 }}>⏳</p>
              <p className="font-black text-base mt-3">Se define al terminar la fase de grupos</p>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Del 28 de junio en adelante</p>
            </div>
          ) : koMatches.map(key => (
            <section key={key}>
              <h2 className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: 'var(--accent3)' }}>
                {STAGE_LABELS[key] ?? key}
              </h2>
              <div className="space-y-4">
                {groups[key].map(m => <MatchCard key={m.id} match={m} userId={userId} cachedPred={predCache[m.id]} onSaved={handleSaved} />)}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Próximos partidos */}
      {upcomingMatches.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
            📅 Próximos partidos
          </h2>
          <div className="space-y-4">
            {upcomingMatches.slice(0, visibleUpcoming).map(m => (
              <MatchCard key={m.id} match={m} userId={userId} cachedPred={predCache[m.id]} onSaved={handleSaved} />
            ))}
          </div>
          {visibleUpcoming < upcomingMatches.length && (
            <button
              onClick={() => setVisibleUpcoming(v => v + 5)}
              className="w-full mt-4 py-3 rounded-2xl font-black text-sm active:scale-95 transition-all"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}>
              Ver más partidos ({upcomingMatches.length - visibleUpcoming} restantes)
            </button>
          )}
        </div>
      )}
    </div>
  )
}
