'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getFlagUrl } from '@/lib/flags'
import type { Team } from '@/lib/types'

interface Props {
  userId: string
  league: { id: string; name: string }
  teams: Team[]
  existingTeamId: string | null
}

export default function CampeonForm({ userId, league, teams, existingTeamId }: Props) {
  const [selected, setSelected] = useState(existingTeamId ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const locked = !!existingTeamId

  const selectedTeam = teams.find(t => t.id === selected)

  async function handleSave() {
    if (!selected || locked) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('champion_predictions').insert({
      user_id: userId,
      league_id: league.id,
      team_id: selected,
    })
    setSaving(false)
    setSaved(true)
  }

  return (
    <div className="rounded-3xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${locked ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.1)'}`,
      }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="font-black text-sm">{league.name}</span>
        {locked ? (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24' }}>
            🔒 FIJO
          </span>
        ) : (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
            ● ABIERTO
          </span>
        )}
      </div>

      <div className="px-4 py-5">
        {/* Preview del equipo seleccionado */}
        {selectedTeam && (
          <div className="flex items-center gap-3 mb-4 p-3 rounded-2xl"
            style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getFlagUrl(selectedTeam.id)} alt={selectedTeam.name}
              style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)' }} />
            <div>
              <p className="font-black text-base">{selectedTeam.name}</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>{selectedTeam.confederation} · Grupo {selectedTeam.group_letter}</p>
            </div>
            <span className="ml-auto text-2xl">🏆</span>
          </div>
        )}

        {/* Selector */}
        {locked ? (
          <p className="text-center text-sm py-2" style={{ color: 'var(--muted)' }}>
            No se puede modificar una vez guardado
          </p>
        ) : (
          <>
            <select
              value={selected}
              onChange={e => setSelected(e.target.value)}
              className="w-full rounded-2xl px-4 py-3.5 text-sm font-semibold outline-none appearance-none mb-4"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: selected ? '#fff' : 'rgba(255,255,255,0.4)',
              }}
            >
              <option value="" style={{ background: '#1a2a4a', color: '#fff' }}>— Elegí el campeón —</option>
              {['A','B','C','D','E','F','G','H','I','J','K','L'].map(g => (
                <optgroup key={g} label={`Grupo ${g}`} style={{ background: '#1a2a4a' }}>
                  {teams.filter(t => t.group_letter === g).map(t => (
                    <option key={t.id} value={t.id} style={{ background: '#1a2a4a', color: '#fff' }}>
                      {t.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <button
              onClick={handleSave}
              disabled={!selected || saving || saved}
              className="w-full py-4 rounded-2xl font-black text-base active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              style={{
                background: saved ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: '#000',
                boxShadow: saved ? '0 0 20px rgba(34,197,94,0.4)' : '0 0 20px rgba(251,191,36,0.3)',
              }}
            >
              {saving ? '⏳ Guardando...' : saved ? '✅ ¡Guardado! No se puede cambiar' : '🏆 Guardar campeón'}
            </button>

            <p className="text-center text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
              ⚠️ Una vez guardado no se puede modificar
            </p>
          </>
        )}
      </div>
    </div>
  )
}
