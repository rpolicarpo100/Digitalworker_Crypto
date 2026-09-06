"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export function GlobalIntelligenceKpis() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono">
      {/* Tile 1: Market Pulse & Regime */}
      <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 p-3 rounded-2xl relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            [MARKET_PULSE]
          </span>
          <Badge variant="success" className="text-[8px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
            RISK ON
          </Badge>
        </div>
        <div className="text-lg font-black text-white">
          BULLISH TRANSITION
        </div>
        <span className="text-[10px] text-slate-400 block mt-0.5">
          Vol Index: <span className="text-cyan-300 font-bold">18.2</span> | Liquidity: <span className="text-emerald-400 font-bold">84/100</span>
        </span>
      </Card>

      {/* Tile 2: What Changed Delta */}
      <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 p-3 rounded-2xl relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            [WHAT_CHANGED_DELTA]
          </span>
          <Badge variant="outline" className="text-[8px] font-bold border-cyan-500/40 text-cyan-300">
            24H FLOWS
          </Badge>
        </div>
        <div className="text-lg font-black text-emerald-400">
          +$420M ETF INFLOWS
        </div>
        <span className="text-[10px] text-slate-400 block mt-0.5">
          Form 4 Insiders: <span className="text-white font-bold">$17.7M Purchases</span>
        </span>
      </Card>

      {/* Tile 3: Top Opportunity Class */}
      <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 p-3 rounded-2xl relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            [TOP_OPPORTUNITY]
          </span>
          <Badge variant="success" className="text-[8px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
            SCORE 88/100
          </Badge>
        </div>
        <div className="text-lg font-black text-white flex items-center space-x-2">
          <span>BTC / NASDAQ ETF</span>
        </div>
        <span className="text-[10px] text-slate-400 block mt-0.5">
          Data Quality: <span className="text-emerald-400 font-bold">96/100</span> | Confidence: <span className="text-cyan-300 font-bold">90%</span>
        </span>
      </Card>

      {/* Tile 4: Third Eye & Anomalies */}
      <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 p-3 rounded-2xl relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            [THIRD_EYE_ANOMALIES]
          </span>
          <Badge variant="warning" className="text-[8px] font-bold bg-amber-950 text-amber-300 border border-amber-500/40">
            ACCUMULATION
          </Badge>
        </div>
        <div className="text-lg font-black text-amber-300">
          STEALTH DIVERGENCE
        </div>
        <span className="text-[10px] text-slate-400 block mt-0.5">
          Whale Balance: <span className="text-emerald-400 font-bold">+3.4%</span> during range consolidation
        </span>
      </Card>
    </div>
  );
}
