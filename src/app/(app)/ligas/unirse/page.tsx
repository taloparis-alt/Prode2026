'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Suspense } from 'react'

function UnirseForms() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const c = searchParams.get('codigo')
    if (c) setCode(c.toUpperCase())
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: league } = await supabase.from('leagues').select('id').eq('code', code.toUpperCase()).single()
    if (!league) { setError('Código inválido'); setLoading(false); return }

    const { error: err } = await supabase.from('league_members').insert({ league_id: league.id, user_id: user.id })
    if (err && err.code !== '23505') { setError('No se pudo unir'); setLoading(false); return }

    router.push(`/ligas/${league.id}`)
  }

  return (
    <div className="max-w-sm mx-auto px-4 pt-12">
      <div className="text-center mb-8">
        <span style={{ fontSize: 64 }}>🔗</span>
        <h1 className="text-2xl font-black mt-3">Unirse a una liga</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Ingresá el código que te compartieron</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required value={code} onChange={e => setCode(e.target.value.toUpperCase())}
          maxLength={6}
          className="w-full rounded-2xl text-center font-black outline-none tracking-widest"
          style={{
            padding: '20px 16px', fontSize: 32,
            background: 'rgba(255,255,255,0.07)', border: '2px solid rgba(255,255,255,0.15)', color: '#fff',
            letterSpacing: 8,
          }}
          placeholder="ABC123"
        />

        {error && <p className="text-sm text-center py-2 rounded-xl" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171' }}>{error}</p>}

        <button type="submit" disabled={loading || code.length < 6}
          className="w-full py-4 rounded-2xl font-black text-lg active:scale-95 transition-all disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', boxShadow: '0 4px 20px rgba(59,130,246,0.35)' }}>
          {loading ? 'Buscando...' : 'Unirse'}
        </button>
      </form>
    </div>
  )
}

export default function UnirsePage() {
  return (
    <Suspense>
      <UnirseForms />
    </Suspense>
  )
}
