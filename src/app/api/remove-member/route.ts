import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { leagueId, userId } = await request.json()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  // Verificar que el que pide es el creador de la liga
  const { data: league } = await supabase
    .from('leagues').select('created_by').eq('id', leagueId).single()

  if (!league || league.created_by !== user.id) {
    return NextResponse.json({ error: 'No sos el creador de esta liga' }, { status: 403 })
  }

  const { error } = await supabase
    .from('league_members')
    .delete()
    .eq('league_id', leagueId)
    .eq('user_id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
