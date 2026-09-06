"use client";

import Link from "next/link";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

export function GlobalIntelligenceKpis() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono">
      {/* Tile 1: Market Pulse & Regime */}
      <Link href="/macro" className="block group">
        <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 p-3.5 rounded-2xl relative overflow-hidden shadow-lg transition-all duration-300 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center space-x-1">
              <span className="text-emerald-400">●</span>
              <span>[MARKET_PULSE]</span>
            </span>
            <Badge variant="success" className="text-[8px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
              RISK ON
            </Badge>
          </div>
          <div className="text-base font-black text-white group-hover:text-cyan-300 transition-colors">
            BULLISH TRANSITION
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
            <span>Vol Index: <strong className="text-cyan-300">18.2</strong></span>
            <span>Liquidity: <strong className="text-emerald-400">84/100</strong></span>
          </div>
        </Card>
      </Link>

      {/* Tile 2: What Changed Delta */}
      <Link href="/etf-flows" className="block group">
        <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 p-3.5 rounded-2xl relative overflow-hidden shadow-lg transition-all duration-300 group-hover:border-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center space-x-1">
              <span className="text-cyan-400">⚡</span>
              <span>[WHAT_CHANGED_DELTA]</span>
            </span>
            <Badge variant="outline" className="text-[8px] font-bold border-cyan-500/40 text-cyan-300">
              24H FLOWS
            </Badge>
          </div>
          <div className="text-base font-black text-emerald-400">
            +$420M ETF INFLOWS
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
            <span>Form 4 Insiders: <strong className="text-white">$17.7M Purchases</strong></span>
          </div>
        </Card>
      </Link>

      {/* Tile 3: Top Opportunity Class */}
      <Link href="/research" className="block group">
        <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 p-3.5 rounded-2xl relative overflow-hidden shadow-lg transition-all duration-300 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center space-x-1">
              <span className="text-blue-400">◈</span>
              <span>[TOP_OPPORTUNITY]</span>
            </span>
            <Badge variant="success" className="text-[8px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
              SCORE 88/100
            </Badge>
          </div>
          <div className="text-base font-black text-white group-hover:text-cyan-300 transition-colors">
            BTC / NASDAQ ETF
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
            <span>Data Quality: <strong className="text-emerald-400">96/100</strong></span>
            <span>Confidence: <strong className="text-cyan-300">90%</strong></span>
          </div>
        </Card>
      </Link>

      {/* Tile 4: Third Eye & Anomalies */}
      <Link href="/divergence" className="block group">
        <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 p-3.5 rounded-2xl relative overflow-hidden shadow-lg transition-all duration-300 group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center space-x-1">
              <span className="text-amber-400">🛡️</span>
              <span>[THIRD_EYE_ANOMALIES]</span>
            </span>
            <Badge variant="warning" className="text-[8px] font-bold bg-amber-950 text-amber-300 border border-amber-500/40">
              ACCUMULATION
            </Badge>
          </div>
          <div className="text-base font-black text-amber-300">
            STEALTH DIVERGENCE
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
            <span>Whale Balance: <strong className="text-emerald-400">+3.4%</strong></span>
          </div>
        </Card>
      </Link>
    </div>
  );
}
