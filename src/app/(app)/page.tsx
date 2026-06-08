export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Match } from '@/lib/types'
import TeamFlag from '@/components/TeamFlag'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('es-AR', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', timeZone: 'America/Argentina/Buenos_Aires'
  })
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single()

  const { data: upcoming } = await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*)')
    .eq('status', 'scheduled').neq('home_team_id', 'TBD')
    .order('match_date', { ascending: true }).limit(6)

  const matchIds = (upcoming ?? []).map((m: Match) => m.id)
  const { data: predictions } = matchIds.length > 0
    ? await supabase.from('predictions').select('*').eq('user_id', user!.id).in('match_id', matchIds)
    : { data: [] }

  const predMap = new Map((predictions ?? []).map((p: { match_id: string; home_score: number; away_score: number }) => [p.match_id, p]))

  const { data: finished } = await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*)')
    .eq('status', 'finished').order('match_date', { ascending: false }).limit(3)

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 16px' }}>

      {/* HERO con copa grande */}
      <div style={{
        position: 'relative', borderRadius: 24, overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(30,87,153,0.9) 0%, rgba(14,42,71,0.95) 100%)',
        border: '1px solid rgba(255,255,255,0.15)',
        marginTop: 16, marginBottom: 20, padding: '20px 20px 16px',
      }}>
        {/* Copa de fondo */}
        <div style={{
          position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)',
          fontSize: 120, opacity: 0.15, lineHeight: 1, pointerEvents: 'none',
        }}>🏆</div>
        {/* Pelota decorativa */}
        <div style={{
          position: 'absolute', right: 70, bottom: -10,
          fontSize: 60, opacity: 0.08, pointerEvents: 'none',
        }}>⚽</div>

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
              Prode Mundial 2026
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>
              {new Date().toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'America/Argentina/Buenos_Aires' })}
            </span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5, margin: 0, lineHeight: 1.2 }}>
            {profile?.avatar_emoji} {profile?.display_name}
          </h1>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {['🇲🇽 MÉXICO', '🇺🇸 ESTADOS UNIDOS', '🇨🇦 CANADÁ'].map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}>{h}</span>
            ))}
          </div>
        </div>
      </div>

      {/* PRÓXIMOS PARTIDOS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          Próximos partidos
        </h2>
        <Link href="/partidos" style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textDecoration: 'none', background: 'rgba(56,189,248,0.15)', padding: '4px 10px', borderRadius: 20 }}>
          Ver pronósticos →
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {(upcoming ?? []).map((match: Match) => {
          const pred = predMap.get(match.id)
          return (
            <Link key={match.id} href={`/partidos?grupo=${match.group_letter}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(255,255,255,0.07)', border: `1px solid ${pred ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 18, overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 14px', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent3)', textTransform: 'uppercase', letterSpacing: 1 }}>Grupo {match.group_letter}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {pred && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--green)' }}>✓</span>}
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>{formatDate(match.match_date)}</span>
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

      {/* ÚLTIMOS RESULTADOS */}
      {(finished ?? []).length > 0 && (
        <>
          <h2 style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>
            Últimos resultados
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {(finished ?? []).map((match: Match) => (
              <div key={match.id} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <TeamFlag teamId={match.home_team_id} teamName={match.home_team?.name ?? ''} size="sm" />
                </div>
                <div style={{ minWidth: 60, textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 900 }}>{match.home_score}–{match.away_score}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: 1 }}>Final</div>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <TeamFlag teamId={match.away_team_id} teamName={match.away_team?.name ?? ''} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
