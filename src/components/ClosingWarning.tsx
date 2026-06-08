'use client'

import { useEffect, useState } from 'react'

interface Props {
  matchDate: string
}

export default function ClosingWarning({ matchDate }: Props) {
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null)

  useEffect(() => {
    function calc() {
      const deadline = new Date(matchDate)
      deadline.setMinutes(deadline.getMinutes() - 30)
      const diff = Math.floor((deadline.getTime() - Date.now()) / 60000)
      setMinutesLeft(diff)
    }
    calc()
    const interval = setInterval(calc, 30000)
    return () => clearInterval(interval)
  }, [matchDate])

  if (minutesLeft === null) return null

  // Solo mostramos aviso si quedan menos de 60 minutos y el partido no cerró
  if (minutesLeft <= 0 || minutesLeft > 60) return null

  const urgent = minutesLeft <= 10
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: '6px 12px', borderRadius: 12, marginTop: 8,
      background: urgent ? 'rgba(251,113,133,0.2)' : 'rgba(251,191,36,0.15)',
      border: `1px solid ${urgent ? 'rgba(251,113,133,0.4)' : 'rgba(251,191,36,0.3)'}`,
    }}>
      <span style={{ fontSize: 14 }}>{urgent ? '🚨' : '⏰'}</span>
      <span style={{
        fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5,
        color: urgent ? '#fb7185' : '#fbbf24',
      }}>
        {minutesLeft === 1
          ? '¡Último minuto para pronosticar!'
          : `Cierra en ${minutesLeft} minutos`}
      </span>
    </div>
  )
}
