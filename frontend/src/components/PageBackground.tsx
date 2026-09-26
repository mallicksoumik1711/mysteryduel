import React from 'react';

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/**
 * Shared decorative background used by CreateRoomPage and JoinRoomPage.
 * Renders a grain texture overlay and two ambient radial glow layers.
 */
export const PageBackground: React.FC = () => (
  <>
    {/* Micro Texture Overlay */}
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-overlay"
      style={{ backgroundImage: GRAIN_SVG, backgroundSize: '256px 256px' }}
    />
    {/* Ambient Radial Mesh Lighting */}
    <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-rose-950/20 blur-[150px] rounded-full z-0" />
    <div className="pointer-events-none absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-amber-900/15 blur-[140px] rounded-full z-0" />
  </>
);
