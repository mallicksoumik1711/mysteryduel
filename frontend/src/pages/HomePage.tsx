import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FanCarousel } from '@/components/ui/3d-carousel';
import { Gamepad2 } from 'lucide-react';

const characterHeroImages = [
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
    // Changed to strictly `h-screen` and `overflow-hidden` to prevent any vertical scrolling
    <div className="relative h-screen w-full bg-[#111612] text-[#FFFFFF] font-sans flex flex-col overflow-hidden select-none">
      
      {/* Noise / Grain Texture Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />

      {/* Dynamic Background Glows */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="w-[800px] h-[400px] bg-[#93DD35]/10 blur-[150px] rounded-[100%]" />
      </div>

      {/* Main Container: Uses h-full and flex column to dynamically fit screen height without overflow */}
      <main className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col justify-between">
        
        {/* CAROUSEL WRAPPER: Uses flex-1 to automatically stretch and fill available space between header and footer */}
        <div className="relative w-full flex-1 flex items-center justify-center">
          
          {/* Top Embedded Text */}
          <div className="absolute top-0 md:top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center drop-shadow-xl pointer-events-none">
             <div className="w-12 h-12 mb-2 md:mb-3 rounded-2xl bg-[#93DD35] text-[#111612] flex items-center justify-center shadow-[0_0_30px_rgba(147,221,53,0.3)]">
              <Gamepad2 className="w-7 h-7" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase leading-none">
              Mystery<span className="text-[#93DD35]">Duel</span>?
            </h1>
          </div>

          {/* Center 3D Carousel */}
          <div className="w-full absolute inset-0 flex items-center justify-center">
            <FanCarousel images={characterHeroImages} />
          </div>

          {/* Bottom Embedded Text */}
          <div className="absolute bottom-0 md:bottom-10 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl text-center pointer-events-none drop-shadow-2xl">
            <p className="text-[#A2B1A4] text-xs md:text-sm leading-relaxed px-4 text-shadow-sm backdrop-blur-[2px] rounded-full">
              Bring your party to life with real-time multiplayer deduction. Ask strategic questions, unravel clues, and unmask the hidden identities before time runs out.
            </p>
          </div>
          
        </div>

        {/* Action Controls - Locked at the bottom, using shrink-0 so they never compress */}
        <div className="flex items-center justify-center gap-3 z-30 shrink-0">
          <button
            onClick={() => navigate('/create-room')}
            className="px-6 py-2.5 rounded-full bg-[#93DD35] text-[#171C18] font-black text-[13px] uppercase tracking-wider hover:bg-[#85c82e] transition-all shadow-[0_0_30px_rgba(147,221,53,0.3)] active:scale-95 cursor-pointer"
          >
            Create new room
          </button>

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