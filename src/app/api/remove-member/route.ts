import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { leagueId, userId } = await request.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: league } = await admin
      .from('leagues').select('created_by').eq('id', leagueId).single()

    if (!league || league.created_by !== user.id) {
      return NextResponse.json({ error: `No autorizado` }, { status: 403 })
    }

    const { error } = await admin
      .from('league_members')
      .delete()
      .eq('league_id', leagueId)
      .eq('user_id', userId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Bloquear al usuario para que no pueda volver a unirse con el código
    const { error: banError } = await admin
      .from('league_bans')
      .upsert({ league_id: leagueId, user_id: userId }, { onConflict: 'league_id,user_id' })

    if (banError) return NextResponse.json({ error: banError.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
