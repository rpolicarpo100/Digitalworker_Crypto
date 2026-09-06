'use client';

import React from 'react';

interface BorderBeamProps {
  size?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
}

export function BorderBeam({
  size = 200,
  duration = 8,
  colorFrom = '#06b6d4',
  colorTo = '#10b981',
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          '--size': `${size}px`,
          '--duration': `${duration}s`,
          '--color-from': colorFrom,
          '--color-to': colorTo,
        } as React.CSSProperties
      }
      className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
    >
      <div
        className="absolute aspect-square w-[var(--size)] animate-border-beam bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent"
        style={{
          offsetPath: 'rect(0 auto auto 0 round inherit)',
        }}
      />
    </div>
  );
}
