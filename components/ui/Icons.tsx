import React from "react";

export function OrderBookIcon({ className = "w-4 h-4 text-cyan-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18" stroke="#10b981" />
      <path d="M3 10h12" stroke="#10b981" />
      <path d="M3 14h15" stroke="#f43f5e" />
      <path d="M3 18h9" stroke="#f43f5e" />
    </svg>
  );
}

export function CyberShieldIcon({ className = "w-4 h-4 text-emerald-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" stroke="#10b981" />
    </svg>
  );
}

export function RadarSweepIcon({ className = "w-4 h-4 text-blue-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" strokeDasharray="2 2" />
      <path d="M12 12 19 5" stroke="#06b6d4" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function CpuAgentIcon({ className = "w-4 h-4 text-amber-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
    </svg>
  );
}

export function EnergyBoltIcon({ className = "w-4 h-4 text-cyan-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

export function CryptoTokenIcon({ symbol }: { symbol: string }) {
  const s = symbol.toUpperCase();
  if (s === "BTC") {
    return (
      <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-[10px] font-black font-mono text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.3)]">
        ₿
      </div>
    );
  }
  if (s === "ETH") {
    return (
      <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-[10px] font-black font-mono text-indigo-300 shadow-[0_0_8px_rgba(99,102,241,0.3)]">
        Ξ
      </div>
    );
  }
  if (s === "SOL") {
    return (
      <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-[10px] font-black font-mono text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
        ◎
      </div>
    );
  }
  if (s === "PEPE") {
    return (
      <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center text-[10px] font-black font-mono text-green-400 shadow-[0_0_8px_rgba(34,197,94,0.3)]">
        🐸
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-[9px] font-black font-mono text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]">
      {s.slice(0, 3)}
    </div>
  );
}
