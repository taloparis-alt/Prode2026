'use client'

import { useState } from 'react'

interface Props {
  leagueId: string
  userId: string
  name: string
}

export default function RemoveMember({ leagueId, userId, name }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleRemove() {
    setLoading(true)
    const res = await fetch('/api/remove-member', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leagueId, userId }),
    })
    const data = await res.json()
    if (!res.ok) {
      alert('Error: ' + data.error)
      setLoading(false)
      setConfirming(false)
      return
    }
    window.location.reload()
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <button onClick={handleRemove} disabled={loading}
          className="text-[10px] font-black px-2 py-1 rounded-lg"
          style={{ background: 'rgba(239,68,68,0.3)', color: '#f87171', border: '1px solid rgba(239,68,68,0.5)' }}>
          {loading ? '...' : '✓ Sí'}
        </button>
        <button onClick={() => setConfirming(false)}
          className="text-[10px] font-black px-2 py-1 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
          No
        </button>
      </div>
    )
  }

  return (
    <button onClick={() => setConfirming(true)}
      className="text-[11px] font-black px-2 py-1 rounded-lg transition-all active:scale-90"
      style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
      title={`Eliminar a ${name}`}>
      ✕
    </button>
  )
}
