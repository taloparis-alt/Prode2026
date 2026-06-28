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
    // Siempre en horario de Argentina (UTC−3), sin depender de la zona del dispositivo
    const tz = 'America/Argentina/Buenos_Aires'
    const options: Intl.DateTimeFormatOptions = format === 'full'
      ? { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: tz }
      : { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: tz }
    setDisplay(d.toLocaleString('es-AR', options))
  }, [dateStr, format])

  // Muestra vacío mientras hidrata — sin confundir con hora UTC
  if (!display) return <span style={{ opacity: 0.3 }}>...</span>

  return <span>{display}</span>
}
