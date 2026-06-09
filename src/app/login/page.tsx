'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
    } else {
      router.push(redirectTo)
      router.refresh()
    }
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0f1729 0%, #162040 50%, #0f1729 100%)' }}>
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #4f8ef7, transparent)' }} />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] opacity-[0.03] select-none">🏆</div>
      </div>

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">⚽</div>
          <h1 className="text-3xl font-black">Prode Mundial</h1>
          <p className="text-lg font-bold mt-1" style={{ color: 'var(--accent3)' }}>2026</p>
        </div>

        <div className="rounded-3xl p-6"
          style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--muted)' }}>Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full rounded-2xl px-4 py-4 text-base outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--muted)' }}>Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-2xl px-4 py-4 text-base outline-none pr-12"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
                  style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1 }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-center py-2 px-4 rounded-xl" style={{ background: 'rgba(255,107,107,0.15)', color: 'var(--accent2)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-lg transition-all active:scale-95 disabled:opacity-50 mt-2"
              style={{ background: 'linear-gradient(135deg, #4f8ef7, #6c63ff)', color: '#fff' }}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link href="/recuperar" className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <p className="text-center text-base mt-6" style={{ color: 'var(--muted)' }}>
          ¿No tenés cuenta?{' '}
          <Link href={`/registro?redirect=${encodeURIComponent(redirectTo)}`} className="font-black text-white">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
