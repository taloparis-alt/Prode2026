import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import PredictionForm from './PredictionForm'

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
    hour: '2-digit', minute: '2-digit', timeZone: 'America/Argentina/Buenos_Aires'
  })
}

export default async function PartidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: match } = await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*)')
    .eq('id', id)
    .single()

  if (!match) notFound()

  const { data: prediction } = await supabase
    .from('predictions').select('*')
    .eq('user_id', user.id).eq('match_id', id).maybeSingle()

  const deadline = new Date(match.match_date)
  deadline.setMinutes(deadline.getMinutes() - 30)
  const isLocked = new Date() >= deadline || match.status === 'finished'

  const STAGE_LABELS: Record<string, string> = {
    group: `Grupo ${match.group_letter}`,
    r32: 'Octavos de Final', r16: 'Cuartos de Final',
    sf: 'Semifinal', final: 'Final',
  }

  return (
    <div className="relative min-h-dvh">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #4f8ef7, transparent)' }} />
      </div>

      <div className="relative max-w-lg mx-auto px-4 pt-6">
        {/* Back */}
        <Link href="/partidos" className="inline-flex items-center gap-2 text-sm font-semibold mb-6 px-4 py-2 rounded-full"
          style={{ background: 'var(--card)', color: 'var(--muted)' }}>
          ← Todos los partidos
        </Link>

        {/* Tarjeta del partido */}
        <div className="rounded-3xl p-6 mb-5 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(79,142,247,0.2), rgba(251,191,36,0.1))', border: '1px solid var(--border)' }}>
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--muted)' }}>
            {STAGE_LABELS[match.stage] ?? match.stage}
          </span>

          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Home */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <span className="text-6xl">{match.home_team?.flag}</span>
              <span className="font-black text-sm text-center leading-tight">{match.home_team?.name}</span>
            </div>

            {/* Score o VS */}
            <div className="flex flex-col items-center min-w-[4rem]">
              {match.status === 'finished' ? (
                <>
                  <span className="text-4xl font-black">{match.home_score} - {match.away_score}</span>
                  <span className="text-xs mt-1 font-bold" style={{ color: 'var(--green)' }}>FINAL</span>
                </>
              ) : (
                <>
                  <span className="text-2xl font-black" style={{ color: 'var(--muted)' }}>VS</span>
                  {!isLocked && (
                    <span className="text-[10px] mt-1 px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: 'rgba(34,197,94,0.2)', color: 'var(--green)' }}>
                      ABIERTO
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Away */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <span className="text-6xl">{match.away_team?.flag}</span>
              <span className="font-black text-sm text-center leading-tight">{match.away_team?.name}</span>
            </div>
          </div>

          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            📅 {formatDate(match.match_date)}
          </p>
          {match.venue && (
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>📍 {match.venue}</p>
          )}
        </div>

        <PredictionForm
          matchId={id}
          userId={user.id}
          prediction={prediction}
          isLocked={isLocked}
          homeTeam={match.home_team}
          awayTeam={match.away_team}
        />
      </div>
    </div>
  )
}
