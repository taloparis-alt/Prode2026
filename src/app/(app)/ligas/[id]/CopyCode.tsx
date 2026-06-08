'use client'

import { useState } from 'react'

export default function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs px-2 py-0.5 rounded-lg transition-all"
      style={{ background: copied ? '#22c55e' : 'var(--border)', color: '#fff' }}
    >
      {copied ? '✓ Copiado' : 'Copiar'}
    </button>
  )
}
