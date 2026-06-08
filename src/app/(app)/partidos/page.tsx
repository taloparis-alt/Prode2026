export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import type { Match } from '@/lib/types'
import MatchList from './MatchList'

export default async function PartidosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: matches } = await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*)')
    .order('sort_order', { ascending: true })

  const { data: predictions } = await supabase
    .from('predictions').select('*').eq('user_id', user!.id)

  const predMap = new Map((predictions ?? []).map((p: { match_id: string }) => [p.match_id, p]))

  const groups: Record<string, Match[]> = {}
  for (const match of (matches ?? [])) {
    if (match.home_team_id === 'TBD') continue
    const key = match.stage === 'group' ? `group_${match.group_letter}` : match.stage
    if (!groups[key]) groups[key] = []
    groups[key].push({ ...match, user_prediction: predMap.get(match.id) })
  }

  const allKeys = Object.keys(groups).sort()
  const groupMatches = allKeys.filter(k => k.startsWith('group_'))
  const koMatches = allKeys.filter(k => !k.startsWith('group_'))

  return (
    <div className="max-w-lg mx-auto px-4 pt-3">
      <div style={{ marginBottom: 12, marginTop: 4 }}>
        <h1 style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.5)', margin: 0 }}>📝 Pronósticos</h1>
      </div>
      <MatchList groups={groups} groupMatches={groupMatches} koMatches={koMatches} userId={user!.id} />
    </div>
  )
}
