'use client';

import React from 'react';

export function CyberGridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
      {/* Financial Matrix Grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      />

      {/* Discrete Ambient Dark Luminous Spots */}
      <div className="absolute -top-40 left-1/4 w-[400px] h-[400px] bg-sky-900/10 rounded-full blur-[140px] animate-ambient-pulse" />
      <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-slate-900/20 rounded-full blur-[160px]" />
    </div>
  );
}
