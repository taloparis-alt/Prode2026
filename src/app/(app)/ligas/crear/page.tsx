'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function genCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default function CrearLigaPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const code = genCode()
    const { data: league, error: err } = await supabase
      .from('leagues')
      .insert({ name, code, created_by: user.id })
      .select()
      .single()

    if (err) { setError(err.message); setLoading(false); return }

    await supabase.from('league_members').insert({ league_id: league.id, user_id: user.id })
    router.push(`/ligas/${league.id}`)
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <h1 className="text-xl font-bold mb-6">Crear liga</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" style={{ color: 'var(--muted)' }}>Nombre de la liga</label>
          <input
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            placeholder="Ej: Prode de la oficina"
          />
        </div>

        {error && <p className="text-sm" style={{ color: 'var(--accent2)' }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          {loading ? 'Creando...' : 'Crear liga'}
        </button>
      </form>
    </div>
  )
}
