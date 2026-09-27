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
    // Background: Rangoon Green (#171C18)
    <div className="relative min-h-screen w-full bg-[#171C18] text-[#FFFFFF] font-sans flex flex-col overflow-hidden select-none">
      
      {/* Grain Texture Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />

      {/* Deep Radial Vignette Background (Adjusted to Rangoon Green / Dark Emerald tones) */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 90% 70% at 50% 40%, #1f2821 0%, #171C18 45%, #0e120f 100%)',
        }}
      />

      {/* Side Flare Gradients (Subtle Hummingbird Green / Deep Forest lighting accents) */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-0 w-[48%]"
        style={{ background: 'linear-gradient(to right, rgba(147,221,53,0.06) 0%, transparent 100%)' }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[48%]"
        style={{ background: 'linear-gradient(to left, rgba(147,221,53,0.06) 0%, transparent 100%)' }}
      />

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-10 pb-6">
        
        {/* 3D Fan Carousel */}
        <div className="w-full max-w-[1100px] mx-auto mb-10">
          <FanCarousel images={heroImages} />
        </div>

        {/* CTA Buttons matched to theme */}
        <div className="flex items-center gap-3 mt-7">
          {/* Primary Action Button: Hummingbird Green (#93DD35) */}
          <button
            onClick={() => navigate('/create-room')}
            className="px-6 py-2.5 rounded-full bg-[#93DD35] text-[#171C18] font-black text-[13px] uppercase tracking-wider hover:bg-[#85c82e] transition-all shadow-[0_0_30px_rgba(147,221,53,0.3)] active:scale-95 cursor-pointer"
          >
            Create new room
          </button>

          {/* Secondary Action Button: Bordered with Muted Sage/White text */}
          <button
            onClick={() => navigate('/join-room')}
            className="px-6 py-2.5 rounded-full bg-[#202621]/80 border border-[#2E3830] text-[#C2CDC3] font-bold text-[13px] uppercase tracking-wider hover:bg-[#2E3830] hover:text-[#FFFFFF] hover:border-[#93DD35]/40 transition-all active:scale-95 cursor-pointer"
          >
            Join existing room
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;