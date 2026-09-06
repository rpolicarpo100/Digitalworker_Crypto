"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { LanguageToggle } from "../../components/ui/LanguageToggle";
import { EnergyBoltIcon, CyberShieldIcon } from "../../components/ui/Icons";

interface TokenUnlockEvent {
  symbol: string;
  projectName: string;
  unlockDate: string;
  daysRemaining: number;
  unlockedAmountUsd: number;
  unlockedTokensCount: number;
  percentOfCirculatingSupply: number;
  unlockCategory: string;
  sellPressureImpact: string;
  recommendation: string;
}

export default function UnlocksPage() {
  const [unlocks, setUnlocks] = useState<TokenUnlockEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUnlocks() {
      try {
        const res = await fetch("/api/crypto/unlocks");
        if (res.ok) {
          const json = await res.json();
          setUnlocks(json.unlocks || []);
        }
      } catch (e) {
        console.error("Failed to load token unlocks:", e);
      } finally {
        setLoading(false);
      }
    }
    loadUnlocks();
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
            <span className="text-xl">🔓</span>
            <h1 className="text-xl font-black font-mono tracking-tight text-white uppercase bg-gradient-to-r from-cyan-300 via-sky-100 to-emerald-300 bg-clip-text text-transparent">
              TOKEN UNLOCKS & SUPPLY PRESSURE TRACKER
            </h1>
          </div>
          <Badge variant="success" className="text-[9px] font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            [SUPPLY_SHOCK_GUARD: ACTIVE]
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          <LanguageToggle />
        </div>
      </div>

      {/* Unlocks Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-16 text-center text-xs font-mono text-cyan-400 animate-pulse">
            [TRACKING_VESTING_SCHEDULES_AND_VC_UNLOCKS...]
          </div>
        ) : (
          unlocks.map((u) => (
            <Card key={u.symbol} className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl rounded-2xl overflow-hidden font-mono">
              <CardHeader className="pb-2 border-b border-slate-800">
                <CardTitle className="text-sm font-black flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-lg font-extrabold">{u.symbol}</span>
                    <Badge variant={u.sellPressureImpact === "HIGH" || u.sellPressureImpact === "SEVERE" ? "destructive" : "success"} className="text-[10px] font-bold">
                      [{u.sellPressureImpact}_IMPACT]
                    </Badge>
                  </div>
                  <span className="text-amber-400 text-lg font-black font-mono">
                    ${(u.unlockedAmountUsd / 1000000).toFixed(1)}M
                  </span>
                </CardTitle>
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">{u.projectName}</p>
              </CardHeader>

              <CardContent className="pt-3 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 bg-[#040814] p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Unlock Date:</span>
                    <span className="text-cyan-300 font-bold">{u.unlockDate} ({u.daysRemaining}d)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">% Circulating Supply:</span>
                    <span className="text-slate-100 font-bold">+{u.percentOfCirculatingSupply}%</span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#040814] rounded-xl border border-slate-800 text-[11px]">
                  <span className="text-slate-400 font-bold block mb-0.5 uppercase text-[9px]">Category: {u.unlockCategory}</span>
                  <p className="text-slate-300 text-[10px] leading-snug">{u.recommendation}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
