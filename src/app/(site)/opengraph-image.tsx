import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

export const alt = `${site.name}: ${site.proposition}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  const lines = ['Earn better.', 'Build stronger.', 'Protect what matters.'];
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#1e1c1a',
          color: '#f1eadd',
          padding: 72,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
          <div style={{ width: 18, height: 18, background: '#dd9a2c' }} />
          <div style={{ width: 18, height: 33, background: '#dd9a2c' }} />
          <div style={{ width: 18, height: 48, background: '#dd9a2c' }} />
          <div style={{ marginLeft: 16, fontSize: 34, fontWeight: 700 }}>{site.name}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {lines.map((line, i) => (
            <div key={line} style={{ display: 'flex', alignItems: 'center', fontSize: 92, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3 }}>
              {i > 0 ? <div style={{ width: i * 80, height: 8, background: '#dd9a2c', marginRight: 22 }} /> : null}
              {line}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
