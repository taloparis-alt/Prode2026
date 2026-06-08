'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Team, Prediction } from '@/lib/types'

interface Props {
  matchId: string
  userId: string
  prediction: Prediction | null
  isLocked: boolean
  homeTeam: Team
  awayTeam: Team
}

export default function PredictionForm({ matchId, userId, prediction, isLocked, homeTeam, awayTeam }: Props) {
  const router = useRouter()
  const [home, setHome] = useState(prediction?.home_score ?? 0)
  const [away, setAway] = useState(prediction?.away_score ?? 0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('predictions').upsert(
      { user_id: userId, match_id: matchId, home_score: home, away_score: away },
      { onConflict: 'user_id,match_id' }
    )
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  if (isLocked) {
    return (
      <div className="rounded-3xl p-6 text-center"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <p className="text-4xl mb-3">🔒</p>
        <p className="text-lg font-bold">Pronóstico cerrado</p>
        {prediction ? (
          <div className="mt-4">
            <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>Tu pronóstico</p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-3xl">{homeTeam.flag}</div>
                <div className="text-2xl font-black mt-1">{prediction.home_score}</div>
              </div>
              <span className="text-2xl font-black" style={{ color: 'var(--muted)' }}>-</span>
              <div className="text-center">
                <div className="text-3xl">{awayTeam.flag}</div>
                <div className="text-2xl font-black mt-1">{prediction.away_score}</div>
              </div>
            </div>
            {prediction.points !== null && (
              <div className="mt-4 text-2xl font-black"
                style={{ color: prediction.points > 0 ? 'var(--green)' : 'var(--accent2)' }}>
                {prediction.points > 0 ? `+${prediction.points} puntos` : 'Sin puntos'}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>No cargaste pronóstico</p>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-3xl p-6"
      style={{ background: 'var(--card)', backdropFilter: 'blur(10px)', border: '1px solid var(--border)' }}>
      <h2 className="text-center text-lg font-bold mb-6">Tu pronóstico</h2>

      <div className="flex items-center justify-center gap-6">
        {/* Home team */}
        <div className="flex flex-col items-center gap-3 flex-1">
          <span className="text-5xl">{homeTeam.flag}</span>
          <span className="text-sm font-bold text-center">{homeTeam.name}</span>
          <div className="flex items-center gap-3">
            <button onClick={() => setHome(Math.max(0, home - 1))}
              className="w-12 h-12 rounded-2xl text-2xl font-bold active:scale-95 transition-transform flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border)' }}>
              −
            </button>
            <input
              type="number"
              min={0}
              max={20}
              value={home}
              onChange={e => setHome(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-16 h-16 rounded-2xl text-3xl font-black text-center outline-none"
              style={{ background: 'rgba(79,142,247,0.2)', border: '2px solid var(--accent)', color: '#fff' }}
            />
            <button onClick={() => setHome(home + 1)}
              className="w-12 h-12 rounded-2xl text-2xl font-bold active:scale-95 transition-transform flex items-center justify-center"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl font-black" style={{ color: 'var(--muted)' }}>VS</span>
        </div>

        {/* Away team */}
        <div className="flex flex-col items-center gap-3 flex-1">
          <span className="text-5xl">{awayTeam.flag}</span>
          <span className="text-sm font-bold text-center">{awayTeam.name}</span>
          <div className="flex items-center gap-3">
            <button onClick={() => setAway(Math.max(0, away - 1))}
              className="w-12 h-12 rounded-2xl text-2xl font-bold active:scale-95 transition-transform flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border)' }}>
              −
            </button>
            <input
              type="number"
              min={0}
              max={20}
              value={away}
              onChange={e => setAway(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-16 h-16 rounded-2xl text-3xl font-black text-center outline-none"
              style={{ background: 'rgba(79,142,247,0.2)', border: '2px solid var(--accent)', color: '#fff' }}
            />
            <button onClick={() => setAway(away + 1)}
              className="w-12 h-12 rounded-2xl text-2xl font-bold active:scale-95 transition-transform flex items-center justify-center"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              +
            </button>
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="w-full mt-8 py-5 rounded-2xl font-black text-lg transition-all active:scale-95 disabled:opacity-50"
        style={{ background: saved ? 'var(--green)' : 'var(--accent)', color: '#fff' }}>
        {saving ? 'Guardando...' : saved ? '✓ ¡Guardado!' : prediction ? 'Actualizar pronóstico' : 'Guardar pronóstico'}
      </button>

      <p className="text-center text-xs mt-3" style={{ color: 'var(--muted)' }}>
        🔒 Cierra 30 minutos antes del partido
      </p>
    </div>
  )
}
