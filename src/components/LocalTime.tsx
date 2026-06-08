'use client'

import { useState, useEffect } from 'react'

interface Props {
  dateStr: string
  format?: 'short' | 'full'
}

export default function LocalTime({ dateStr, format = 'short' }: Props) {
  const [display, setDisplay] = useState('')

  useEffect(() => {
    const d = new Date(dateStr)
    if (format === 'full') {
      setDisplay(d.toLocaleString(navigator.language || 'es', {
        weekday: 'long', day: 'numeric', month: 'long',
        hour: '2-digit', minute: '2-digit',
      }))
    } else {
      setDisplay(d.toLocaleString(navigator.language || 'es', {
        weekday: 'short', day: 'numeric', month: 'short',
        hour: '2-digit', minute: '2-digit',
      }))
    }
  }, [dateStr, format])

  // Mientras hidrata, mostramos algo neutro
  if (!display) return <span>--:--</span>
  return <span>{display}</span>
}
