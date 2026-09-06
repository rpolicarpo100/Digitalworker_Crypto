'use client';

import React from 'react';

export function CyberGridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
      {/* Cyber Grid Lines */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      />

      {/* Ambient Gradient Glow Orbs */}
      <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute top-1/3 -right-20 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] animate-pulse delay-1000" />
      <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
    </div>
  );
}
