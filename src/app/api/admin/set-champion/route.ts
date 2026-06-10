import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { teamId } = await request.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.id !== process.env.ADMIN_USER_ID) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Buscar todos los usuarios que eligieron ese equipo
    const { data: picks } = await admin
      .from('user_champion_picks')
      .select('user_id')
      .eq('team_id', teamId)

    // Actualizar puntos en user_champion_picks para los que acertaron
    const { error: updateError } = await admin
      .from('user_champion_picks')
      .update({ points: 5 })
      .eq('team_id', teamId)

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

    // Poner 0 puntos a los que no acertaron
    await admin
      .from('user_champion_picks')
      .update({ points: 0 })
      .neq('team_id', teamId)
      .is('points', null)

    return NextResponse.json({ ok: true, rewarded: (picks ?? []).length })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
