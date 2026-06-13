import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0b2d5e 0%, #153e7e 100%)',
          borderRadius: 6,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: -1,
              lineHeight: 1,
            }}
          >
            W
          </div>
          <div
            style={{
              width: 14,
              height: 3,
              marginTop: 2,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #3e8ed0, #5ba8e0)',
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
