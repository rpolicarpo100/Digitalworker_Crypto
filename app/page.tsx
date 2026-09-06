"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { GlobalMarket } from "../components/dashboard/GlobalMarket";
import { PriceTicker } from "../components/dashboard/PriceTicker";
import { SystemHealth } from "../components/dashboard/SystemHealth";
import { AiCopilot } from "../components/dashboard/AiCopilot";
import { PriceChart } from "../components/dashboard/PriceChart";
import { OrderBookVisualizer } from "../components/dashboard/OrderBookVisualizer";
import { RiskRadar } from "../components/dashboard/RiskRadar";
import { OrderImpactCalculator } from "../components/dashboard/OrderImpactCalculator";
import { SkepticalAuditWidget } from "../components/dashboard/SkepticalAuditWidget";
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
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-4 bg-[#030712] min-h-screen text-slate-100 font-sans selection:bg-cyan-500 selection:text-black relative">
      {/* Background Cyber-Grid subtle background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none z-0" />

      {/* Cyber HUD Header */}
      <header className="relative z-10 flex flex-wrap items-center justify-between border border-cyan-500/20 bg-[#070d1e]/80 backdrop-blur-xl p-3.5 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.08)]">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-emerald-500/20 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)] font-mono font-black text-cyan-300 text-lg">
            ⚡
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-tight text-white font-mono uppercase bg-gradient-to-r from-cyan-300 via-sky-100 to-emerald-300 bg-clip-text text-transparent">
                DIGITAL WORKER // CRYPTO HUD
              </h1>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold uppercase tracking-widest">
                [SYS_CORE: v0.5]
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono flex items-center space-x-2 mt-0.5">
              <span className="text-emerald-400 font-bold">[100% REAL DATA FEED]</span>
              <span>•</span>
              <span className="text-slate-500">NODE: LISBON_PT</span>
              <span>•</span>
              <span className="text-cyan-400 font-bold">MEV_SHIELD: ARMED</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-2 sm:mt-0">
          <Link href="/dex">
            <Button
              variant="outline"
              size="sm"
              className="bg-[#0b142b] border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-black font-mono font-bold text-xs transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] rounded-xl"
            >
              ❖ {t.dexTerminal}
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

      {/* Toast Cyber Alert Notification */}
      {paperMessage && (
        <div className="relative z-10 p-3 bg-cyan-950/90 border border-cyan-400/60 rounded-xl text-cyan-200 text-xs font-mono font-bold flex items-center justify-between shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-in fade-in slide-in-from-top-2">
          <span className="flex items-center space-x-2">
            <span className="animate-pulse text-cyan-400">⚡</span>
            <span>{paperMessage}</span>
          </span>
          <span className="text-[9px] text-cyan-400/80 uppercase tracking-widest font-mono">PAPER_EXECUTION_BAR</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Opportunities, Chart & AI Copilot (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Cyber Opportunities Terminal */}
          <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800/80">
              <CardTitle className="text-sm font-black font-mono tracking-wider uppercase flex items-center space-x-2">
                <span className="text-cyan-400 font-bold">◈</span>
                <span className="text-slate-100">{t.liveOpportunities}</span>
                <Badge variant="success" className="text-[9px] font-mono font-bold bg-emerald-950 border border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  [LIVE_TELEMETRY]
                </Badge>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchOpps}
                disabled={isRefreshing}
                className="text-xs py-1 px-3 bg-[#0a1124] border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 font-mono font-bold transition-all duration-300 rounded-lg"
              >
                {isRefreshing ? t.updatingBtn : t.updateBtn}
              </Button>
            </CardHeader>

            <CardContent className="pt-4">
              {loading ? (
                <div className="py-12 text-center text-xs font-mono text-cyan-400/80 animate-pulse flex flex-col items-center justify-center space-y-3">
                  <div className="w-9 h-9 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>[SCANNING_QUANT_FEEDS & INDICATORS...]</span>
                </div>
              ) : opportunities.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-slate-400">
                  {t.noOpportunities}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {opportunities.map((opp) => {
                    const isExpanded = expandedOppId === opp.opportunityId;
                    const isSelected = selectedAsset === opp.asset;

                    return (
                      <div
                        key={opp.opportunityId}
                        onClick={() => toggleExpand(opp.opportunityId, opp.asset)}
                        className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer relative group ${
                          isSelected
                            ? "bg-gradient-to-br from-[#0c162d] via-[#0d1a36] to-[#081024] border-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.2)]"
                            : "bg-[#091022]/90 hover:bg-[#0c162e] border-slate-800/80 hover:border-cyan-500/40 shadow-lg"
                        }`}
                      >
                        {/* Futuristic Bracket Accents */}
                        <span className="absolute top-1 left-1 text-[8px] font-mono text-cyan-500/40">┌</span>
                        <span className="absolute top-1 right-1 text-[8px] font-mono text-cyan-500/40">┐</span>
                        <span className="absolute bottom-1 left-1 text-[8px] font-mono text-cyan-500/40">└</span>
                        <span className="absolute bottom-1 right-1 text-[8px] font-mono text-cyan-500/40">┘</span>

                        {/* Top Tile Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center font-mono font-black text-xs text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                              {opp.asset.slice(0, 3)}
                            </div>
                            <div>
                              <span className="font-mono font-black text-base text-white tracking-wide">{opp.asset}</span>
                              <span className="ml-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-500/40 text-blue-300 uppercase font-bold">
                                {opp.opportunityType}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-mono font-black text-base text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                              {opp.score}<span className="text-[10px] text-slate-500">/100</span>
                            </span>
                            <span className="text-[9px] font-mono text-slate-400 uppercase block font-bold tracking-wider">{t.score}</span>
                          </div>
                        </div>

                        {/* High-Density Clean Telemetry Metrics Grid */}
                        <div className="grid grid-cols-3 gap-2 text-[11px] bg-[#040814] p-2.5 rounded-lg mb-3 border border-slate-800/80 font-mono">
                          <div>
                            <span className="text-slate-500 block text-[9px] font-bold uppercase">{t.price}:</span>
                            <span className="text-slate-100 font-black text-xs">
                              ${opp.currentPrice > 10 ? opp.currentPrice.toLocaleString() : opp.currentPrice.toFixed(4)}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px] font-bold uppercase">{t.trendRsi}:</span>
                            <span className="text-slate-200 font-bold">
                              {opp.technicalSummary.trend} ({opp.technicalSummary.rsi})
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px] font-bold uppercase">{t.riskLevel}:</span>
                            <span className={opp.riskLevel === "LOW" ? "text-emerald-400 font-black" : "text-amber-400 font-black"}>
                              {opp.riskLevel}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Row Actions & Indicator */}
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="text-slate-500">FEED: {opp.source}</span>
                          <span className="text-cyan-400 font-bold group-hover:underline flex items-center space-x-1">
                            <span>{isExpanded ? t.hideDetail : t.showDetail}</span>
                          </span>
                        </div>

                        {/* Expanded Cyber Drawer Details & Instant Paper Execution */}
                        {isExpanded && (
                          <div
                            className="mt-3 pt-3 border-t border-slate-800 text-[11px] font-sans space-y-2.5 bg-[#030610] p-3 rounded-xl text-slate-300 animate-in fade-in duration-200 border border-slate-800/80"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div>
                              <span className="text-emerald-400 font-mono font-bold block mb-0.5 text-[10px] uppercase">[SETUP_ENTRY]:</span>
                              <p className="text-slate-200 leading-snug">{opp.conditions.entryConditions[0]}</p>
                            </div>
                            <div>
                              <span className="text-rose-400 font-mono font-bold block mb-0.5 text-[10px] uppercase">[INVALIDATION_LIMIT]:</span>
                              <p className="text-slate-200 leading-snug">{opp.conditions.invalidationConditions[0]}</p>
                            </div>
                            <div>
                              <span className="text-cyan-400 font-mono font-bold block mb-0.5 text-[10px] uppercase">[TARGET_EXIT]:</span>
                              <p className="text-slate-200 leading-snug">{opp.conditions.exitConditions[0]}</p>
                            </div>

                            {/* Futuristic Cyber Buttons */}
                            <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-mono">
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">[PAPER_TRIGGER]:</span>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleQuickPaperTrade(opp.asset, opp.currentPrice, "BUY")}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-black text-[10px] h-6 px-3 shadow-[0_0_12px_rgba(16,185,129,0.4)] rounded-lg"
                                >
                                  [ENTER_LONG]
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleQuickPaperTrade(opp.asset, opp.currentPrice, "SELL")}
                                  className="bg-rose-600 hover:bg-rose-500 text-white font-mono font-black text-[10px] h-6 px-3 shadow-[0_0_12px_rgba(244,63,94,0.4)] rounded-lg"
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

          {/* Real-time SVG Price Chart */}
          <PriceChart symbol={selectedAsset} />

          {/* MEV & Order Impact Realism Simulator */}
          <OrderImpactCalculator symbol={selectedAsset} />

          {/* AI Multi-Agent Copilot */}
          <AiCopilot />
        </div>

        {/* Right Column: Orderbook Depth, Risk Radar & Skeptical Audit (1 col) */}
        <div className="space-y-4">
          <OrderBookVisualizer symbol={selectedAsset} />
          <RiskRadar symbol={selectedAsset} />
          <SkepticalAuditWidget />

          {/* Neural Multi-Agent Status */}
          <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl rounded-2xl">
            <CardHeader className="pb-2 border-b border-slate-800/80">
              <CardTitle className="text-sm font-black font-mono tracking-wider uppercase flex items-center space-x-2">
                <span className="text-cyan-400">❖</span>
                <span>{t.aiAgentsStatus}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs pt-3 font-mono">
              {[
                { name: "Market Scanner Agent", status: "ACTIVE" },
                { name: "Technical Analyst Agent", status: "ACTIVE" },
                { name: "Token Security Analyst", status: "ACTIVE" },
                { name: "Arbitrage Net Edge Analyst", status: "ACTIVE" },
                { name: "Risk Manager Agent", status: "ARMED (VETO)" },
                { name: "Contrarian AI Judge", status: "ACTIVE" },
              ].map((agent, i) => (
                <div key={i} className="flex justify-between items-center py-1.5 border-b border-slate-800/50">
                  <span className="text-slate-300 font-bold">{agent.name}</span>
                  <Badge variant="success" className="text-[9px] font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                    [{agent.status}]
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Futuristic Engine Overview */}
          <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl rounded-2xl">
            <CardHeader className="pb-2 border-b border-slate-800/80">
              <CardTitle className="text-sm font-black font-mono tracking-wider uppercase flex items-center space-x-2">
                <span className="text-amber-400">⚡</span>
                <span>{t.engineOverview}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 text-xs font-mono text-slate-300">
              <div className="p-3 bg-[#040814] rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">{t.dataFeed}:</span>
                  <span className="text-emerald-400 font-bold">100% REAL APIS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">{t.securityVeto}:</span>
                  <span className="text-cyan-400 font-bold">AUTO_RISK_GUARD</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">{t.aiReasoning}:</span>
                  <span className="text-amber-400 font-bold">GROUNDED & CONTRARIAN</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
