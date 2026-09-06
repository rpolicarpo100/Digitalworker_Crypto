"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GlobalMarket } from "@/components/dashboard/GlobalMarket";
import { PriceTicker } from "@/components/dashboard/PriceTicker";
import { SystemHealth } from "@/components/dashboard/SystemHealth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Opportunity {
  opportunityId: string;
  asset: string;
  source: string;
  opportunityType: string;
  score: number;
  confidence: number;
  riskScore: number;
  riskLevel: string;
  currentPrice: number;
  technicalSummary: {
    trend: string;
    rsi: number;
    volatilityRegime: string;
  };
  conditions: {
    entryConditions: string[];
    invalidationConditions: string[];
  };
}

export default function Dashboard() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOpps() {
      try {
        const res = await fetch("/api/opportunities");
        if (res.ok) {
          const json = await res.json();
          setOpportunities(json.opportunities || []);
        }
      } catch (err) {
        console.error("Failed to fetch opportunities:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOpps();
  }, []);

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            GOD — Global Opportunity Detector
          </h1>
          <Badge variant="outline" className="text-[10px]">v0.2.0 • 100% Real Data</Badge>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/dex">
            <Button variant="outline" size="sm">DEX Intelligence</Button>
          </Link>
          <SystemHealth />
        </div>
      </header>

      {/* Global Bar & Price Ticker */}
      <GlobalMarket />
      <PriceTicker />

      {/* Main Terminal View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Opportunities Terminal (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-[#0b101e] border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                <span>🎯 Live Detected Opportunities</span>
                <Badge variant="success" className="text-[10px]">Real-Time Engine</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  Scanning real market prices, indicators & technical setups...
                </div>
              ) : opportunities.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No active opportunities passed risk safety thresholds.
                </div>
              ) : (
                <div className="space-y-3">
                  {opportunities.map((opp) => (
                    <div
                      key={opp.opportunityId}
                      className="p-3 bg-[#0d1527] border border-slate-800/80 rounded hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-base text-slate-100">{opp.asset}</span>
                          <Badge variant="outline">{opp.opportunityType}</Badge>
                          <span className="text-xs text-slate-400">
                            ${opp.currentPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-slate-400">GOD Score:</span>
                          <span className="font-bold text-sm text-emerald-400 font-mono">
                            {opp.score}/100
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs mb-2 bg-[#080e1a] p-2 rounded">
                        <div>
                          <span className="text-slate-500">Trend:</span>{" "}
                          <span className="text-slate-200">{opp.technicalSummary.trend}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">RSI:</span>{" "}
                          <span className="text-slate-200">{opp.technicalSummary.rsi}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Risk Level:</span>{" "}
                          <span className={opp.riskLevel === "LOW" ? "text-emerald-400" : "text-amber-400"}>
                            {opp.riskLevel}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-400 space-y-1">
                        <div>
                          <span className="text-emerald-400/90 font-medium">Entry Setup:</span>{" "}
                          {opp.conditions.entryConditions[0]}
                        </div>
                        <div>
                          <span className="text-rose-400/90 font-medium">Invalidation:</span>{" "}
                          {opp.conditions.invalidationConditions[0]}
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Source: {opp.source}</span>
                        <Link href={`/asset/${opp.asset}`} className="text-blue-400 hover:underline">
                          View Full Asset Terminal →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: AI Agents & Principles (1 col) */}
        <div className="space-y-4">
          <Card className="bg-[#0b101e] border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">🤖 Multi-Agent AI Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-300">Market Scanner Agent</span>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-300">Technical Analyst Agent</span>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-300">Risk Manager Agent</span>
                <Badge variant="success">Active (Veto Power)</Badge>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-300">Data Quality Agent</span>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-300">On-Chain / Whale Agent</span>
                <Badge variant="outline">Proxy Mode</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0b101e] border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">⚡ Core Operating Principles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-slate-300">
              <p>• <strong>100% Real Data:</strong> Direct connection to Binance, CoinGecko, DEX Screener, Alternative.me.</p>
              <p>• <strong>0% Mock Data:</strong> Unconfigured providers mark status as <code className="text-amber-400">UNAVAILABLE</code>.</p>
              <p>• <strong>Probabilistic Language:</strong> Score reflects setup alignment, not guaranteed profit probability.</p>
              <p>• <strong>Risk Veto:</strong> Risk Engine automatically rejects opportunities with high spread or illiquidity.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
