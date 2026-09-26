import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FanCarousel } from '@/components/ui/3d-carousel';

const heroImages = [
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-[#0f0608] text-zinc-100 font-sans flex flex-col overflow-hidden select-none">
      {/* Grain Texture Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />

      {/* Deep Radial Vignette Background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 90% 70% at 50% 40%, #2b1018 0%, #160a0d 45%, #0a0306 100%)',
        }}
      />

      {/* Side Flare Gradients */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-0 w-[48%]"
        style={{ background: 'linear-gradient(to right, rgba(120,50,20,0.55) 0%, transparent 100%)' }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[48%]"
        style={{ background: 'linear-gradient(to left, rgba(120,50,20,0.55) 0%, transparent 100%)' }}
      />

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-10 pb-6">
        {/* 3D Fan Carousel */}
        <div className="w-full max-w-[1100px] mx-auto mb-10">
          <FanCarousel images={heroImages} />
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3 mt-7">
          <button
            onClick={() => navigate('/create-room')}
            className="px-6 py-2.5 rounded-full bg-zinc-100 text-zinc-950 font-semibold text-[13px] hover:bg-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.12)] active:scale-95 cursor-pointer"
          >
            Create new room
          </button>
          <button
            onClick={() => navigate('/join-room')}
            className="px-6 py-2.5 rounded-full bg-transparent border border-white/20 text-zinc-300 font-medium text-[13px] hover:bg-white/10 hover:text-white hover:border-white/35 transition-all active:scale-95 cursor-pointer"
          >
            Join existing room
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
