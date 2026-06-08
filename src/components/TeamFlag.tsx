import { getFlagUrl } from '@/lib/flags'

interface Props {
  teamId: string
  teamName: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: { w: 40, h: 27, text: 'text-[10px]', radius: '8px' },
  md: { w: 56, h: 37, text: 'text-xs', radius: '10px' },
  lg: { w: 72, h: 48, text: 'text-sm', radius: '12px' },
}

export default function TeamFlag({ teamId, teamName, size = 'md' }: Props) {
  const { w, h, text, radius } = sizes[size]
  const url = getFlagUrl(teamId)

  return (
    <div className="flex flex-col items-center gap-2">
      {url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={url}
          alt={teamName}
          width={w}
          height={h}
          style={{
            width: w, height: h,
            objectFit: 'cover',
            borderRadius: radius,
            border: '1.5px solid rgba(255,255,255,0.2)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            display: 'block',
          }}
        />
      ) : (
        <div style={{
          width: w, height: h, borderRadius: radius,
          background: 'rgba(255,255,255,0.1)',
          border: '1.5px solid rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 800, color: '#fff',
        }}>
          {teamId}
        </div>
      )}
      <span className={`${text} font-bold text-center leading-tight`}
        style={{ maxWidth: `${w + 12}px`, color: '#fff' }}>
        {teamName}
      </span>
    </div>
  )
}
