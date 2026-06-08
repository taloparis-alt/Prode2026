import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function LigasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: memberships } = await supabase
    .from('league_members')
    .select('league_id, leagues(*)')
    .eq('user_id', user!.id)

  const leagues = (memberships ?? []).map((m: { leagues: unknown }) => m.leagues).filter(Boolean)

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-5">
        <h1 style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.5)', margin: 0 }}>👥 MIS LIGAS</h1>
      </div>

      {leagues.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--muted)' }}>
          <p className="text-4xl mb-3">🏆</p>
          <p className="font-semibold">Todavía no estás en ninguna liga</p>
          <p className="text-sm mt-1">Creá una o unite con un código</p>
        </div>
      ) : (
        <div className="space-y-2 mb-6">
          {(leagues as Array<{ id: string; name: string; code: string }>).map(league => (
            <Link
              key={league.id}
              href={`/ligas/${league.id}`}
              className="flex items-center justify-between rounded-2xl px-4 py-4"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div>
                <p className="font-semibold">{league.name}</p>
                <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--muted)' }}>#{league.code}</p>
              </div>
              <span style={{ color: 'var(--muted)' }}>›</span>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/ligas/crear"
          className="flex flex-col items-center gap-2 py-5 rounded-2xl font-semibold text-sm"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          <span className="text-2xl">➕</span>
          Crear liga
        </Link>
        <Link
          href="/ligas/unirse"
          className="flex flex-col items-center gap-2 py-5 rounded-2xl font-semibold text-sm"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
        >
          <span className="text-2xl">🔗</span>
          Unirse
        </Link>
      </div>
    </div>
  )
}
