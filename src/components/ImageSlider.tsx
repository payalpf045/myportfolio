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

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);
  const handleTouchStart = () => setIsDragging(true);
  const handleTouchEnd = () => setIsDragging(false);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => isDragging && handleMouseMove(e);
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => isDragging && handleTouchMove(e);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto aspect-video overflow-hidden select-none cursor-ew-resize rounded-lg border-2 border-muted"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={onMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={onTouchMove}
    >
      <Image
        src={afterImage}
        alt="After"
        fill
        className="object-cover pointer-events-none"
        priority
      />

      <div
        className="absolute top-0 left-0 right-0 w-full max-w-4xl mx-auto aspect-video overflow-hidden select-none pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={beforeImage}
          alt="Before"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      <div
        className="absolute top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize pointer-events-none"
        style={{ left: `calc(${sliderPosition}% - 1px)` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-white/90 shadow-md grid place-items-center backdrop-blur-sm">
          <ChevronLeft className="h-6 w-6 text-background" />
          <ChevronRight className="h-6 w-6 text-background -ml-1" />
        </div>
      </div>
    </div>
  );
}
