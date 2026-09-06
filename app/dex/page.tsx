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
  baseToken: { symbol: string; name: string };
  quoteToken: { symbol: string };
  priceUsd: string;
  volume24h: number;
  priceChange24h: number;
  liquidityUsd: number;
}

export default function DexTerminal() {
  const [query, setQuery] = useState("PEPE");
  const [pairs, setPairs] = useState<DexPair[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(q: string) {
    if (!q) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/market/dex/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const json = await res.json();
        setPairs(json.pairs || []);
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
          <h1 className="text-xl font-bold text-slate-100">DEX Intelligence Terminal</h1>
          <Badge variant="success">DEX Screener Live API</Badge>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search token / pair (e.g. PEPE, SOL, WIF)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={() => handleSearch(query)} size="sm">Search DEX Pairs</Button>
      </div>

      <Card className="bg-[#0b101e] border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm">Real DEX Liquidity Pools ({query})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-500">Searching live DEX liquidity pools...</div>
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
    </main>
  );
}
