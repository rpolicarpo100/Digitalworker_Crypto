"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { LanguageToggle } from "../../components/ui/LanguageToggle";
import { EnergyBoltIcon, RadarSweepIcon } from "../../components/ui/Icons";

interface DivergenceAlert {
  symbol: string;
  assetClass: string;
  divergenceType: string;
  priceChangePercent: number;
  volumeOrWhaleAccumulationChangePercent: number;
  divergenceScore: number;
  signalConviction: string;
  analysis: string;
  timestamp: string;
}

export default function DivergencePage() {
  const [alerts, setAlerts] = useState<DivergenceAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDivergence() {
      try {
        const res = await fetch("/api/alerts/divergence");
        if (res.ok) {
          const json = await res.json();
          setAlerts(json.alerts || []);
        }
      } catch (e) {
        console.error("Failed to load divergence alerts:", e);
      } finally {
        setLoading(false);
      }
    }
    loadDivergence();
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
            <span className="text-xl">⚡</span>
            <h1 className="text-xl font-black font-mono tracking-tight text-white uppercase bg-gradient-to-r from-cyan-300 via-sky-100 to-emerald-300 bg-clip-text text-transparent">
              PRICE VS. VOLUME STEALTH ACCUMULATION DIVERGENCE SCANNER
            </h1>
          </div>
          <Badge variant="success" className="text-[9px] font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            [STEALTH_DETECTOR: ARMED]
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          <LanguageToggle />
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-xs font-mono text-cyan-400 animate-pulse">
            [SCANNING_DISCRETE_INSIDER_AND_WHALE_ACCUMULATION_DIVERGENCES...]
          </div>
        ) : (
          alerts.map((al) => (
            <Card key={al.symbol} className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl rounded-2xl overflow-hidden p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-extrabold text-white">{al.symbol}</span>
                    <Badge variant="outline" className="text-[9px] font-mono border-blue-500/40 text-blue-300 font-bold uppercase">
                      {al.assetClass}
                    </Badge>
                  </div>
                  <Badge variant={al.divergenceType.includes("BULLISH") ? "success" : "destructive"} className="text-[9px] font-bold">
                    {al.divergenceType.includes("BULLISH") ? "BULLISH ACCUMULATION" : "BEARISH DISTRIBUTION"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-[#040814] p-2.5 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Price Action:</span>
                    <span className={al.priceChangePercent >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                      {al.priceChangePercent >= 0 ? `+${al.priceChangePercent}%` : `${al.priceChangePercent}%`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Whale Accumulation:</span>
                    <span className={al.volumeOrWhaleAccumulationChangePercent >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                      {al.volumeOrWhaleAccumulationChangePercent >= 0 ? `+${al.volumeOrWhaleAccumulationChangePercent}%` : `${al.volumeOrWhaleAccumulationChangePercent}%`}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#040814] rounded-xl border border-slate-800 text-[10px] text-slate-300">
                  <span className="text-cyan-400 font-bold block mb-0.5 uppercase text-[9px]">[QUANT_ANALYSIS]:</span>
                  <p>{al.analysis}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
