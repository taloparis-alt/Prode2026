import { createClient } from '@/lib/supabase/server'
import CampeonForm from './CampeonForm'

export default async function CampeonPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: teams } = await supabase
    .from('teams')
    .select('*')
    .neq('id', 'TBD')
    .order('group_letter', { ascending: true })
    .order('name', { ascending: true })

  // Ligas del usuario
  const { data: memberships } = await supabase
    .from('league_members')
    .select('league_id, leagues(id, name)')
    .eq('user_id', user!.id)

  const leagues = (memberships ?? []).map((m: { leagues: unknown }) => m.leagues).filter(Boolean) as { id: string; name: string }[]

  // Pronósticos de campeón ya guardados
  const { data: existing } = await supabase
    .from('champion_predictions')
    .select('*')
    .eq('user_id', user!.id)

  const existingMap = new Map((existing ?? []).map((p: { league_id: string; team_id: string }) => [p.league_id, p.team_id]))

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
      <div className="mb-6">
        <h1 className="text-2xl font-black">🏆 Campeón</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Elegí el campeón para cada liga. Una vez guardado no se puede cambiar.</p>
      </div>

      {leagues.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--muted)' }}>
          <p style={{ fontSize: 48 }}>🏆</p>
          <p className="font-black text-base mt-3">Primero unite a una liga</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leagues.map(league => (
            <CampeonForm
              key={league.id}
              userId={user!.id}
              league={league}
              teams={teams ?? []}
              existingTeamId={existingMap.get(league.id) ?? null}
            />
          ))}
        </div>
      )}
    </div>
  )
}
