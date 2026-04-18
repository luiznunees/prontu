import { ImageResponse } from 'next/og';

export const dynamic = 'force-dynamic';

export const alt = 'Prontu — Seu trabalho pronto. De verdade.';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #FF4D00 0%, #FF8C42 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '60px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          {/* O Logotipo */}
          <div
            style={{
              width: '120px',
              height: '120px',
              border: '12px solid white',
              boxShadow: '15px 15px 0px #0D0D0D',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#FF4D00',
              marginRight: '30px'
            }}
          >
            <span style={{ fontSize: '70px', fontWeight: 'bold' }}>P</span>
          </div>
          <h1 style={{ fontSize: '100px', fontWeight: '900', letterSpacing: '-0.05em', color: '#0D0D0D', margin: 0 }}>
            prontu.
          </h1>
        </div>

        <h2 style={{ fontSize: '50px', fontWeight: '700', color: '#0D0D0D', textAlign: 'center', marginTop: '20px', lineHeight: 1.2 }}>
          Cola o enunciado. <br />
          Em 3 minutos, <span style={{ color: 'white', textDecoration: 'underline' }}>PDF na mão</span>.
        </h2>

        <div style={{
          marginTop: 'auto',
          background: '#0D0D0D',
          padding: '15px 30px',
          borderRadius: '12px',
          color: '#FFE600',
          fontSize: '30px',
          fontWeight: 'bold',
          letterSpacing: '0.1em'
        }}>
          USEPRONTU.ONLINE
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
