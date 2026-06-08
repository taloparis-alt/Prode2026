'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RecuperarPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nueva-contrasena`,
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0f1729 0%, #162040 50%, #0f1729 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] opacity-[0.03] select-none">🔑</div>
      </div>

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🔑</div>
          <h1 className="text-2xl font-black">Recuperar contraseña</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Te enviamos un link al email</p>
        </div>

        <div className="rounded-3xl p-6"
          style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)' }}>
          {sent ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">📧</div>
              <p className="font-bold text-lg">¡Listo! Revisá tu email</p>
              <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>
                Te mandamos un link para restablecer tu contraseña a <strong>{email}</strong>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--muted)' }}>Tu email</label>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-2xl px-4 py-4 text-base outline-none"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                  placeholder="tu@email.com"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-2xl font-black text-lg active:scale-95 transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #4f8ef7, #6c63ff)', color: '#fff' }}>
                {loading ? 'Enviando...' : 'Enviar link'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-base mt-6" style={{ color: 'var(--muted)' }}>
          <Link href="/login" className="font-black text-white">← Volver al login</Link>
        </p>
      </div>
    </div>
  )
}
