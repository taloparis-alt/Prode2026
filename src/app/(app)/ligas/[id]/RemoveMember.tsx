'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RemoveMember({ leagueId, userId, name }: { leagueId: string; userId: string; name: string }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleRemove() {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('league_members').delete().eq('league_id', leagueId).eq('user_id', userId)
    setLoading(false)
    if (error) {
      alert('Error: ' + error.message)
      setConfirming(false)
      return
    }
    setConfirming(false)
    router.refresh()
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
