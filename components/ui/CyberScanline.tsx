'use client';

import React from 'react';

export function CyberScanline() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-20">
      {/* Sci-Fi Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px]" />
      
      {/* Continuous Downward Laser Scan Line */}
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanline-vertical opacity-60" />
    </div>
  );
}
