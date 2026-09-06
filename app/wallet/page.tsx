"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { LanguageToggle } from "../../components/ui/LanguageToggle";
import { CyberShieldIcon, EnergyBoltIcon, RadarSweepIcon } from "../../components/ui/Icons";

interface WhaleWallet {
  address: string;
  blockchain: string;
  label: string;
  winRatePercent: number;
  totalRealizedProfitUsd: number;
  portfolioValueUsd: number;
  recentAccumulatedTokens: Array<{
    symbol: string;
    amountUsd: number;
    avgEntryPrice: number;
    timestamp: string;
  }>;
  riskRating: string;
  lastActive: string;
}

interface WhaleAggregatedKpis {
  totalWhalesCount: number;
  totalWhaleAumUsd: number;
  avgWinRatePercent: number;
  totalRealizedProfitUsd: number;
  topAccumulatedAssets: Array<{ symbol: string; totalAmountUsd: number }>;
  netFlow24hUsd: number;
  highRiskWhalesCount: number;
}

export default function WalletTrackerPage() {
  const [whales, setWhales] = useState<WhaleWallet[]>([]);
  const [kpis, setKpis] = useState<WhaleAggregatedKpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [chainFilter, setChainFilter] = useState("all");

  useEffect(() => {
    async function loadWhales() {
      setLoading(true);
      try {
        const res = await fetch(`/api/wallet/analyze?chain=${chainFilter}`);
        if (res.ok) {
          const json = await res.json();
          setWhales(json.whales || []);
          if (json.kpis) setKpis(json.kpis);
        }
      } catch (e) {
        console.error("Failed to load whales:", e);
      } finally {
        setLoading(false);
      }
    }
    loadWhales();
  }, [chainFilter]);

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
            <span className="text-xl">🐋</span>
            <h1 className="text-xl font-black font-mono tracking-tight text-white uppercase bg-gradient-to-r from-cyan-300 via-sky-100 to-emerald-300 bg-clip-text text-transparent">
              SMART MONEY & WHALE TRACKER ANALYTICS
            </h1>
          </div>
          <Badge variant="success" className="text-[9px] font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            [7_INSTITUTIONAL_NODES: ACTIVE]
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          <LanguageToggle />
        </div>
      </div>

      {/* Aggregated KPI Dashboard Bar */}
      {kpis && (
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
          <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-3 shadow-lg">
            <span className="text-slate-400 block text-[9px] font-bold uppercase">[TOTAL_WHALE_AUM]</span>
            <span className="text-emerald-400 text-xl font-black">${(kpis.totalWhaleAumUsd / 1e6).toFixed(1)}M</span>
            <span className="text-[10px] text-slate-500 block">Across {kpis.totalWhalesCount} Monitored Wallets</span>
          </Card>

          <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-3 shadow-lg">
            <span className="text-slate-400 block text-[9px] font-bold uppercase">[AVERAGE_WIN_RATE]</span>
            <span className="text-cyan-300 text-xl font-black">{kpis.avgWinRatePercent}%</span>
            <span className="text-[10px] text-emerald-400 block">High Conviction Cluster</span>
          </Card>

          <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-3 shadow-lg">
            <span className="text-slate-400 block text-[9px] font-bold uppercase">[NET_FLOW_24H]</span>
            <span className="text-emerald-400 text-xl font-black">+${(kpis.netFlow24hUsd / 1e6).toFixed(1)}M</span>
            <span className="text-[10px] text-slate-500 block">Active Capital Accumulation</span>
          </Card>

          <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-3 shadow-lg">
            <span className="text-slate-400 block text-[9px] font-bold uppercase">[TOP_ACCUMULATED]</span>
            <div className="flex items-center space-x-2 mt-1">
              {kpis.topAccumulatedAssets.slice(0, 3).map((a) => (
                <Badge key={a.symbol} variant="outline" className="text-[10px] font-bold border-cyan-500/40 text-cyan-300">
                  {a.symbol} (${(a.totalAmountUsd / 1e6).toFixed(1)}M)
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Filter Bar */}
      <div className="relative z-10 flex items-center space-x-2 overflow-x-auto pb-1 text-xs bg-[#070d1e]/80 p-3 rounded-2xl border border-cyan-500/20">
        <span className="text-slate-500 font-mono text-[9px] uppercase font-bold mr-1">[FILTER_CHAIN]:</span>
        {["all", "solana", "ethereum", "arbitrum", "bsc", "polygon"].map((chain) => (
          <button
            key={chain}
            onClick={() => setChainFilter(chain)}
            className={`px-3 py-1 rounded-xl text-[11px] font-mono font-bold transition-all duration-300 ${
              chainFilter === chain
                ? "bg-cyan-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                : "bg-[#040814] border border-slate-800 text-slate-400 hover:text-slate-100"
            }`}
          >
            [{chain.toUpperCase()}]
          </button>
        ))}
      </div>

      {/* Whales Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-xs font-mono text-cyan-400 animate-pulse">
            [SCANNING_ONCHAIN_WHALE_WALLETS...]
          </div>
        ) : whales.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-xs font-mono text-slate-400">
            No whale wallets detected for this filter.
          </div>
        ) : (
          whales.map((w) => (
            <Card key={w.address} className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="pb-2 border-b border-slate-800/80">
                <CardTitle className="text-sm font-black font-mono flex items-center justify-between">
                  <span className="text-slate-100">{w.label}</span>
                  <Badge variant="outline" className="text-[9px] font-mono border-blue-500/40 text-blue-300 font-bold uppercase">
                    {w.blockchain}
                  </Badge>
                </CardTitle>
                <p className="text-[10px] text-slate-500 font-mono break-all mt-1">{w.address}</p>
              </CardHeader>

              <CardContent className="pt-3 space-y-3 font-mono text-xs">
                <div className="grid grid-cols-2 gap-2 bg-[#040814] p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Win Rate:</span>
                    <span className="text-emerald-400 font-black text-sm">{w.winRatePercent}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Realized Profit:</span>
                    <span className="text-slate-100 font-bold">${(w.totalRealizedProfitUsd / 1000000).toFixed(2)}M</span>
                  </div>
                </div>

                <div>
                  <span className="text-cyan-400 font-bold text-[10px] uppercase block mb-1 flex items-center space-x-1">
                    <EnergyBoltIcon className="w-3 h-3 text-cyan-400" />
                    <span>Recent Token Accumulation:</span>
                  </span>
                  <div className="space-y-1 bg-[#040814] p-2 rounded-xl border border-slate-800/80">
                    {w.recentAccumulatedTokens.map((t, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-200 font-extrabold">{t.symbol}</span>
                        <span className="text-emerald-400 font-bold">${(t.amountUsd / 1000000).toFixed(2)}M</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                  <span className="flex items-center space-x-1">
                    <CyberShieldIcon className="w-3 h-3 text-emerald-400" />
                    <span>RISK: {w.riskRating}</span>
                  </span>
                  <span>ACTIVE: {w.lastActive}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
