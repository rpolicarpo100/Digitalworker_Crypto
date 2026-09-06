"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { LanguageToggle } from "../../components/ui/LanguageToggle";
import { translations, Language } from "../../lib/i18n/translations";
import { mevSlippageEngine } from "../../lib/engines/mev-slippage-engine";

interface DexPair {
  chainId: string;
  dexId: string;
  pairAddress: string;
  baseToken: { symbol: string; name: string; address?: string };
  quoteToken: { symbol: string };
  priceUsd: string;
  volume24h: number;
  priceChange24h: number;
  liquidityUsd: number;
  securityScore?: number;
  isHoneypot?: boolean;
}

interface ArbitrageData {
  symbol: string;
  sources: Array<{ source: string; price: number }>;
  arbitrage?: {
    grossSpreadPercent: number;
    evaluations: Array<{
      tradeSizeUsd: number;
      grossProfitUsd: number;
      netProfitUsd: number;
      netEdgePercent: number;
      isValidArbitrage: boolean;
      rejectionReason?: string;
    }>;
  };
}

export default function DexTerminal() {
  const [lang] = useState<Language>(() => {
    if (typeof window === "undefined") return "pt";
    return (localStorage.getItem("app_lang") as Language) || "pt";
  });

  const [activeTab, setActiveTab] = useState<"pools" | "arbitrage">("pools");
  const [query, setQuery] = useState("SOL");
  const [selectedChain, setSelectedChain] = useState<string>("ALL");
  const [pairs, setPairs] = useState<DexPair[]>([]);
  const [arbData, setArbData] = useState<ArbitrageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPair, setSelectedPair] = useState<DexPair | null>(null);

  const t = translations[lang];

  const fetchTrendingPools = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/market/dex/trending");
      if (res.ok) {
        const json = await res.json();
        setPairs(json.pairs || []);
      }
    } catch (err) {
      console.error("DEX trending fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async (q: string) => {
    if (!q) {
      fetchTrendingPools();
      return;
    }
    setLoading(true);
    try {
      const [dexRes, arbRes] = await Promise.all([
        fetch(`/api/market/dex/search?q=${encodeURIComponent(q)}`),
        fetch(`/api/arbitrage?symbol=${encodeURIComponent(q)}`),
      ]);

      if (dexRes.ok) {
        const json = await dexRes.json();
        setPairs(json.pairs || []);
      }
      if (arbRes.ok) {
        const json = await arbRes.json();
        setArbData(json);
      }
    } catch (err) {
      console.error("DEX search failed:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchTrendingPools]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch("/api/market/dex/trending");
        if (res.ok && isMounted) {
          const json = await res.json();
          setPairs(json.pairs || []);
        }
      } catch (err) {
        console.error("DEX trending fetch failed:", err);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPairs = selectedChain === "ALL"
    ? pairs
    : pairs.filter((p) => p.chainId.toLowerCase() === selectedChain.toLowerCase());

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-4 bg-[#030712] min-h-screen text-slate-100 font-sans relative">
      <div className="fixed inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none z-0" />

      {/* Cyber Header Banner */}
      <div className="relative z-10 flex flex-wrap items-center justify-between border border-cyan-500/20 bg-[#070d1e]/80 backdrop-blur-xl p-3.5 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.08)] font-mono">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Button variant="outline" size="sm" className="bg-[#0b142b] border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-black font-mono font-bold text-xs transition-all duration-300 rounded-xl">
              {t.backToTerminal}
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-black font-mono tracking-tight text-white uppercase bg-gradient-to-r from-cyan-300 via-sky-100 to-emerald-300 bg-clip-text text-transparent">
              {t.dexTitle}
            </h1>
          </div>
          <Badge variant="success" className="text-[9px] font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            [AUTO_TOP_RATING]
          </Badge>
        </div>

        <div className="flex items-center space-x-3 mt-2 sm:mt-0">
          <div className="flex items-center space-x-1 border border-cyan-500/30 rounded-xl p-0.5 bg-[#040814]">
            <Button
              variant={activeTab === "pools" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("pools")}
              className={`text-xs font-mono font-bold px-3 ${activeTab === "pools" ? "bg-cyan-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]" : "text-slate-400"}`}
            >
              {t.poolsTab}
            </Button>
            <Button
              variant={activeTab === "arbitrage" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("arbitrage")}
              className={`text-xs font-mono font-bold px-3 ${activeTab === "arbitrage" ? "bg-cyan-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]" : "text-slate-400"}`}
            >
              {t.arbTab}
            </Button>
          </div>
          <LanguageToggle />
        </div>
      </div>

      {/* Cyber Search & Filter Bar */}
      <div className="relative z-10 space-y-3 bg-[#070d1e]/80 p-3.5 rounded-2xl border border-cyan-500/20 backdrop-blur-xl shadow-lg font-mono">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 flex-1">
            <Input
              placeholder={t.searchDexPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
              className="max-w-md bg-[#040814] border-slate-800 text-xs font-mono focus:border-cyan-400 text-slate-100"
            />
            <Button onClick={() => handleSearch(query)} size="sm" className="text-xs bg-cyan-600 hover:bg-cyan-500 font-mono font-bold px-4 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              {t.searchBtn}
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={fetchTrendingPools} className="text-xs bg-[#0b142b] border-cyan-500/30 text-cyan-300 font-mono font-bold hover:bg-cyan-500 hover:text-black">
            {t.topRealRatingBtn}
          </Button>
        </div>

        {/* Chain Selector Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 text-[9px] font-mono uppercase font-bold mr-1 tracking-widest">[BLOCKCHAIN]:</span>
          {["ALL", "solana", "ethereum", "bsc", "arbitrum", "base"].map((chain) => (
            <button
              key={chain}
              onClick={() => setSelectedChain(chain)}
              className={`px-3 py-1 rounded-xl text-[11px] font-mono font-bold transition-all duration-300 ${
                selectedChain === chain
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : "bg-[#040814] border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-cyan-500/30"
              }`}
            >
              [{chain.toUpperCase()}]
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "pools" ? (
        <Card className="relative z-10 bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl rounded-2xl overflow-hidden font-mono">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800/80">
            <CardTitle className="text-sm font-black font-mono tracking-wider uppercase flex items-center space-x-2">
              <span>REAL TOP RATING POOLS ({query || "TRENDING"})</span>
              <Badge variant="outline" className="text-[9px] font-mono border-cyan-500/40 text-cyan-300 font-bold">
                [LIVE_DEX_AUDIT]
              </Badge>
            </CardTitle>
            <span className="text-[11px] font-mono text-slate-400">
              FILTER: <strong className="text-cyan-300 font-bold">{selectedChain.toUpperCase()}</strong> ({filteredPairs.length} pools)
            </span>
          </CardHeader>

          <CardContent className="pt-3">
            {loading ? (
              <div className="py-12 text-center text-xs font-mono text-cyan-400/80 animate-pulse flex flex-col items-center justify-center space-y-3">
                <div className="w-9 h-9 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span>[AUDITING_ONCHAIN_CONTRACTS & LIQUIDITY...]</span>
              </div>
            ) : filteredPairs.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-slate-400">
                No liquidity pools found for the selected filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[9px] font-mono bg-[#040814]">
                      <th className="py-3 px-3 font-bold">{t.pair}</th>
                      <th className="py-3 px-3 font-bold">{t.chainDex}</th>
                      <th className="py-3 px-3 font-bold">{t.priceUsd}</th>
                      <th className="py-3 px-3 font-bold">24h Vol</th>
                      <th className="py-3 px-3 font-bold">{t.liquidityUsd}</th>
                      <th className="py-3 px-3 font-bold">{t.change24h}</th>
                      <th className="py-3 px-3 font-bold">MEV Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {filteredPairs.map((p, idx) => {
                      const isSelected = selectedPair?.pairAddress === p.pairAddress;
                      
                      const mevSim = mevSlippageEngine.calculateRealisticExecution({
                        tradeSizeUsd: 1000,
                        liquidityDepthUsd: p.liquidityUsd || 10000,
                        grossSpreadPercent: 1.5,
                        blockchain: p.chainId.toLowerCase().includes("sol") ? "solana" : "ethereum",
                        isDex: true,
                      });

                      return (
                        <tr
                          key={`${p.pairAddress}_${idx}`}
                          onClick={() => setSelectedPair(isSelected ? null : p)}
                          className={`hover:bg-[#0c162e] cursor-pointer transition-all duration-200 ${
                            isSelected ? "bg-[#0f1d3e] shadow-inner" : ""
                          }`}
                        >
                          <td className="py-3 px-3 font-bold text-slate-100">
                            <div className="flex items-center space-x-2">
                              <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center font-bold text-[10px] text-cyan-300 font-mono">
                                {p.baseToken.symbol.slice(0, 2)}
                              </div>
                              <div>
                                <span className="font-black text-sm text-slate-100 block font-mono">
                                  {p.baseToken.symbol} / {p.quoteToken.symbol}
                                </span>
                                <span className="text-[10px] text-slate-400 font-sans block truncate max-w-[120px]">
                                  {p.baseToken.name}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-400 uppercase">
                            <Badge variant="outline" className="text-[9px] font-mono px-2 py-0.5 border-blue-500/40 text-blue-300 font-bold">
                              {p.chainId}
                            </Badge>
                            <span className="text-[10px] text-slate-400 block font-bold mt-0.5">{p.dexId}</span>
                          </td>
                          <td className="py-3 px-3 font-mono text-emerald-400 font-black text-sm">
                            ${parseFloat(p.priceUsd || "0") > 0.01
                              ? parseFloat(p.priceUsd).toFixed(4)
                              : parseFloat(p.priceUsd || "0").toFixed(8)}
                          </td>
                          <td className="py-3 px-3 text-slate-200 font-bold">
                            ${p.volume24h.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-slate-200 font-bold">
                            ${p.liquidityUsd.toLocaleString()}
                          </td>
                          <td className={p.priceChange24h >= 0 ? "py-3 px-3 text-emerald-400 font-black" : "py-3 px-3 text-rose-400 font-black"}>
                            {p.priceChange24h >= 0 ? `+${p.priceChange24h.toFixed(2)}%` : `${p.priceChange24h.toFixed(2)}%`}
                          </td>
                          <td className="py-3 px-3">
                            <Badge
                              variant={mevSim.mevThreatLevel === "HIGH" || mevSim.mevThreatLevel === "CRITICAL" ? "destructive" : "success"}
                              className="text-[9px] font-mono font-bold"
                            >
                              [{mevSim.mevThreatLevel}]
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Arbitrage Net Edge Scan Tab */
        <Card className="relative z-10 bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl rounded-2xl font-mono">
          <CardHeader className="pb-2 border-b border-slate-800/80">
            <CardTitle className="text-sm font-black font-mono tracking-wider uppercase flex items-center space-x-2">
              <span>REAL CROSS-VENUE NET EDGE ARBITRAGE SCAN ({query})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <div className="py-12 text-center text-xs font-mono text-cyan-400/80 animate-pulse flex flex-col items-center justify-center space-y-3">
                <div className="w-9 h-9 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span>[CALCULATING_REAL_NET_EDGE & GAS_DEDUCTIONS...]</span>
              </div>
            ) : !arbData || !arbData.arbitrage ? (
              <div className="py-8 text-center text-xs font-mono text-slate-400">
                Multiple price venues unavailable or insufficient spread for {query}.
              </div>
            ) : (
              <div className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#040814] p-3.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[9px] font-bold uppercase">{t.grossSpread}:</span>
                    <span className="font-black text-amber-400 text-base">
                      {arbData.arbitrage.grossSpreadPercent.toFixed(2)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] font-bold uppercase">{t.venuesEvaluated}:</span>
                    <span className="font-bold text-slate-200 text-[11px]">
                      {arbData.sources.map((s) => s.source).join(" vs ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] font-bold uppercase">{t.lowestVenue}:</span>
                    <span className="text-emerald-400 font-black">
                      ${arbData.sources[0]?.price.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] font-bold uppercase">{t.highestVenue}:</span>
                    <span className="text-rose-400 font-black">
                      ${arbData.sources[arbData.sources.length - 1]?.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase text-[9px] bg-[#040814]">
                        <th className="py-2.5 px-3 font-bold">{t.tradeSize}</th>
                        <th className="py-2.5 px-3 font-bold">{t.grossProfit}</th>
                        <th className="py-2.5 px-3 font-bold">{t.netEdge}</th>
                        <th className="py-2.5 px-3 font-bold">{t.netProfitUsd}</th>
                        <th className="py-2.5 px-3 font-bold">{t.status}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {arbData.arbitrage.evaluations.map((e) => (
                        <tr key={e.tradeSizeUsd} className="hover:bg-[#0c162e]">
                          <td className="py-3 px-3 font-black text-slate-100 font-mono text-sm">
                            ${e.tradeSizeUsd.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-amber-400 font-black">
                            +${e.grossProfitUsd.toFixed(2)}
                          </td>
                          <td className={e.netEdgePercent > 0 ? "py-3 px-3 text-emerald-400 font-black" : "py-3 px-3 text-rose-400 font-black"}>
                            {e.netEdgePercent > 0 ? `+${e.netEdgePercent.toFixed(2)}%` : `${e.netEdgePercent.toFixed(2)}%`}
                          </td>
                          <td className={e.netProfitUsd > 0 ? "py-3 px-3 text-emerald-400 font-black" : "py-3 px-3 text-rose-400 font-black"}>
                            {e.netProfitUsd > 0 ? `+$${e.netProfitUsd.toFixed(2)}` : `-$${Math.abs(e.netProfitUsd).toFixed(2)}`}
                          </td>
                          <td className="py-3 px-3 font-sans">
                            {e.isValidArbitrage ? (
                              <Badge variant="success" className="font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                                [{t.actionableArb}]
                              </Badge>
                            ) : (
                              <Badge variant="destructive" title={e.rejectionReason} className="font-mono font-bold">
                                [{t.rejectedFees}]
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </main>
  );
}
