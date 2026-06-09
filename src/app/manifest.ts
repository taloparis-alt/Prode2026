import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Prode Mundial 2026',
    short_name: 'Prode 2026',
    description: 'Pronosticá los partidos del Mundial 2026',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f1729',
    theme_color: '#0f1729',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
  }
}
