import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 64,
  height: 64,
}

export const contentType = 'image/png'

// Génère un favicon léger (fond bleu, texte "MP") sans dépendre d'un fichier binaire.
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0049ac',
          color: '#ffffff',
          fontSize: 28,
          fontWeight: 800,
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.5px',
        }}
      >
        MP
      </div>
    ),
    size
  )
}
