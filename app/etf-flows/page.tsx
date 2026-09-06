"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { LanguageToggle } from "../../components/ui/LanguageToggle";
import { EnergyBoltIcon } from "../../components/ui/Icons";

interface EtfFlowData {
  etfTicker: string;
  etfName: string;
  underlyingAsset: string;
  netFlow24hUsd: number;
  netFlow7dUsd: number;
  totalAumUsd: number;
  creationUnitsCount: number;
  flowTrend: string;
}

export default function EtfFlowsPage() {
  const [flows, setFlows] = useState<EtfFlowData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFlows() {
      try {
        const res = await fetch("/api/etf-flows");
        if (res.ok) {
          const json = await res.json();
          setFlows(json.flows || []);
        }
      } catch (e) {
        console.error("Failed to load ETF flows:", e);
      } finally {
        setLoading(false);
      }
    }
    loadFlows();
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
            <span className="text-xl">🏛️</span>
            <h1 className="text-xl font-black font-mono tracking-tight text-white uppercase bg-gradient-to-r from-cyan-300 via-sky-100 to-emerald-300 bg-clip-text text-transparent">
              INSTITUTIONAL SPOT ETF CAPITAL FLOWS MONITOR
            </h1>
          </div>
          <Badge variant="success" className="text-[9px] font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            [CREATION_UNITS: STREAMING]
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          <LanguageToggle />
        </div>
      </div>

      {/* ETF Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
        {loading ? (
          <div className="col-span-2 py-16 text-center text-xs font-mono text-cyan-400 animate-pulse">
            [CALCULATING_NET_DAILY_CREATION_AND_REDEMPTION_UNITS...]
          </div>
        ) : (
          flows.map((f) => (
            <Card key={f.etfTicker} className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl rounded-2xl overflow-hidden p-4">
              <div className="flex justify-between items-start mb-3 border-b border-slate-800 pb-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-extrabold text-white">{f.etfTicker}</span>
                    <Badge variant="outline" className="text-[9px] font-mono border-blue-500/40 text-blue-300 font-bold uppercase">
                      {f.underlyingAsset}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans">{f.etfName}</p>
                </div>

                <Badge variant={f.netFlow24hUsd >= 0 ? "success" : "destructive"} className="text-[10px] font-bold">
                  [{f.flowTrend}]
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-[#040814] p-3 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">24h Net Flow:</span>
                  <span className={f.netFlow24hUsd >= 0 ? "text-emerald-400 font-black" : "text-rose-400 font-black"}>
                    {f.netFlow24hUsd >= 0 ? `+$${(f.netFlow24hUsd / 1e6).toFixed(1)}M` : `-$${(Math.abs(f.netFlow24hUsd) / 1e6).toFixed(1)}M`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">7d Net Flow:</span>
                  <span className="text-cyan-300 font-bold">+${(f.netFlow7dUsd / 1e6).toFixed(1)}M</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Total AUM:</span>
                  <span className="text-slate-100 font-bold">${(f.totalAumUsd / 1e9).toFixed(1)}B</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
