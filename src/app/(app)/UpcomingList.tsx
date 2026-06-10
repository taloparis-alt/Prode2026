'use client'

import { useState } from 'react'
import Link from 'next/link'
import TeamFlag from '@/components/TeamFlag'
import LocalTime from '@/components/LocalTime'
import type { Match } from '@/lib/types'

interface Pred { match_id: string; home_score: number; away_score: number }

export default function UpcomingList({ matches, predictions }: { matches: Match[]; predictions: Pred[] }) {
  const [visible, setVisible] = useState(6)
  const predMap = new Map(predictions.map(p => [p.match_id, p]))

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
        {matches.slice(0, visible).map((match: Match) => {
          const pred = predMap.get(match.id)
          return (
            <Link key={match.id} href={match.group_letter ? `/partidos?grupo=${match.group_letter}` : '/partidos'} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(255,255,255,0.07)', border: `1px solid ${pred ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 18, overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 14px', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent3)', textTransform: 'uppercase', letterSpacing: 1 }}>Grupo {match.group_letter}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {pred && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--green)' }}>✓</span>}
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}><LocalTime dateStr={match.match_date} /></span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', gap: 8 }}>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <TeamFlag teamId={match.home_team_id} teamName={match.home_team?.name ?? ''} size="sm" />
                  </div>
                  <div style={{ minWidth: 70, textAlign: 'center' }}>
                    {pred ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.4)' }}>Mi pronóstico</span>
                        <span style={{ fontSize: 22, fontWeight: 900, padding: '3px 12px', borderRadius: 10, background: 'rgba(56,189,248,0.2)', border: '1px solid rgba(56,189,248,0.4)', color: '#fff' }}>
                          {pred.home_score}–{pred.away_score}
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <span style={{ fontSize: 16, fontWeight: 900, color: 'rgba(255,255,255,0.2)' }}>VS</span>
                        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--accent2)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Pronosticar</span>
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <TeamFlag teamId={match.away_team_id} teamName={match.away_team?.name ?? ''} size="sm" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {visible < matches.length && (
        <button
          onClick={() => setVisible(v => v + 6)}
          style={{
            width: '100%', padding: '12px', borderRadius: 16, fontWeight: 900, fontSize: 13,
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.6)', cursor: 'pointer', marginBottom: 24,
          }}>
          Ver más partidos ({matches.length - visible} restantes)
        </button>
      )}
    </>
  )
}
