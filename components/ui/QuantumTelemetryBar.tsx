'use client';

import React, { useEffect, useState } from 'react';

export function QuantumTelemetryBar() {
  const [latency, setLatency] = useState(3.8);
  const [neuralSync, setNeuralSync] = useState(99.8);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(+(3.2 + Math.random() * 1.5).toFixed(1));
      setNeuralSync(+(99.4 + Math.random() * 0.5).toFixed(1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#02050e]/90 border border-cyan-500/30 rounded-xl p-2 px-3 flex flex-wrap items-center justify-between text-[9px] font-mono text-cyan-300/90 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.1)]">
      <div className="flex items-center space-x-3">
        <span className="flex items-center space-x-1.5 font-bold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>[QUANTUM_CORE: ONLINE]</span>
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-300">
          LATENCY: <strong className="text-cyan-300">{latency}ms</strong>
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-300">
          NEURAL_SYNC: <strong className="text-emerald-300">{neuralSync}%</strong>
        </span>
      </div>

      <div className="flex items-center space-x-3 mt-1 sm:mt-0">
        <span className="text-slate-400">
          MATRIX_FEED: <span className="text-cyan-400 font-bold">RAW_WEBSOCKET</span>
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-amber-400 font-bold flex items-center space-x-1">
          <span>⚡ RISK_ENGINE: ZERO_TRUST</span>
        </span>
      </div>
    </div>
  );
}
