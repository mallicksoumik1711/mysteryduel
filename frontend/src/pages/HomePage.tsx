import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FanCarousel } from '@/components/ui/3d-carousel';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { Gamepad2 } from 'lucide-react';

const characterHeroImages = [
  '/carousel/img1.jpg',
  '/carousel/img2.jpg',
  '/carousel/img3.jpg',
  '/carousel/img4.jpg',
  '/carousel/img5.jpg',
  '/carousel/img6.jpg',
  '/carousel/img7.jpg',
  '/carousel/img8.jpg',
  '/carousel/img9.jpg',
  '/carousel/img10.jpg',
  '/carousel/img11.jpg',
  '/carousel/img12.jpg',
  '/carousel/img13.jpg',
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative h-screen w-full bg-[#111612] text-[#FFFFFF] font-sans flex flex-col overflow-hidden bg-center"
      style={{
        backgroundImage: `
        linear-gradient(rgba(4, 5, 4, 0.8), rgba(5, 8, 6, 0.92)),
        url('background-mysteryduel.jpg')
      `,
      }}
    >
      <NoiseOverlay />

      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="w-[800px] h-[400px] bg-[#93DD35]/10 blur-[150px] rounded-[100%]" />
      </div>

      <main className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-4 py-6 sm:py-8 flex flex-col justify-between">

        {/* CAROUSEL WRAPPER */}
        <div className="relative w-full flex-1 flex items-center justify-center">

          {/* Top Embedded Text */}
          <div className="absolute top-0 md:top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center drop-shadow-xl pointer-events-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mb-2 md:mb-3 rounded-full bg-[#93DD35] text-[#111612] flex items-center justify-center shadow-[0_0_30px_rgba(147,221,53,0.3)]">
              <Gamepad2 className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
            <h1 className="londrina-solid-regular text-5xl sm:text-5xl md:text-5xl font-black tracking-tight text-white uppercase leading-none">
              Mystery<span className="text-[#93DD35]">Duel</span>?
            </h1>
          </div>

          {/* Center 3D Carousel */}
          <div className="w-full absolute inset-0 flex items-center justify-center">
            <FanCarousel images={characterHeroImages} />
          </div>

          {/* Bottom Embedded Text */}
          <div className="absolute bottom-2 md:bottom-10 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-md text-center pointer-events-none drop-shadow-2xl">
            <p className="text-[#A2B1A4] text-[11px] sm:text-sm leading-snug sm:leading-relaxed px-3 py-1.5 bg-black/20 backdrop-blur-sm shadow-inner">
              Bring your party to life with real-time multiplayer deduction. Ask strategic questions, unravel clues, and unmask the hidden identities before time runs out.
            </p>
          </div>

        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 z-30 shrink-0">
          <button
            onClick={() => navigate('/create-room')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#93DD35] text-[#171C18] font-black text-[13px] uppercase tracking-wider hover:bg-[#85c82e] transition-all shadow-[0_0_30px_rgba(147,221,53,0.3)] active:scale-95 cursor-pointer"
          >
            Create new room
          </button>

          <button
            onClick={() => navigate('/join-room')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#202621]/40 border border-[#2E3830] font-bold text-[13px] uppercase tracking-wider hover:bg-[#2E3830] hover:text-[#FFFFFF] hover:border-[#93DD35]/40 transition-all active:scale-95 cursor-pointer"
          >
            Join existing room
          </button>
        </div>

      </main>
    </div>
  );
};

export default HomePage;