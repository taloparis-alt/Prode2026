'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export default function NuevaContrasenaPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [authError, setAuthError] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Validar el link de recuperación y establecer la sesión
  useEffect(() => {
    const supabase = createClient()
    let active = true

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && active) { setReady(true); setAuthError('') }
    })

    async function init() {
      const params = new URLSearchParams(window.location.search)
      const token_hash = params.get('token_hash')
      const type = params.get('type') as EmailOtpType | null

      // Flujo recomendado: token_hash (funciona en cualquier dispositivo)
      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ type, token_hash })
        if (active && error) setAuthError('El link expiró o ya fue usado. Pedí uno nuevo desde "¿Olvidaste tu contraseña?".')
        return
      }

      // Fallback: el cliente puede haber procesado un code/hash automáticamente
      const { data: { session } } = await supabase.auth.getSession()
      if (active && session) { setReady(true); return }

      // Dar un instante por si todavía está procesando la URL
      setTimeout(async () => {
        if (!active) return
        const { data: { session } } = await supabase.auth.getSession()
        if (session) setReady(true)
        else setAuthError('El link expiró o se abrió en otro navegador. Pedí uno nuevo desde "¿Olvidaste tu contraseña?".')
      }, 1500)
    }

    init()
    return () => { active = false; subscription.unsubscribe() }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return }
    setLoading(true); setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) { setError('No se pudo cambiar la contraseña. Probá de nuevo.'); return }
    setDone(true)
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
          <h1 className="text-2xl font-black">Nueva contraseña</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Elegí tu nueva contraseña</p>
        </div>

        <div className="rounded-3xl p-6"
          style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)' }}>

          {done ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">✅</div>
              <p className="font-bold text-lg">¡Contraseña actualizada!</p>
              <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Ya podés entrar con tu nueva contraseña.</p>
              <button onClick={() => { router.push('/'); router.refresh() }}
                className="w-full mt-6 py-4 rounded-2xl font-black text-lg active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg, #4f8ef7, #6c63ff)', color: '#fff' }}>
                Ir al prode
              </button>
            </div>
          ) : authError ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="font-bold text-lg">Link no válido</p>
              <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>{authError}</p>
              <Link href="/recuperar"
                className="block w-full mt-6 py-4 rounded-2xl font-black text-lg active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg, #4f8ef7, #6c63ff)', color: '#fff' }}>
                Pedir nuevo link
              </Link>
            </div>
          ) : !ready ? (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Validando link…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--muted)' }}>Nueva contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'} required minLength={6}
                    value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full rounded-2xl px-4 py-4 text-base outline-none pr-12"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
                    style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1 }}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--muted)' }}>Repetir contraseña</label>
                <input
                  type={showPassword ? 'text' : 'password'} required minLength={6}
                  value={confirm} onChange={e => setConfirm(e.target.value)}
                  className="w-full rounded-2xl px-4 py-4 text-base outline-none"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                  placeholder="Repetí la contraseña"
                />
              </div>

              {error && (
                <div className="text-sm text-center py-2 px-4 rounded-xl" style={{ background: 'rgba(255,107,107,0.15)', color: 'var(--accent2)' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-2xl font-black text-lg active:scale-95 transition-all disabled:opacity-50 mt-2"
                style={{ background: 'linear-gradient(135deg, #4f8ef7, #6c63ff)', color: '#fff' }}>
                {loading ? 'Guardando…' : 'Guardar contraseña'}
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
