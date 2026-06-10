'use client'

import { useState } from 'react'

interface Team { id: string; name: string }

export default function AdminChampion({ teams }: { teams: Team[] }) {
  const [teamId, setTeamId] = useState('')
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!teamId) return
    if (!window.confirm(`¿Confirmar ${teams.find(t => t.id === teamId)?.name} como campeón? Esto asignará +5 pts a quienes lo eligieron.`)) return
    setSaving(true); setError(''); setResult(null)
    const res = await fetch('/api/admin/set-champion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId }),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { setError(data.error ?? 'Error'); return }
    setResult(`✅ +5 pts asignados a ${data.rewarded} usuario${data.rewarded !== 1 ? 's' : ''}`)
  }

  return (
    <div style={{
      marginBottom: 24, padding: '14px 16px', borderRadius: 16,
      background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)',
    }}>
      <h2 style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: '#a855f7', marginBottom: 10 }}>
        🏆 Asignar Campeón (+5 pts)
      </h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <select
          value={teamId} onChange={e => setTeamId(e.target.value)}
          style={{
            flex: 1, padding: '10px 12px', borderRadius: 10, fontSize: 13, fontWeight: 700,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', outline: 'none',
          }}>
          <option value="">Elegir equipo campeón...</option>
          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <button
          onClick={handleSave} disabled={!teamId || saving}
          style={{
            padding: '10px 16px', borderRadius: 10, fontWeight: 900, fontSize: 12,
            background: 'linear-gradient(135deg, #a855f7, #7c3aed)', color: '#fff',
            border: 'none', cursor: 'pointer', flexShrink: 0, opacity: !teamId ? 0.4 : 1,
          }}>
          {saving ? '...' : 'Confirmar'}
        </button>
      </div>
      {result && <p style={{ color: '#22c55e', fontSize: 12, marginTop: 8, marginBottom: 0 }}>{result}</p>}
      {error && <p style={{ color: '#f87171', fontSize: 12, marginTop: 8, marginBottom: 0 }}>{error}</p>}
    </div>
  )
}
