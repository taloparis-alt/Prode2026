'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getFlagUrl } from '@/lib/flags'
import type { Team } from '@/lib/types'

interface Props {
  userId: string
  teams: Team[]
  existingTeamId: string | null
}

// 30 min antes del primer partido: MEX vs RSA, 11/06/2026 19:00 UTC
const CHAMPION_DEADLINE = new Date('2026-06-11T18:30:00Z')

export default function ChampionSection({ userId, teams, existingTeamId }: Props) {
  const [selected, setSelected] = useState(existingTeamId ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(!!existingTeamId)
  const deadlinePassed = new Date() >= CHAMPION_DEADLINE
  const locked = saved || deadlinePassed

  const selectedTeam = teams.find(t => t.id === selected)

  async function handleSave() {
    if (!selected || locked) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('user_champion_picks').upsert({ user_id: userId, team_id: selected })
    setSaving(false)
    if (error) { alert('Error al guardar, intentá de nuevo'); return }
    setSaved(true)
  }

  return (
    <div>
      <h2 className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: 'var(--accent3)' }}>
        🏆 Tu candidato a campeón
      </h2>

      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${locked ? 'rgba(251,191,36,0.35)' : 'rgba(255,255,255,0.1)'}` }}>

        <div className="flex items-center justify-between px-4 py-2.5"
          style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-black uppercase tracking-wide">Campeón Mundial 2026</span>
          {saved
            ? <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24' }}>🔒 FIJO</span>
            : deadlinePassed
            ? <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: 'rgba(248,113,113,0.2)', color: '#f87171' }}>🔒 CERRADO</span>
            : <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>ABIERTO</span>}
        </div>

        <div className="px-4 py-4">
          {locked && selectedTeam ? (
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getFlagUrl(selectedTeam.id)} alt={selectedTeam.name}
                style={{ width: 64, height: 43, objectFit: 'cover', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }} />
              <div>
                <p className="font-black text-lg" style={{ textTransform: 'uppercase' }}>{selectedTeam.name}</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>Tu candidato a campeón 🏆</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Aplica a todas tus ligas</p>
              </div>
            </div>
          ) : locked && !selectedTeam ? (
            <div className="text-center py-3">
              <p style={{ fontSize: 32 }}>🔒</p>
              <p className="font-black text-sm mt-1" style={{ color: '#f87171' }}>Tiempo agotado</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>El plazo para elegir campeón ya cerró</p>
            </div>
          ) : (
            <>
              <select value={selected} onChange={e => setSelected(e.target.value)}
                className="w-full rounded-xl px-3 py-3 text-sm font-semibold outline-none appearance-none mb-3"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: selected ? '#fff' : 'rgba(255,255,255,0.35)' }}>
                <option value="" style={{ background: '#1a2a4a' }}>— Elegí tu candidato —</option>
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

              <button onClick={handleSave} disabled={!selected || saving}
                className="w-full py-3.5 rounded-xl font-black text-sm active:scale-95 transition-all disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#000', boxShadow: '0 4px 16px rgba(251,191,36,0.3)' }}>
                {saving ? '⏳ Guardando...' : '🏆 Guardar candidato'}
              </button>
              <p className="text-center text-[10px] mt-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
                ⚠️ No se puede cambiar una vez guardado · Cierra el 11/06 a las 15:30hs
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
