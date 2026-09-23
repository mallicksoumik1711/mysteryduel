import React, { useState } from 'react';

interface FanCarouselProps {
  images: string[];
}

// 1. Inverted logic for Concave Surround (U-Shape)
// Outer cards are brought forward (+Z, larger scale, highest zIndex)
// Center card is pushed back (-Z, smaller scale, lowest zIndex)
const SLOT_STYLES: Record<number, { rotateY: number; translateX: number; translateZ: number; scale: number; opacity: number; zIndex: number }> = {
  [-3]: { rotateY: 88,  translateX: -510, translateZ: 200,  scale: 1.45, opacity: 1.00, zIndex: 40 },
  [-2]: { rotateY: 58,  translateX: -365, translateZ: 100,   scale: 1.25, opacity: 1.00, zIndex: 30 },
  [-1]: { rotateY: 40,  translateX: -195, translateZ: -10,  scale: 1.15, opacity: 1.00, zIndex: 20 },
  [ 0]: { rotateY:  0,  translateX:    0, translateZ: 10,  scale: 1.05, opacity: 1.00, zIndex: 10 },
  [ 1]: { rotateY: -40, translateX:  195, translateZ: -10,  scale: 1.15, opacity: 1.00, zIndex: 20 },
  [ 2]: { rotateY: -58, translateX:  365, translateZ: 100,   scale: 1.25, opacity: 1.00, zIndex: 30 },
  [ 3]: { rotateY: -88, translateX:  510, translateZ: 200,  scale: 1.45, opacity: 1.00, zIndex: 40 }, 
};

const VISIBLE_COUNT = 7;
const HALF = Math.floor(VISIBLE_COUNT / 2); // 3

export const FanCarousel: React.FC<FanCarouselProps> = ({ images }) => {
  const total = images.length;
  const [centerIndex, setCenterIndex] = useState(Math.floor(total / 2));

  const handlePrev = () => setCenterIndex((p) => (p - 1 + total) % total);
  const handleNext = () => setCenterIndex((p) => (p + 1) % total);

  // Build ordered list of image indices to display
  const slots: number[] = [];
  for (let i = -HALF; i <= HALF; i++) {
    slots.push((centerIndex + i + total) % total);
  }

  return (
    <div className="relative w-full h-[340px] sm:h-[420px] md:h-[480px] flex items-center justify-center select-none overflow-visible">
      {/* Perspective wrapper */}
      <div
        className="relative w-full max-w-7xl h-full flex items-center justify-center"
        style={{ perspective: '1000px', perspectiveOrigin: '50% 50%' }}
      >
        {slots.map((imgIndex, slotPos) => {
          const offset = slotPos - HALF; // -3 to +3
          const s = SLOT_STYLES[offset];
          const isCenter = offset === 0;

          return (
            <div
              key={imgIndex}
              onClick={() => !isCenter && setCenterIndex(imgIndex)}
              className="absolute cursor-pointer"
              style={{
                zIndex: s.zIndex,
                transform: `translateX(${s.translateX}px) translateZ(${s.translateZ}px) rotateY(${s.rotateY}deg) scale(${s.scale})`,
                opacity: s.opacity,
                transition: 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.7s ease',
                transformStyle: 'preserve-3d',
              }}
            >
              <div
                className={`
                  w-[140px] sm:w-[165px] md:w-[185px]
                  aspect-[3/4]
                  rounded-sm overflow-hidden
                  transition-all duration-700
                  shadow-[0_20px_50px_rgba(0,0,0,0.6)]
                  ${isCenter
                    ? 'ring-1 ring-white/20'
                    : 'hover:brightness-110'
                  }
                `}
              >
                <img
                  src={images[imgIndex]}
                  alt={`Card ${imgIndex + 1}`}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
                {/* Subtle inner border overlay */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                {/* Bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Nav Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-10 z-50 p-3 rounded-full bg-black/40 border border-white/10 text-white hover:bg-white/10 hover:border-white/25 transition-all backdrop-blur-md"
        aria-label="Previous"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-10 z-50 p-3 rounded-full bg-black/40 border border-white/10 text-white hover:bg-white/10 hover:border-white/25 transition-all backdrop-blur-md"
        aria-label="Next"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute -bottom-8 flex gap-2 z-50">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCenterIndex(i)}
            className={`h-[3px] rounded-full transition-all duration-300 ${
              i === centerIndex ? 'w-6 bg-white/90' : 'w-[4px] bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};