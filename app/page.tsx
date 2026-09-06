"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { GlobalMarket } from "@/components/dashboard/GlobalMarket";
import { PriceTicker } from "@/components/dashboard/PriceTicker";
import { SystemHealth } from "@/components/dashboard/SystemHealth";
import { AiCopilot } from "@/components/dashboard/AiCopilot";
import { PriceChart } from "@/components/dashboard/PriceChart";
import { OrderBookVisualizer } from "@/components/dashboard/OrderBookVisualizer";
import { RiskRadar } from "@/components/dashboard/RiskRadar";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { translations, Language } from "@/lib/i18n/translations";

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
    confirmationConditions: string[];
    invalidationConditions: string[];
    exitConditions: string[];
  };
}

export default function Dashboard() {
  const [lang, setLang] = useState<Language>("pt");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [expandedOppId, setExpandedOppId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("app_lang") as Language) || "pt";
    setLang(saved);

    const handleLangChange = () => {
      const current = (localStorage.getItem("app_lang") as Language) || "pt";
      setLang(current);
    };

    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const t = translations[lang];

  const fetchOpps = useCallback(async () => {
    setIsRefreshing(true);
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
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOpps();
  }, [fetchOpps]);

  const toggleExpand = (id: string, asset: string) => {
    setSelectedAsset(asset);
    setExpandedOppId(expandedOppId === id ? null : id);
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            {t.appName}
          </h1>
          <Badge variant="outline" className="text-[10px]">{t.version}</Badge>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/dex">
            <Button variant="outline" size="sm">{t.dexTerminal}</Button>
          </Link>
          <LanguageToggle />
          <SystemHealth />
        </div>
      </header>

      {/* Global Bar & Price Ticker */}
      <GlobalMarket />
      <PriceTicker />

      {/* Main Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Opportunities & AI Copilot (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Opportunities Terminal */}
          <Card className="bg-[#0b101e] border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                <span>{t.liveOpportunities}</span>
                <Badge variant="success" className="text-[10px]">{t.realtimeEngine}</Badge>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchOpps}
                disabled={isRefreshing}
                className="text-xs py-1 px-2.5"
              >
                {isRefreshing ? t.updatingBtn : t.updateBtn}
              </Button>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="py-8 text-center text-xs text-slate-500 animate-pulse">
                  Scanning real market prices, indicators & technical setups...
                </div>
              ) : opportunities.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  {t.noOpportunities}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {opportunities.map((opp) => {
                    const isExpanded = expandedOppId === opp.opportunityId;
                    return (
                      <div
                        key={opp.opportunityId}
                        onClick={() => toggleExpand(opp.opportunityId, opp.asset)}
                        className={`p-3 bg-[#0d1527] border rounded transition-all cursor-pointer ${
                          isExpanded ? "border-blue-500 shadow-md bg-[#0f192e]" : "border-slate-800/80 hover:border-slate-700"
                        }`}
                      >
                        {/* Compact KPI Card Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-slate-100">{opp.asset}</span>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {opp.opportunityType}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-sm text-emerald-400 font-mono">
                              {opp.score}/100
                            </span>
                            <span className="text-[10px] text-slate-500 block">{t.score}</span>
                          </div>
                        </div>

                        {/* High Density KPIs Grid */}
                        <div className="grid grid-cols-3 gap-1.5 text-[11px] bg-[#080e1a] p-2 rounded mb-2">
                          <div>
                            <span className="text-slate-500 block text-[10px]">{t.price}:</span>
                            <span className="font-mono text-slate-200 font-medium">
                              ${opp.currentPrice > 10 ? opp.currentPrice.toLocaleString() : opp.currentPrice.toFixed(4)}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">{t.trendRsi}:</span>
                            <span className="text-slate-200">
                              {opp.technicalSummary.trend} ({opp.technicalSummary.rsi})
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">{t.riskLevel}:</span>
                            <span className={opp.riskLevel === "LOW" ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
                              {opp.riskLevel}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>{t.source}: {opp.source}</span>
                          <span className="text-blue-400 underline">
                            {isExpanded ? t.hideDetail : t.showDetail}
                          </span>
                        </div>

                        {/* Expanded Drawer Details */}
                        {isExpanded && (
                          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] space-y-2 bg-[#060a14] p-2.5 rounded text-slate-300">
                            <div>
                              <span className="text-emerald-400 font-semibold block mb-0.5">{t.entrySetup}:</span>
                              <p className="text-slate-300">{opp.conditions.entryConditions[0]}</p>
                            </div>
                            <div>
                              <span className="text-rose-400 font-semibold block mb-0.5">{t.invalidationThreshold}:</span>
                              <p className="text-slate-300">{opp.conditions.invalidationConditions[0]}</p>
                            </div>
                            <div>
                              <span className="text-blue-400 font-semibold block mb-0.5">{t.targetExit}:</span>
                              <p className="text-slate-300">{opp.conditions.exitConditions[0]}</p>
                            </div>
                            <div className="pt-1 text-right">
                              <Link href={`/asset/${opp.asset}`} className="text-blue-400 hover:underline text-[11px]">
                                {t.openFullTerminal} ({opp.asset}) →
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Real-time Price Chart */}
          <PriceChart symbol={selectedAsset} />

          {/* AI Copilot */}
          <AiCopilot />
        </div>

        {/* Right: Orderbook Depth, Risk Radar & Engine Status (1 col) */}
        <div className="space-y-4">
          <OrderBookVisualizer symbol={selectedAsset} />
          <RiskRadar symbol={selectedAsset} />

          <Card className="bg-[#0b101e] border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">{t.aiAgentsStatus}</CardTitle>
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
                <span className="text-slate-300">Token Security Analyst</span>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-300">Arbitrage Net Edge Analyst</span>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-300">Risk Manager Agent</span>
                <Badge variant="success">Active (Veto)</Badge>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-300">Contrarian AI Judge</span>
                <Badge variant="success">Active</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0b101e] border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">{t.engineOverview}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-slate-300">
              <div className="p-2 bg-[#080d19] rounded border border-slate-800/80 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.dataFeed}:</span>
                  <span className="text-emerald-400 font-medium">100% Real Live APIs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.securityVeto}:</span>
                  <span className="text-blue-400 font-medium">Auto-Risk Guard</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.aiReasoning}:</span>
                  <span className="text-amber-400 font-medium">Grounded & Contrarian</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
