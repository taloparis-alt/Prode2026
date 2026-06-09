'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Suspense } from 'react'

const EMOJIS = ['⚽','🏆','🥇','🔥','⚡','🌟','🦁','🦅','🐯','🦊','🐺','🦈']

function RegistroForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('⚽')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name, avatar_emoji: emoji } },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(redirectTo)
      router.refresh()
    }
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">{emoji}</div>
          <h1 className="text-2xl font-bold">Crear cuenta</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Prode Mundial 2026</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--muted)' }}>Tu emoji</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className="w-10 h-10 rounded-xl text-xl transition-all"
                  style={{
                    background: emoji === e ? 'var(--accent)' : 'var(--card)',
                    border: `1px solid ${emoji === e ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--muted)' }}>Nombre</label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value.toUpperCase())}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              placeholder="Tu nombre en el prode"
            />
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--muted)' }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--muted)' }}>Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none pr-12"
                style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                placeholder="Mínimo 6 caracteres"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg"
                style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1 }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-center" style={{ color: 'var(--accent2)' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-50"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--muted)' }}>
          ¿Ya tenés cuenta?{' '}
          <Link href={`/login?redirect=${encodeURIComponent(redirectTo)}`} className="font-semibold" style={{ color: 'var(--accent)' }}>
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegistroPage() {
  return (
    <Suspense>
      <RegistroForm />
    </Suspense>
  )
}
