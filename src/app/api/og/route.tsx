import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
 
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FF4D00', // Accent Color
          padding: '40px',
        }}
      >
        {/* Ícones nos cantos */}
        <div style={{ position: 'absolute', top: 50, left: 50, fontSize: 40 }}>📄</div>
        <div style={{ position: 'absolute', bottom: 50, right: 50, fontSize: 40 }}>📄</div>
        
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '8px solid white',
            padding: '60px 80px',
            backgroundColor: 'transparent',
            boxShadow: '20px 20px 0px 0px rgba(0,0,0,0.2)',
          }}
        >
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: 'white',
              fontFamily: 'sans-serif',
              letterSpacing: '-0.05em',
              marginBottom: '20px',
              fontStyle: 'italic',
            }}
          >
            prontu.
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: 'white',
              fontFamily: 'sans-serif',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            Trabalho escolar pronto em minutos
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
