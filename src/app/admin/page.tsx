export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminMatchList from './AdminMatchList'
import AdminChampion from './AdminChampion'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.id !== process.env.ADMIN_USER_ID) {
    redirect('/')
  }

  const { data: matches } = await supabase
    .from('matches')
    .select('*, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name)')
    .neq('home_team_id', 'TBD')
    .order('sort_order', { ascending: true })

  const { data: teams } = await supabase
    .from('teams')
    .select('id, name')
    .neq('id', 'TBD')
    .order('name')

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px' }}>
      <div style={{ marginBottom: 20, padding: '16px 20px', borderRadius: 16, background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)' }}>
        <h1 style={{ fontSize: 16, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: '#fbbf24', margin: 0 }}>
          🔧 Panel de Admin
        </h1>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4, marginBottom: 0 }}>
          Cargá resultados y se calculan los puntos automáticamente
        </p>
      </div>
      <AdminChampion teams={teams ?? []} />
      <AdminMatchList matches={matches ?? []} />
    </div>
  )
}
