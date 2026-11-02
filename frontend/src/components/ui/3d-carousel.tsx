import React, { useState, useRef, useEffect } from 'react';

interface FanCarouselProps {
  images: string[];
}

const SLOT_STYLES: Record<number, {
  rotateY: number;
  translateX: number;
  translateZ: number;
  scale: number;
  opacity: number;
  zIndex: number;
}> = {
  [-6]: { rotateY: 135, translateX: -1350, translateZ: 690, scale: 7.90, opacity: 1.00, zIndex: 70 },
  [-5]: { rotateY: 115, translateX: -790, translateZ: 450, scale: 2.95, opacity: 1.00, zIndex: 60 },
  [-4]: { rotateY: 105, translateX: -610, translateZ: 330, scale: 1.85, opacity: 1.00, zIndex: 50 },
  [-3]: { rotateY: 88, translateX: -510, translateZ: 200, scale: 1.45, opacity: 1.00, zIndex: 40 },
  [-2]: { rotateY: 58, translateX: -365, translateZ: 100, scale: 1.25, opacity: 1.00, zIndex: 30 },
  [-1]: { rotateY: 40, translateX: -195, translateZ: -10, scale: 1.15, opacity: 1.00, zIndex: 20 },
  [0]: { rotateY: 0, translateX: 0, translateZ: 10, scale: 1.05, opacity: 1.00, zIndex: 10 },
  [1]: { rotateY: -40, translateX: 195, translateZ: -10, scale: 1.15, opacity: 1.00, zIndex: 20 },
  [2]: { rotateY: -58, translateX: 365, translateZ: 100, scale: 1.25, opacity: 1.00, zIndex: 30 },
  [3]: { rotateY: -88, translateX: 510, translateZ: 200, scale: 1.45, opacity: 1.00, zIndex: 40 },
  [4]: { rotateY: -105, translateX: 610, translateZ: 330, scale: 1.85, opacity: 1.00, zIndex: 50 },
  [5]: { rotateY: -115, translateX: 790, translateZ: 450, scale: 2.95, opacity: 1.00, zIndex: 60 },
  [6]: { rotateY: -135, translateX: 1350, translateZ: 690, scale: 7.90, opacity: 1.00, zIndex: 70 },
};

const VISIBLE_COUNT = 13;
const HALF = Math.floor(VISIBLE_COUNT / 2);
const AUTO_PLAY_DELAY = 2500;
const SWIPE_THRESHOLD = 50;

export const FanCarousel: React.FC<FanCarouselProps> = ({ images }) => {
  const total = images.length;

  const [centerIndex, setCenterIndex] = useState(Math.floor(total / 2));

  const prevOffsetsRef = useRef<Record<number, number>>({});

  const dragStartRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const dragDistanceRef = useRef(0);

  const [isDragging, setIsDragging] = useState(false);

  // Automatic movement every 2.5 seconds
  useEffect(() => {
    if (total <= 1 || isDragging) return;

    const interval = setInterval(() => {
      setCenterIndex((p) => (p + 1) % total);
    }, AUTO_PLAY_DELAY);

    return () => clearInterval(interval);
  }, [total, isDragging]);

  // Mouse and touch drag start
  const handleDragStart = (clientX: number) => {
    dragStartRef.current = clientX;
    dragDistanceRef.current = 0;
    isDraggingRef.current = true;
    setIsDragging(true);
  };

  // Mouse and touch movement
  const handleDragMove = (clientX: number) => {
    if (dragStartRef.current === null) return;

    dragDistanceRef.current = clientX - dragStartRef.current;
  };

  // Mouse and touch drag end
  const handleDragEnd = () => {
    if (dragStartRef.current === null) return;

    const distance = dragDistanceRef.current;

    if (Math.abs(distance) > SWIPE_THRESHOLD) {
      if (distance < 0) {
        setCenterIndex((p) => (p + 1) % total);
      } else {
        setCenterIndex((p) => (p - 1 + total) % total);
      }
    }

    dragStartRef.current = null;
    dragDistanceRef.current = 0;
    isDraggingRef.current = false;
    setIsDragging(false);
  };

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

  if (total === 0) return null;

  return (
    <div
      className="relative w-full h-[340px] sm:h-[420px] md:h-[480px] flex items-center justify-center select-none overflow-visible"
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseMove={(e) => handleDragMove(e.clientX)}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
      onTouchEnd={handleDragEnd}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'pan-y',
      }}
    >
      {/* Perspective wrapper */}
      <div
        className="relative w-full max-w-7xl h-full flex items-center justify-center"
        style={{
          perspective: '1000px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {images.map((imgUrl, imgIndex) => {
          const offset = currentOffsets[imgIndex];
          const s = SLOT_STYLES[offset];

          if (!s) return null;

          const isCenter = offset === 0;

          const prevOffset = prevOffsetsRef.current[imgIndex];

          const hasWrapped =
            prevOffset !== undefined &&
            Math.abs(offset - prevOffset) > HALF;

          return (
            <div
              key={imgIndex}
              onClick={() => {
                if (
                  !isCenter &&
                  !isDraggingRef.current &&
                  Math.abs(dragDistanceRef.current) < SWIPE_THRESHOLD
                ) {
                  setCenterIndex(imgIndex);
                }
              }}
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
                className="
                  relative
                  w-[185px]
                  aspect-[3/4]
                  rounded-xl
                  overflow-hidden
                  isolate
                  [clip-path:inset(0_round_0.75rem)]
                  transition-all duration-700
                  shadow-[0_20px_50px_rgba(0,0,0,0.6)]
                "
              >
                <img
                  src={imgUrl}
                  alt={`Card ${imgIndex + 1}`}
                  className="w-full h-full object-cover rounded-xl pointer-events-none"
                  draggable={false}
                />

                {/* Bottom gradient */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-[#111612] via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};