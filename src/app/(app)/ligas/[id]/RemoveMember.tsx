'use client'

export default function RemoveMember({ leagueId, userId, name }: { leagueId: string; userId: string; name: string }) {
  async function handleClick() {
    if (!window.confirm(`¿Eliminar a ${name} de la liga?`)) return
    const res = await fetch('/api/remove-member', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leagueId, userId }),
    })
    const data = await res.json()
    alert('Respuesta: ' + JSON.stringify(data) + ' status:' + res.status)
    if (!res.ok) return
    window.location.reload()
  }

  return (
    <button onClick={handleClick}
      className="text-[11px] font-black px-2 py-1 rounded-lg"
      style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
      ✕
    </button>
  )
}
