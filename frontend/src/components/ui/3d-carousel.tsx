import React, { useState, useRef, useEffect } from 'react';

interface FanCarouselProps {
  images: string[];
}

// 1. Inverted logic for Concave Surround (U-Shape)
// Outer cards are brought forward (+Z, larger scale, highest zIndex)
// Center card is pushed back (-Z, smaller scale, lowest zIndex)
const SLOT_STYLES: Record<number, { rotateY: number; translateX: number; translateZ: number; scale: number; opacity: number; zIndex: number }> = {
  [-4]: { rotateY: 105, translateX: -610, translateZ: 330, scale: 1.85, opacity: 1.00, zIndex: 50 },
  [-3]: { rotateY: 88, translateX: -510, translateZ: 200, scale: 1.45, opacity: 1.00, zIndex: 40 },
  [-2]: { rotateY: 58, translateX: -365, translateZ: 100, scale: 1.25, opacity: 1.00, zIndex: 30 },
  [-1]: { rotateY: 40, translateX: -195, translateZ: -10, scale: 1.15, opacity: 1.00, zIndex: 20 },
  [0]: { rotateY: 0, translateX: 0, translateZ: 10, scale: 1.05, opacity: 1.00, zIndex: 10 },
  [1]: { rotateY: -40, translateX: 195, translateZ: -10, scale: 1.15, opacity: 1.00, zIndex: 20 },
  [2]: { rotateY: -58, translateX: 365, translateZ: 100, scale: 1.25, opacity: 1.00, zIndex: 30 },
  [3]: { rotateY: -88, translateX: 510, translateZ: 200, scale: 1.45, opacity: 1.00, zIndex: 40 },
  [4]: { rotateY: -105, translateX: 610, translateZ: 330, scale: 1.85, opacity: 1.00, zIndex: 50 },
};

const VISIBLE_COUNT = 9;
const HALF = Math.floor(VISIBLE_COUNT / 2); // 4

export const FanCarousel: React.FC<FanCarouselProps> = ({ images }) => {
  const total = images.length;
  const [centerIndex, setCenterIndex] = useState(Math.floor(total / 2));
  const prevOffsetsRef = useRef<Record<number, number>>({});

  const handlePrev = () => setCenterIndex((p) => (p - 1 + total) % total);
  const handleNext = () => setCenterIndex((p) => (p + 1) % total);

  // Calculate current slot offset for each image
  const currentOffsets: Record<number, number> = {};
  images.forEach((_, imgIndex) => {
    let offset = imgIndex - centerIndex;
    while (offset > HALF) offset -= total;
    while (offset < -HALF) offset += total;
    currentOffsets[imgIndex] = offset;
  });

  useEffect(() => {
    prevOffsetsRef.current = currentOffsets;
  });

  return (
    <div className="relative w-full h-[340px] sm:h-[420px] md:h-[480px] flex items-center justify-center select-none overflow-visible">
      {/* Perspective wrapper */}
      <div
        className="relative w-full max-w-7xl h-full flex items-center justify-center"
        style={{ perspective: '1000px', perspectiveOrigin: '50% 50%' }}
      >
        {/* Render elements in stable image order so React never re-orders DOM nodes.
            Re-ordering DOM nodes in React cancels CSS transitions in browsers when navigating backwards. */}
        {images.map((imgUrl, imgIndex) => {
          const offset = currentOffsets[imgIndex];
          const s = SLOT_STYLES[offset];
          if (!s) return null;

          const isCenter = offset === 0;
          const prevOffset = prevOffsetsRef.current[imgIndex];
          const hasWrapped = prevOffset !== undefined && Math.abs(offset - prevOffset) > HALF;

          return (
            <div
              key={imgIndex}
              onClick={() => !isCenter && setCenterIndex(imgIndex)}
              className="absolute cursor-pointer"
              style={{
                zIndex: s.zIndex,
                transform: `translateX(${s.translateX}px) translateZ(${s.translateZ}px) rotateY(${s.rotateY}deg) scale(${s.scale})`,
                opacity: s.opacity,
                transition: hasWrapped
                  ? 'opacity 0.4s ease'
                  : 'transform 1.7s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.7s ease',
                transformStyle: 'preserve-3d',
              }}
            >
              <div
                className={`
                  relative
                  w-[140px] sm:w-[165px] md:w-[185px]
                  aspect-[3/4]
                  rounded-xl
                  overflow-hidden
                  isolate
                  [clip-path:inset(0_round_0.75rem)]
                  transition-all duration-700
                  shadow-[0_20px_50px_rgba(0,0,0,0.6)]
                `}
              >
                <img
                  src={imgUrl}
                  alt={`Card ${imgIndex + 1}`}
                  className="w-full h-full object-cover rounded-xl pointer-events-none"
                  draggable={false}
                />
                {/* Bottom gradient with rounded corners */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-[#111612] via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Nav Arrows with higher z-index so outer 3D cards cannot intercept clicks */}
      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-10 z-[100] p-3 rounded-full bg-black/50 border border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all backdrop-blur-md cursor-pointer active:scale-95 shadow-lg"
        aria-label="Previous"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-10 z-[100] p-3 rounded-full bg-black/50 border border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all backdrop-blur-md cursor-pointer active:scale-95 shadow-lg"
        aria-label="Next"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
