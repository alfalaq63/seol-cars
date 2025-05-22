'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface NewsTickerProps {
  items: string[];
  speed?: number; // pixels per second
  pauseOnHover?: boolean;
  className?: string;
}

export function NewsTicker({
  items,
  speed = 50,
  pauseOnHover = false, // Changed default to false
  className,
}: NewsTickerProps) {
  const tickerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // Measure the width of the content and container
  useEffect(() => {
    if (contentRef.current && tickerRef.current) {
      setContentWidth(contentRef.current.scrollWidth);
      setContainerWidth(tickerRef.current.clientWidth);
    }

    const handleResize = () => {
      if (contentRef.current && tickerRef.current) {
        setContentWidth(contentRef.current.scrollWidth);
        setContainerWidth(tickerRef.current.clientWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [items]);

  // Animation effect
  useEffect(() => {
    if (isPaused || contentWidth === 0 || containerWidth === 0) return;

    // Start position is at the left edge of the container (for LTR direction)
    const startPosition = -contentWidth;

    let animationFrameId: number;
    let position = startPosition;

    const animate = () => {
      // Move the ticker from left to right
      position += speed / 60; // Adjust speed for 60fps

      // If the ticker has moved completely off the right edge
      if (position > containerWidth) {
        // Reset to start position (left edge)
        position = -contentWidth;
      }

      setCurrentPosition(position);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, contentWidth, containerWidth, speed]);

  return (
    <div
      ref={tickerRef}
      className={cn(
        'overflow-hidden bg-red-600 text-white py-2 relative',
        className
      )}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div
        ref={contentRef}
        className="whitespace-nowrap inline-block"
        style={{
          transform: `translateX(${currentPosition}px)`,
        }}
      >
        {items.map((item, index) => (
          <span key={index} className="mx-4 text-lg font-medium">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
