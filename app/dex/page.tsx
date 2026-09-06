"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [activeTab, setActiveTab] = useState<"pools" | "arbitrage">("pools");
  const [query, setQuery] = useState("PEPE");
  const [pairs, setPairs] = useState<DexPair[]>([]);
  const [arbData, setArbData] = useState<ArbitrageData | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(q: string) {
    if (!q) return;
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
  }

  useEffect(() => {
    handleSearch("PEPE");
  }, []);

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Button variant="outline" size="sm">← Back to Terminal</Button>
          </Link>
          <h1 className="text-xl font-bold text-slate-100">DEX Intelligence & Arbitrage Terminal</h1>
          <Badge variant="success">100% Real Data</Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={activeTab === "pools" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("pools")}
          >
            Liquidity Pools
          </Button>
          <Button
            variant={activeTab === "arbitrage" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("arbitrage")}
          >
            Arbitrage Net Edge Scan
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search token / pair (e.g. PEPE, SOL, WIF)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={() => handleSearch(query)} size="sm">Scan DEX Token</Button>
      </div>

      {activeTab === "pools" ? (
        <Card className="bg-[#0b101e] border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm">Real Liquidity Pools ({query})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-500">Searching live DEX pools & auditing security...</div>
            ) : pairs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No liquidity pools found for "{query}".</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2 px-3">Pair</th>
                      <th className="py-2 px-3">Chain / DEX</th>
                      <th className="py-2 px-3">Price USD</th>
                      <th className="py-2 px-3">24h Vol</th>
                      <th className="py-2 px-3">Liquidity USD</th>
                      <th className="py-2 px-3">24h Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {pairs.map((p, idx) => (
                      <tr key={`${p.pairAddress}_${idx}`} className="hover:bg-[#0e162a]">
                        <td className="py-2.5 px-3 font-semibold text-slate-100">
                          {p.baseToken.symbol} / {p.quoteToken.symbol}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 uppercase font-mono">
                          {p.chainId} ({p.dexId})
                        </td>
                        <td className="py-2.5 px-3 font-mono text-emerald-400">
                          ${parseFloat(p.priceUsd || "0") > 0.01
                            ? parseFloat(p.priceUsd).toFixed(4)
                            : parseFloat(p.priceUsd || "0").toFixed(8)}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-300">
                          ${p.volume24h.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-300">
                          ${p.liquidityUsd.toLocaleString()}
                        </td>
                        <td className={p.priceChange24h >= 0 ? "py-2.5 px-3 font-mono text-emerald-400" : "py-2.5 px-3 font-mono text-rose-400"}>
                          {p.priceChange24h >= 0 ? `+${p.priceChange24h.toFixed(2)}%` : `${p.priceChange24h.toFixed(2)}%`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-[#0b101e] border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm">Real Cross-Venue Net Edge Arbitrage Scan ({query})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-500">Calculating real net edge after gas, fees & slippage...</div>
            ) : !arbData || !arbData.arbitrage ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Multiple price venues unavailable or insufficient spread for {query}.
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#080e1a] p-3 rounded border border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Gross Spread:</span>
                    <span className="font-bold text-amber-400 text-sm">
                      {arbData.arbitrage.grossSpreadPercent.toFixed(2)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Venues Evaluated:</span>
                    <span className="font-medium text-slate-200">
                      {arbData.sources.map((s) => s.source).join(" vs ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Lowest Venue:</span>
                    <span className="font-mono text-emerald-400">
                      ${arbData.sources[0]?.price.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Highest Venue:</span>
                    <span className="font-mono text-rose-400">
                      ${arbData.sources[arbData.sources.length - 1]?.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                        <th className="py-2 px-3">Trade Size</th>
                        <th className="py-2 px-3">Gross Profit</th>
                        <th className="py-2 px-3">Net Edge %</th>
                        <th className="py-2 px-3">Net Profit USD</th>
                        <th className="py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {arbData.arbitrage.evaluations.map((e) => (
                        <tr key={e.tradeSizeUsd} className="hover:bg-[#0e162a]">
                          <td className="py-2.5 px-3 font-bold text-slate-100 font-mono">
                            ${e.tradeSizeUsd.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-amber-400">
                            +${e.grossProfitUsd.toFixed(2)}
                          </td>
                          <td className={e.netEdgePercent > 0 ? "py-2.5 px-3 font-mono text-emerald-400 font-bold" : "py-2.5 px-3 font-mono text-rose-400 font-bold"}>
                            {e.netEdgePercent > 0 ? `+${e.netEdgePercent.toFixed(2)}%` : `${e.netEdgePercent.toFixed(2)}%`}
                          </td>
                          <td className={e.netProfitUsd > 0 ? "py-2.5 px-3 font-mono text-emerald-400 font-bold" : "py-2.5 px-3 font-mono text-rose-400 font-bold"}>
                            {e.netProfitUsd > 0 ? `+$${e.netProfitUsd.toFixed(2)}` : `-$${Math.abs(e.netProfitUsd).toFixed(2)}`}
                          </td>
                          <td className="py-2.5 px-3">
                            {e.isValidArbitrage ? (
                              <Badge variant="success">Actionable Net Arbitrage</Badge>
                            ) : (
                              <Badge variant="destructive" title={e.rejectionReason}>
                                Rejected (Fees/Impact)
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
