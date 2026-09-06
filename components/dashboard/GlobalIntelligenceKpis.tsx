"use client";

import Link from "next/link";
import { Badge } from "../ui/badge";

export function GlobalIntelligenceKpis() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 font-mono">
      {/* Tile 1: Market Pulse & Regime */}
      <Link href="/macro" className="block group">
        <div className="bg-[#050814]/90 border border-slate-800/80 p-3 rounded-xl transition-colors group-hover:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>MARKET_PULSE</span>
            </div>
            <Badge variant="outline" className="text-[8px] font-bold bg-slate-900 text-emerald-400 border-slate-700">
              RISK ON
            </Badge>
          </div>
          <div className="text-sm font-black text-slate-100 group-hover:text-sky-400 transition-colors uppercase tracking-tight">
            BULLISH TRANSITION
          </div>
          <div className="mt-1 flex items-center justify-between text-[9px] text-slate-500">
            <span>VOL INDEX: <strong className="text-sky-400 tabular-nums">18.2</strong></span>
            <span>LIQUIDITY: <strong className="text-emerald-400 tabular-nums">84 / 100</strong></span>
          </div>
        </div>
      </Link>

      {/* Tile 2: What Changed Delta */}
      <Link href="/etf-flows" className="block group">
        <div className="bg-[#050814]/90 border border-slate-800/80 p-3 rounded-xl transition-colors group-hover:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span>WHAT_CHANGED_DELTA</span>
            </div>
            <Badge variant="outline" className="text-[8px] font-bold bg-slate-900 border-slate-700 text-sky-300">
              24H FLOWS
            </Badge>
          </div>
          <div className="text-sm font-black text-emerald-400 tabular-nums uppercase tracking-tight">
            +$420M ETF INFLOWS
          </div>
          <div className="mt-1 flex items-center justify-between text-[9px] text-slate-500">
            <span>FORM 4 INSIDERS: <strong className="text-slate-200 tabular-nums">$17.7M BUY</strong></span>
          </div>
        </div>
      </Link>

      {/* Tile 3: Top Opportunity Class */}
      <Link href="/research" className="block group">
        <div className="bg-[#050814]/90 border border-slate-800/80 p-3 rounded-xl transition-colors group-hover:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span>TOP_OPPORTUNITY</span>
            </div>
            <Badge variant="outline" className="text-[8px] font-bold bg-slate-900 text-emerald-400 border-slate-700 tabular-nums">
              SCORE 88/100
            </Badge>
          </div>
          <div className="text-sm font-black text-slate-100 group-hover:text-sky-400 transition-colors uppercase tracking-tight">
            BTC / NASDAQ ETF
          </div>
          <div className="mt-1 flex items-center justify-between text-[9px] text-slate-500">
            <span>DATA QUALITY: <strong className="text-emerald-400 tabular-nums">96/100</strong></span>
            <span>CONFIDENCE: <strong className="text-sky-300 tabular-nums">90%</strong></span>
          </div>
        </div>
      </Link>

      {/* Tile 4: Third Eye & Anomalies */}
      <Link href="/divergence" className="block group">
        <div className="bg-[#050814]/90 border border-slate-800/80 p-3 rounded-xl transition-colors group-hover:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>THIRD_EYE_ANOMALIES</span>
            </div>
            <Badge variant="outline" className="text-[8px] font-bold bg-slate-900 text-amber-300 border-slate-700">
              ACCUMULATION
            </Badge>
          </div>
          <div className="text-sm font-black text-amber-300 uppercase tracking-tight">
            STEALTH DIVERGENCE
          </div>
          <div className="mt-1 flex items-center justify-between text-[9px] text-slate-500">
            <span>WHALE BALANCE: <strong className="text-emerald-400 tabular-nums">+3.4%</strong></span>
          </div>
        </div>
      </Link>
    </div>
  );
}
