import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { leagueId, userId } = await request.json()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  // Usar service role para bypassear RLS
  const { createClient: createAdmin } = await import('@supabase/supabase-js')
  const admin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Verificar que el usuario es creador
  const { data: league } = await admin
    .from('leagues').select('created_by').eq('id', leagueId).single()

  if (!league || league.created_by !== user.id) {
    return NextResponse.json({ error: `No autorizado. creator=${league?.created_by} user=${user.id}` }, { status: 403 })
  }

  const { error } = await admin
    .from('league_members')
    .delete()
    .eq('league_id', leagueId)
    .eq('user_id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
