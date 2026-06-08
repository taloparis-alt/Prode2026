import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignOutButton from './SignOutButton'
import ChampionSection from './ChampionSection'

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const { data: predictions } = await supabase
    .from('predictions').select('points').eq('user_id', user.id).not('points', 'is', null)

  const totalPts = (predictions ?? []).reduce((s: number, p: { points: number }) => s + (p.points ?? 0), 0)
  const exact = (predictions ?? []).filter((p: { points: number }) => p.points === 4).length
  const correct = (predictions ?? []).filter((p: { points: number }) => p.points === 3).length
  const played = (predictions ?? []).length

  // Ligas del usuario
  const { data: memberships } = await supabase
    .from('league_members').select('league_id, leagues(id, name)').eq('user_id', user.id)
  const leagues = (memberships ?? []).map((m: { leagues: unknown }) => m.leagues).filter(Boolean) as { id: string; name: string }[]

  // Equipos para el selector
  const { data: teams } = await supabase
    .from('teams').select('*').neq('id', 'TBD').order('group_letter').order('name')

  // Pronósticos de campeón guardados
  const { data: champPreds } = await supabase
    .from('champion_predictions').select('*').eq('user_id', user.id)
  const champMap = new Map((champPreds ?? []).map((p: { league_id: string; team_id: string }) => [p.league_id, p.team_id]))

  return (
    <div className="max-w-lg mx-auto px-4 pt-4 pb-4">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div style={{ fontSize: 72, lineHeight: 1 }}>{profile?.avatar_emoji ?? '⚽'}</div>
        <h1 className="text-2xl font-black mt-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
          {profile?.display_name}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: 'Puntos totales', value: totalPts, color: '#3b82f6' },
          { label: 'Pronósticos', value: played, color: '#fff' },
          { label: 'Exactos 🎯', value: exact, color: '#22c55e' },
          { label: 'Resultado ✓', value: correct, color: '#f59e0b' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl p-4 text-center"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ fontSize: 32, fontWeight: 900, color }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Sección campeón */}
      <ChampionSection
        userId={user.id}
        leagues={leagues}
        teams={teams ?? []}
        champMap={Object.fromEntries(champMap)}
      />

      <div className="mt-6">
        <SignOutButton />
      </div>
    </div>
  )
}
