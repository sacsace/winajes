import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #0b2d5e 0%, #153e7e 55%, #0b2d5e 100%)',
          borderRadius: 36,
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
              fontSize: 96,
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: -4,
              lineHeight: 1,
            }}
          >
            W
          </div>
          <div
            style={{
              width: 72,
              height: 8,
              marginTop: 8,
              borderRadius: 4,
              background: 'linear-gradient(90deg, #3e8ed0, #5ba8e0)',
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
