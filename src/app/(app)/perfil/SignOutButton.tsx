'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="w-full py-3 rounded-xl font-semibold text-sm"
      style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--accent2)' }}
    >
      Cerrar sesión
    </button>
  )
}
