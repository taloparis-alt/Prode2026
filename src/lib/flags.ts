// Mapeo de código FIFA (3 letras) a código ISO2 para flagcdn.com
export const FIFA_TO_ISO2: Record<string, string> = {
  MEX: 'mx', RSA: 'za', CZE: 'cz', KOR: 'kr',
  CAN: 'ca', SUI: 'ch', QAT: 'qa', BIH: 'ba',
  BRA: 'br', MAR: 'ma', SCO: 'gb-sct', HAI: 'ht',
  USA: 'us', PAR: 'py', TUR: 'tr', AUS: 'au',
  GER: 'de', ECU: 'ec', CIV: 'ci', CUW: 'cw',
  NED: 'nl', JPN: 'jp', SWE: 'se', TUN: 'tn',
  BEL: 'be', EGY: 'eg', IRN: 'ir', NZL: 'nz',
  ESP: 'es', URU: 'uy', KSA: 'sa', CPV: 'cv',
  FRA: 'fr', NOR: 'no', IRQ: 'iq', SEN: 'sn',
  ARG: 'ar', JOR: 'jo', AUT: 'at', ALG: 'dz',
  POR: 'pt', COL: 'co', UZB: 'uz', COD: 'cd',
  ENG: 'gb-eng', PAN: 'pa', GHA: 'gh', CRO: 'hr',
}

export function getFlagUrl(teamId: string): string {
  const iso2 = FIFA_TO_ISO2[teamId]
  if (!iso2) return ''
  // SVG flags via jsDelivr — accesible globalmente
  return `https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3/${iso2}.svg`
}
