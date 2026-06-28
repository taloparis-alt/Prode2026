import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function calcPoints(predHome: number, predAway: number, realHome: number, realAway: number): number {
  if (predHome === realHome && predAway === realAway) return 4 // Exacto
  const predResult = predHome > predAway ? 'H' : predHome < predAway ? 'A' : 'D'
  const realResult = realHome > realAway ? 'H' : realHome < realAway ? 'A' : 'D'
  if (predResult === realResult) return 3 // Resultado correcto
  return 0
}

export async function POST(request: NextRequest) {
  try {
    const { matchId, homeScore, awayScore, winnerTeamId } = await request.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.id !== process.env.ADMIN_USER_ID) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const admin = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Actualizar el partido. winner_team_id solo se toca cuando hay un ganador
    // por penales que registrar (empate en eliminatoria), así no se referencia
    // la columna en el resto de los casos.
    const matchUpdate: Record<string, unknown> = { home_score: homeScore, away_score: awayScore, status: 'finished' }
    if (homeScore === awayScore && winnerTeamId) {
      matchUpdate.winner_team_id = winnerTeamId
    }
    const { error: matchError } = await admin
      .from('matches')
      .update(matchUpdate)
      .eq('id', matchId)

    if (matchError) return NextResponse.json({ error: matchError.message }, { status: 500 })

    // Calcular puntos para todas las predicciones de este partido
    const { data: predictions } = await admin
      .from('predictions')
      .select('*')
      .eq('match_id', matchId)

    for (const pred of predictions ?? []) {
      const points = calcPoints(pred.home_score, pred.away_score, homeScore, awayScore)
      await admin.from('predictions').update({ points }).eq('id', pred.id)
    }

    return NextResponse.json({ ok: true, updated: (predictions ?? []).length })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
