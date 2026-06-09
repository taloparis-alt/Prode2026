import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const codigo = request.nextUrl.searchParams.get('codigo')
  if (!codigo) redirect('/')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/registro?redirect=/api/join?codigo=${codigo}`)

  const { data: league } = await supabase
    .from('leagues').select('id').eq('code', codigo.toUpperCase()).single()

  if (!league) redirect('/ligas')

  await supabase.from('league_members')
    .insert({ league_id: league.id, user_id: user.id })
    .select()

  redirect(`/ligas/${league.id}`)
}
