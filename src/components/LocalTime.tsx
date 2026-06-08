'use client'

import { useState, useEffect } from 'react'

interface Props {
  dateStr: string
  format?: 'short' | 'full'
}

export default function LocalTime({ dateStr, format = 'short' }: Props) {
  const [display, setDisplay] = useState('')

  useEffect(() => {
    if (!dateStr) return
    const d = new Date(dateStr)
    const options: Intl.DateTimeFormatOptions = format === 'full'
      ? { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }
      : { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }

    // Usa el timezone del dispositivo automáticamente (sin especificar timeZone)
    setDisplay(d.toLocaleString('es', options))
  }, [dateStr, format])

  if (!display) {
    // Muestra fecha básica sin timezone mientras hidrata
    const d = new Date(dateStr)
    return <span>{d.getUTCDate()}/{d.getUTCMonth() + 1} {String(d.getUTCHours()).padStart(2,'0')}:{String(d.getUTCMinutes()).padStart(2,'0')} UTC</span>
  }

  return <span>{display}</span>
}
