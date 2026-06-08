import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Contenido con padding inferior para no quedar bajo el nav */}
      <main style={{ flex: 1, paddingBottom: 96 }}>{children}</main>

      {/* Bottom nav fijo */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        padding: '8px 12px 12px',
        background: 'linear-gradient(to top, #0d1b2a 70%, transparent)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-around', alignItems: 'center',
          maxWidth: 520, margin: '0 auto',
          background: 'rgba(255,255,255,0.09)',
          backdropFilter: 'blur(24px)',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.13)',
          padding: '6px 4px',
        }}>
          <NavItem href="/" icon="🏆" label="Partidos" />
          <NavItem href="/partidos" icon="📝" label="Pronósticos" />
          <NavItem href="/ligas" icon="👥" label="Ligas" />
          <NavItem href="/perfil" icon="👤" label="Perfil" />
        </div>
      </nav>
    </div>
  )
}

function NavItem({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link href={href} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 4, padding: '6px 10px', borderRadius: 14,
      color: 'rgba(255,255,255,0.65)', textDecoration: 'none',
      minWidth: 56,
    }}>
      <span style={{ fontSize: 26, lineHeight: 1 }}>{icon}</span>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.3 }}>{label}</span>
    </Link>
  )
}
