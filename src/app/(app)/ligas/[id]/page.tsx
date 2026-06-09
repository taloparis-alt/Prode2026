export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { LeagueStanding } from '@/lib/types'
import ShareButton from './ShareButton'
import RemoveMember from './RemoveMember'

const medals = ['🥇', '🥈', '🥉']

export default async function LigaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: league } = await supabase.from('leagues').select('*').eq('id', id).single()
  if (!league) notFound()

  const { data: standings } = await supabase
    .from('league_standings').select('*').eq('league_id', id)
    .order('total_points', { ascending: false })

  const sorted = (standings ?? []) as LeagueStanding[]

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
      {/* Header de la liga */}
      <div className="rounded-3xl p-5 mb-5"
        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.15))', border: '1px solid rgba(59,130,246,0.3)' }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>Liga</p>
            <h1 className="text-2xl font-black">{league.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-mono px-3 py-1 rounded-full font-bold"
                style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--accent3)', letterSpacing: 3 }}>
                {league.code}
              </span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{sorted.length} jugadores</span>
            </div>
          </div>
          <span style={{ fontSize: 48 }}>🏆</span>
        </div>
        <ShareButton code={league.code} />
      </div>

      {/* Tabla de posiciones */}
      {sorted.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--muted)' }}>
          <p style={{ fontSize: 48 }}>👥</p>
          <p className="font-black text-base mt-3">Todavía no hay miembros</p>
          <p className="text-sm mt-1">Compartí el código para que se unan</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((s, i) => {
            const isMe = s.user_id === user!.id
            const isTop3 = i < 3
            return (
              <div key={s.user_id}
                className="flex items-center rounded-2xl px-4 py-3.5 gap-3"
                style={{
                  background: isMe ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isMe ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  backdropFilter: 'blur(10px)',
                }}>
                <span style={{ fontSize: isTop3 ? 22 : 14, fontWeight: 900, minWidth: 28, textAlign: 'center',
                  color: isTop3 ? '#fff' : 'rgba(255,255,255,0.35)' }}>
                  {isTop3 ? medals[i] : i + 1}
                </span>
                <span style={{ fontSize: 26 }}>{s.avatar_emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate" style={{ textTransform: 'uppercase' }}>{s.display_name}{isMe && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.3)', color: '#93c5fd', textTransform: 'none' }}>Vos</span>}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    🎯 {s.exact_scores} exactos · ✓ {s.correct_results} resultados
                  </p>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <span style={{ fontSize: 24, fontWeight: 900, color: isTop3 ? 'var(--accent3)' : '#fff' }}>
                      {s.total_points}
                    </span>
                    <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>pts</p>
                  </div>
                  {league.created_by === user!.id && !isMe && (
                    <RemoveMember leagueId={id} userId={s.user_id} name={s.display_name} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
