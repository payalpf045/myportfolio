"use client";

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageSliderProps {
  beforeImage: string;
  afterImage: string;
}

export function ImageSlider({ beforeImage, afterImage }: ImageSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleInteractionStart = useCallback((clientX: number) => {
    setIsDragging(true);
    handleMove(clientX);
  }, [handleMove]);

  const handleInteractionEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInteractionMove = useCallback((clientX: number) => {
    if (isDragging) {
      handleMove(clientX);
    }
  }, [isDragging, handleMove]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto overflow-hidden select-none cursor-ew-resize rounded-lg border-2 border-muted"
      onMouseDown={(e) => handleInteractionStart(e.clientX)}
      onMouseUp={handleInteractionEnd}
      onMouseLeave={handleInteractionEnd}
      onMouseMove={(e) => handleInteractionMove(e.clientX)}
      onTouchStart={(e) => handleInteractionStart(e.touches[0].clientX)}
      onTouchEnd={handleInteractionEnd}
      onTouchMove={(e) => handleInteractionMove(e.touches[0].clientX)}
    >
      {/* After Image (Base Layer) */}
      <div className="relative aspect-video">
        <Image
            src={afterImage}
            alt="After"
            fill
            className="object-contain"
            priority
        />
      </div>

      {/* Before Image (Clipped Layer) */}
      <div
          className="absolute top-0 left-0 w-full h-full overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
          <Image
              src={beforeImage}
              alt="Before"
              fill
              className="object-contain"
              priority
          />
      </div>
      
      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize -translate-x-1/2"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-white/90 shadow-md grid place-items-center backdrop-blur-sm">
          <ChevronLeft className="h-6 w-6 text-background" />
          <ChevronRight className="h-6 w-6 text-background -ml-1" />
        </div>
      </div>
    </div>
  );
}
