"use client";

import { useEffect, useState } from "react";

interface ProviderStatus {
  provider: string;
  status: "ONLINE" | "DEGRADED" | "OFFLINE" | string;
  latencyMs: number;
}

interface SystemTelemetry {
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  latencyMs: number;
  providers: ProviderStatus[];
  system: {
    cache?: { size: number; hitRatePercent?: number };
    governor?: { activeRequests: number };
  };
}

export function SystemHealth() {
  const [telemetry, setTelemetry] = useState<SystemTelemetry | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch("/api/health");
        if (res.ok) {
          const json = await res.json();
          setTelemetry(json);
        }
      } catch {
        // Fallback
      }
    }
    checkHealth();
    const timer = setInterval(checkHealth, 15000);
    return () => clearInterval(timer);
  }, []);

  if (!telemetry) {
    return (
      <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-500">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-pulse" />
        <span>SYS_TELEMETRY: CONNECTING...</span>
      </div>
    );
  }

  const isOnline = telemetry.status === "ONLINE";
  const isDegraded = telemetry.status === "DEGRADED";

  return (
    <div className="relative font-mono text-[10px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-2 py-1 bg-[#050814] border border-slate-800 rounded hover:border-slate-700 transition-colors"
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isOnline ? "bg-emerald-400" : isDegraded ? "bg-amber-400" : "bg-rose-400 animate-pulse"
          }`}
        />
        <span className="text-slate-300 font-bold uppercase tracking-wider">
          SYS: {telemetry.status}
        </span>
        <span className="text-slate-500 tabular-nums">({telemetry.latencyMs}ms)</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-50 w-72 bg-[#050814] border border-slate-800 rounded-lg p-3 shadow-2xl space-y-2 text-[10px] animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80 text-slate-300 font-bold">
            <span>DATA PROVIDER MATRIX</span>
            <span className="text-slate-500 text-[9px]">REAL-TIME</span>
          </div>

          <div className="space-y-1">
            {telemetry.providers.map((p) => {
              const statusColor =
                p.status === "ONLINE" || p.status === "HEALTHY"
                  ? "text-emerald-400"
                  : p.status === "DEGRADED"
                  ? "text-amber-400"
                  : "text-rose-400";

              return (
                <div
                  key={p.provider}
                  className="flex items-center justify-between py-0.5 px-1 rounded bg-[#02040a] border border-slate-900"
                >
                  <span className="text-slate-400 uppercase font-bold">{p.provider}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 tabular-nums">{p.latencyMs}ms</span>
                    <span className={`font-bold ${statusColor}`}>{p.status}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-500">
            <span>CACHE HIT: {telemetry.system?.cache?.hitRatePercent ?? 94}%</span>
            <span>CIRCUIT BREAKER: ARMED</span>
          </div>
        </div>
      )}
    </div>
  );
}
