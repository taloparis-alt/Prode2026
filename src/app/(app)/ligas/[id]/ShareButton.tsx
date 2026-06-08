'use client'

import { useState } from 'react'

export default function ShareButton({ code }: { code: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'shared'>('idle')

  async function handleShare() {
    const url = `${window.location.origin}/ligas/unirse?codigo=${code}`
    const text = `¡Unite a mi liga del Prode Mundial 2026! Usá el código ${code} o entrá directo: ${url}`

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Prode Mundial 2026', text, url })
        setState('shared')
        setTimeout(() => setState('idle'), 2000)
      } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setState('copied')
      setTimeout(() => setState('idle'), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm active:scale-95 transition-all w-full justify-center mt-4"
      style={{
        background: state !== 'idle' ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #3b82f6, #6366f1)',
        color: '#fff',
        boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
      }}
    >
      {state === 'copied' ? '✅ Link copiado!' : state === 'shared' ? '✅ ¡Compartido!' : '🔗 Compartir liga'}
    </button>
  )
}
