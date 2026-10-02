import React from 'react';

/** Full-screen grain texture overlay for visual depth — used on HomePage and PickCharacterPage. */
export const NoiseOverlay: React.FC = () => (
  <div
    className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-overlay"
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      backgroundSize: '256px 256px',
    }}
  />
);