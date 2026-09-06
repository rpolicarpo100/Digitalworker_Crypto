'use client';

import React from 'react';

interface HudFrameProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  accentColor?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'violet';
}

export function HudFrame({
  children,
  className = '',
  title,
  subtitle,
  badge,
  accentColor = 'cyan',
}: HudFrameProps) {
  const accentClasses = {
    cyan: 'border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.12)] text-cyan-400',
    emerald: 'border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.12)] text-emerald-400',
    amber: 'border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.12)] text-amber-400',
    rose: 'border-rose-500/30 shadow-[0_0_25px_rgba(244,63,94,0.12)] text-rose-400',
    violet: 'border-violet-500/30 shadow-[0_0_25px_rgba(139,92,246,0.12)] text-violet-400',
  }[accentColor];

  const bracketColor = {
    cyan: 'border-cyan-400',
    emerald: 'border-emerald-400',
    amber: 'border-amber-400',
    rose: 'border-rose-400',
    violet: 'border-violet-400',
  }[accentColor];

  return (
    <div className={`relative bg-[#050b18]/90 border backdrop-blur-xl rounded-xl p-3 ${accentClasses} ${className} group overflow-hidden`}>
      {/* Sci-Fi HUD Corner Brackets */}
      <span className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${bracketColor} rounded-tl-sm pointer-events-none transition-all duration-300 group-hover:w-4 group-hover:h-4`} />
      <span className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${bracketColor} rounded-tr-sm pointer-events-none transition-all duration-300 group-hover:w-4 group-hover:h-4`} />
      <span className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${bracketColor} rounded-bl-sm pointer-events-none transition-all duration-300 group-hover:w-4 group-hover:h-4`} />
      <span className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${bracketColor} rounded-br-sm pointer-events-none transition-all duration-300 group-hover:w-4 group-hover:h-4`} />

      {/* Cyber Scanline Laser Sweeper */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanline opacity-70 pointer-events-none" />

      {/* Header Banner if Title provided */}
      {(title || subtitle || badge) && (
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 font-mono">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            {title && (
              <h2 className="text-xs font-black tracking-wider uppercase text-slate-100 font-mono flex items-center gap-1.5">
                {title}
              </h2>
            )}
            {subtitle && (
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                [{subtitle}]
              </span>
            )}
          </div>
          {badge && (
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 uppercase tracking-widest font-mono">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
