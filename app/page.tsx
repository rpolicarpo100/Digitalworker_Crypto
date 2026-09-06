"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { GlobalMarket } from "../components/dashboard/GlobalMarket";
import { PriceTicker } from "../components/dashboard/PriceTicker";
import { GlobalIntelligenceKpis } from "../components/dashboard/GlobalIntelligenceKpis";
import { SystemHealth } from "../components/dashboard/SystemHealth";
import { AiCopilot } from "../components/dashboard/AiCopilot";
import { PriceChart } from "../components/dashboard/PriceChart";
import { OrderBookVisualizer } from "../components/dashboard/OrderBookVisualizer";
import { RiskRadar } from "../components/dashboard/RiskRadar";
import { LanguageToggle } from "../components/ui/LanguageToggle";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { translations, Language } from "../lib/i18n/translations";

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
  const [paperMessage, setPaperMessage] = useState<string | null>(null);

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

  const handleQuickPaperTrade = async (asset: string, price: number, side: "BUY" | "SELL") => {
    setPaperMessage(`[PAPER_EXECUTION] Transação ${side} iniciada para ${asset}...`);
    try {
      const res = await fetch("/api/paper-trading/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: asset,
          side,
          quantity: side === "BUY" ? 1000 / price : 500 / price,
        }),
      });

      if (res.ok) {
        setPaperMessage(`[CONFIRMED] Ordem ${side} executada em ${asset} @ $${price.toLocaleString()}!`);
      } else {
        setPaperMessage(`[REJECTED] Falha na execução da ordem`);
      }
    } catch {
      setPaperMessage(`[ERROR] Erro no barramento de execução`);
    }

    setTimeout(() => setPaperMessage(null), 4000);
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 space-y-3 bg-[#030712] min-h-screen text-slate-100 font-sans selection:bg-cyan-500 selection:text-black relative">
      <div className="fixed inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none z-0" />

      {/* Header Banner */}
      <header className="relative z-10 flex flex-wrap items-center justify-between border border-cyan-500/20 bg-[#070d1e]/80 backdrop-blur-xl p-3 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.08)]">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-emerald-500/20 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)] font-mono font-black text-cyan-300 text-base">
            ⚡
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-black tracking-tight text-white font-mono uppercase bg-gradient-to-r from-cyan-300 via-sky-100 to-emerald-300 bg-clip-text text-transparent">
                DIGITAL WORKER // MULTI-ASSET FINANCIAL INTELLIGENCE
              </h1>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold uppercase tracking-widest">
                [SYS_CORE: v1.0]
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-mono flex items-center space-x-2 mt-0.5">
              <span className="text-emerald-400 font-bold">[MULTI-ASSET ENGINE]</span>
              <span>•</span>
              <span className="text-slate-500">ANALYSIS ONLY • NO ORDER EXECUTION</span>
            </p>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2 sm:mt-0 font-mono">
          <Link href="/research">
            <Button size="sm" className="bg-cyan-600 text-black hover:bg-cyan-400 font-bold text-xs rounded-xl shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              📊 Research
            </Button>
          </Link>
          <Link href="/dex">
            <Button variant="outline" size="sm" className="bg-[#0b142b] border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-black font-bold text-xs rounded-xl">
              ❖ DEX
            </Button>
          </Link>
          <Link href="/dividends">
            <Button variant="outline" size="sm" className="bg-[#0b142b] border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-black font-bold text-xs rounded-xl">
              💰 Dividends
            </Button>
          </Link>
          <Link href="/small-caps">
            <Button variant="outline" size="sm" className="bg-[#0b142b] border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-black font-bold text-xs rounded-xl">
              🔬 Small Caps
            </Button>
          </Link>
          <Link href="/sectors">
            <Button variant="outline" size="sm" className="bg-[#0b142b] border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-black font-bold text-xs rounded-xl">
              📈 Sectors
            </Button>
          </Link>
          <Link href="/wallet">
            <Button variant="outline" size="sm" className="bg-[#0b142b] border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-black font-bold text-xs rounded-xl">
              🐋 Whales
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="outline" size="sm" className="bg-[#0b142b] border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-black font-bold text-xs rounded-xl">
              ⚙️ Settings
            </Button>
          </Link>
          <LanguageToggle />
          <SystemHealth />
        </div>
      </header>

      {/* Global Market Bar & Ticker */}
      <div className="relative z-10">
        <GlobalMarket />
      </div>
      <div className="relative z-10">
        <PriceTicker />
      </div>
      <div className="relative z-10">
        <GlobalIntelligenceKpis />
      </div>

      {/* Toast Notification */}
      {paperMessage && (
        <div className="relative z-10 p-2.5 bg-cyan-950/90 border border-cyan-400/60 rounded-xl text-cyan-200 text-xs font-mono font-bold flex items-center justify-between shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-in fade-in slide-in-from-top-2">
          <span className="flex items-center space-x-2">
            <span className="animate-pulse text-cyan-400">⚡</span>
            <span>{paperMessage}</span>
          </span>
          <span className="text-[9px] text-cyan-400/80 uppercase tracking-widest font-mono">PAPER_EXECUTION_BAR</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left Column: Opportunities, Chart & AI Copilot (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          {/* Cyber Opportunities Terminal */}
          <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            <CardHeader className="flex flex-row items-center justify-between py-2 px-3.5 border-b border-slate-800/80">
              <CardTitle className="text-xs font-black font-mono tracking-wider uppercase flex items-center space-x-2">
                <span className="text-cyan-400 font-bold">◈</span>
                <span className="text-slate-100">{t.liveOpportunities}</span>
                <Badge variant="success" className="text-[8px] font-mono font-bold py-0.5 px-1.5 bg-emerald-950 border border-emerald-500/50 text-emerald-400">
                  [LIVE_TELEMETRY]
                </Badge>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchOpps}
                disabled={isRefreshing}
                className="text-[10px] py-0.5 px-2 bg-[#0a1124] border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 font-mono font-bold transition-all duration-300 rounded-lg"
              >
                {isRefreshing ? t.updatingBtn : t.updateBtn}
              </Button>
            </CardHeader>

            <CardContent className="p-3">
              {loading ? (
                <div className="py-8 text-center text-xs font-mono text-cyan-400/80 animate-pulse flex flex-col items-center justify-center space-y-2">
                  <div className="w-7 h-7 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>[SCANNING_QUANT_FEEDS & INDICATORS...]</span>
                </div>
              ) : opportunities.length === 0 ? (
                <div className="py-8 text-center text-xs font-mono text-slate-400">
                  {t.noOpportunities}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {opportunities.map((opp) => {
                    const isExpanded = expandedOppId === opp.opportunityId;
                    const isSelected = selectedAsset === opp.asset;

                    return (
                      <div
                        key={opp.opportunityId}
                        onClick={() => toggleExpand(opp.opportunityId, opp.asset)}
                        className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer relative group ${
                          isSelected
                            ? "bg-gradient-to-br from-[#0c162d] via-[#0d1a36] to-[#081024] border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                            : "bg-[#091022]/90 hover:bg-[#0c162e] border-slate-800/80 hover:border-cyan-500/40 shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center font-mono font-black text-xs text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                              {opp.asset.slice(0, 3)}
                            </div>
                            <div>
                              <span className="font-mono font-black text-sm text-white tracking-wide">{opp.asset}</span>
                              <span className="ml-1.5 text-[8px] font-mono px-1 py-0.5 rounded bg-blue-950/80 border border-blue-500/40 text-blue-300 uppercase font-bold">
                                {opp.opportunityType}
                              </span>
                            </div>
                          </div>

                          {/* PROMINENT COMPACT SCORE KPI */}
                          <div className="text-right">
                            <div className="flex items-baseline justify-end space-x-0.5">
                              <span className="font-mono font-black text-2xl text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                                {opp.score}
                              </span>
                              <span className="text-[9px] text-slate-500 font-bold">/100</span>
                            </div>
                            <span className="text-[8px] font-mono text-slate-400 uppercase block font-bold tracking-wider">{t.score}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5 text-[10px] bg-[#040814] p-2 rounded-lg mb-2 border border-slate-800/80 font-mono">
                          <div>
                            <span className="text-slate-500 block text-[8px] font-bold uppercase">{t.price}:</span>
                            <span className="text-slate-100 font-black text-[11px]">
                              ${opp.currentPrice > 10 ? opp.currentPrice.toLocaleString() : opp.currentPrice.toFixed(4)}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[8px] font-bold uppercase">{t.trendRsi}:</span>
                            <span className="text-slate-200 font-bold text-[10px]">
                              {opp.technicalSummary.trend} ({opp.technicalSummary.rsi})
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[8px] font-bold uppercase">{t.riskLevel}:</span>
                            <span className={opp.riskLevel === "LOW" ? "text-emerald-400 font-black text-[10px]" : "text-amber-400 font-black text-[10px]"}>
                              {opp.riskLevel}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                          <span className="text-slate-500">FEED: {opp.source}</span>
                          <span className="text-cyan-400 font-bold group-hover:underline flex items-center space-x-1">
                            <span>{isExpanded ? t.hideDetail : t.showDetail}</span>
                          </span>
                        </div>

                        {isExpanded && (
                          <div
                            className="mt-2 pt-2 border-t border-slate-800 text-[10px] font-sans space-y-2 bg-[#030610] p-2.5 rounded-xl text-slate-300 animate-in fade-in duration-200 border border-slate-800/80"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div>
                              <span className="text-emerald-400 font-mono font-bold block mb-0.5 text-[9px] uppercase">[SETUP_ENTRY]:</span>
                              <p className="text-slate-200 text-[10px] leading-snug">{opp.conditions.entryConditions[0]}</p>
                            </div>
                            <div>
                              <span className="text-rose-400 font-mono font-bold block mb-0.5 text-[9px] uppercase">[INVALIDATION_LIMIT]:</span>
                              <p className="text-slate-200 text-[10px] leading-snug">{opp.conditions.invalidationConditions[0]}</p>
                            </div>
                            <div>
                              <span className="text-cyan-400 font-mono font-bold block mb-0.5 text-[9px] uppercase">[TARGET_EXIT]:</span>
                              <p className="text-slate-200 text-[10px] leading-snug">{opp.conditions.exitConditions[0]}</p>
                            </div>

                            <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between font-mono">
                              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">[PAPER_TRIGGER]:</span>
                              <div className="flex items-center space-x-1.5">
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleQuickPaperTrade(opp.asset, opp.currentPrice, "BUY")}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-black text-[9px] h-5 px-2.5 shadow-[0_0_10px_rgba(16,185,129,0.4)] rounded-md"
                                >
                                  [ENTER_LONG]
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleQuickPaperTrade(opp.asset, opp.currentPrice, "SELL")}
                                  className="bg-rose-600 hover:bg-rose-500 text-white font-mono font-black text-[9px] h-5 px-2.5 shadow-[0_0_10px_rgba(244,63,94,0.4)] rounded-md"
                                >
                                  [ENTER_SHORT]
                                </Button>
                              </div>
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

          {/* Real-time SVG / TradingView Price Chart */}
          <PriceChart symbol={selectedAsset} />

          {/* AI Multi-Agent Copilot */}
          <AiCopilot />
        </div>

        {/* Right Column: Orderbook Depth & Compact Risk Radar */}
        <div className="space-y-3">
          <OrderBookVisualizer symbol={selectedAsset} />
          <RiskRadar symbol={selectedAsset} />
        </div>
      </div>
    </main>
  );
}
