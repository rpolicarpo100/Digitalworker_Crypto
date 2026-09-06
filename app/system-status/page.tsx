"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

interface ProviderStatus {
  provider: string;
  status: string;
  latencyMs: number;
  dataQuality: number;
}

interface SystemStatusData {
  systemHealth: string;
  activeNodeTime: string;
  providerHealth: ProviderStatus[];
  cacheMetrics: {
    lruHitRatePercent: number;
    cachedKeys: number;
    evictions: number;
  };
  engineStatus: Record<string, string>;
}

export default function SystemStatusPage() {
  const [data, setData] = useState<SystemStatusData | null>(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await fetch("/api/system/status");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Failed to fetch system status:", e);
      }
    }
    loadStatus();
  }, []);

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-4 bg-[#030712] min-h-screen text-slate-100 font-sans relative">
      <div className="fixed inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none z-0" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between border border-cyan-500/20 bg-[#070d1e]/80 backdrop-blur-xl p-3.5 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.08)]">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Button variant="outline" size="sm" className="bg-[#0b142b] border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-black font-mono font-bold text-xs transition-all duration-300 rounded-xl">
              ← Terminal
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <span className="text-xl">🛡️</span>
            <h1 className="text-xl font-black font-mono tracking-tight text-white uppercase bg-gradient-to-r from-cyan-300 via-sky-100 to-emerald-300 bg-clip-text text-transparent">
              GOD SYSTEM HEALTH & DATA PROVENANCE STATUS
            </h1>
          </div>
        </div>

        <Badge variant="success" className="text-[9px] font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
          [SYSTEM_HEALTH: {data?.systemHealth || "OPTIMAL"}]
        </Badge>
      </div>

      {/* Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
        {/* Providers */}
        <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 space-y-3">
          <h2 className="text-xs font-bold text-cyan-300 uppercase tracking-widest border-b border-slate-800 pb-2">
            [DATA_PROVIDER_HEALTH_AND_LATENCY]
          </h2>
          <div className="space-y-2">
            {data?.providerHealth.map((p) => (
              <div key={p.provider} className="flex items-center justify-between bg-[#040814] p-2.5 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-200 font-bold block">{p.provider}</span>
                  <span className="text-slate-500 text-[9px]">Latency: {p.latencyMs}ms | Quality: {p.dataQuality}/100</span>
                </div>
                <Badge variant={p.status === "HEALTHY" ? "success" : "warning"} className="text-[9px] font-bold">
                  {p.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Engine Status */}
        <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 space-y-3">
          <h2 className="text-xs font-bold text-cyan-300 uppercase tracking-widest border-b border-slate-800 pb-2">
            [ANALYTICAL_ENGINE_INTEGRITY]
          </h2>
          <div className="space-y-2">
            {data &&
              Object.entries(data.engineStatus).map(([engine, status]) => (
                <div key={engine} className="flex items-center justify-between bg-[#040814] p-2.5 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-300 font-bold">{engine}</span>
                  <Badge variant="outline" className="text-[9px] font-mono border-emerald-500/40 text-emerald-400 font-bold">
                    [{status}]
                  </Badge>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
