"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
import { CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { SpotlightCard } from "../components/ui/SpotlightCard";
import { BorderBeam } from "../components/ui/BorderBeam";
import { QuantumTelemetryBar } from "../components/ui/QuantumTelemetryBar";
import { HudFrame } from "../components/ui/HudFrame";
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
  const [lang] = useState<Language>(() => {
    if (typeof window === "undefined") return "pt";
    return (localStorage.getItem("app_lang") as Language) || "pt";
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [expandedOppId, setExpandedOppId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [paperMessage, setPaperMessage] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);

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
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch("/api/opportunities");
        if (res.ok && isMounted) {
          const json = await res.json();
          setOpportunities(json.opportunities || []);
        }
      } catch (err) {
        console.error("Failed to fetch opportunities:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsRefreshing(false);
        }
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Smooth Auto-sliding Carousel Rotation Interval
  useEffect(() => {
    if (isHovered || opportunities.length === 0) return;

    const timer = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carouselRef.current.scrollBy({ left: 280, behavior: "smooth" });
        }
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [isHovered, opportunities]);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

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
    <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 space-y-3 bg-[#02050e] min-h-screen text-slate-100 font-sans selection:bg-cyan-500 selection:text-black relative">
      {/* Header Banner */}
      <header className="relative z-10 flex flex-wrap items-center justify-between border border-slate-800/80 bg-[#050814]/90 backdrop-blur-xl p-3 rounded-xl shadow-sm font-mono">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-sky-950/80 border border-sky-500/40 font-mono font-black text-sky-300 text-sm">
            ⚡
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black tracking-tight text-white font-mono uppercase">
                GOD // GLOBAL OPPORTUNITY & DATA INTELLIGENCE
              </h1>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-sky-950/80 border border-sky-500/40 text-sky-300 font-bold uppercase tracking-widest">
                [QUANTUM_CORE: ONLINE]
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-mono flex items-center space-x-2 mt-0.5">
              <span className="text-emerald-400 font-bold">[MULTI-ASSET COCKPIT]</span>
              <span>•</span>
              <span className="text-slate-500">ANALYSIS FIRST • NOISE → SIGNAL → EVIDENCE</span>
            </p>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center gap-1 mt-2 sm:mt-0 font-mono">
          <Link href="/research">
            <Button size="sm" className="bg-sky-800 text-white hover:bg-sky-700 font-bold text-xs rounded-lg">
              Research
            </Button>
          </Link>
          <Link href="/dex">
            <Button variant="outline" size="sm" className="bg-[#02040a] border-slate-800 text-slate-300 hover:bg-slate-800 font-bold text-xs rounded-lg">
              DEX
            </Button>
          </Link>
          <Link href="/dividends">
            <Button variant="outline" size="sm" className="bg-[#02040a] border-slate-800 text-slate-300 hover:bg-slate-800 font-bold text-xs rounded-lg">
              Dividends
            </Button>
          </Link>
          <Link href="/small-caps">
            <Button variant="outline" size="sm" className="bg-[#02040a] border-slate-800 text-slate-300 hover:bg-slate-800 font-bold text-xs rounded-lg">
              Small Caps
            </Button>
          </Link>
          <Link href="/sectors">
            <Button variant="outline" size="sm" className="bg-[#02040a] border-slate-800 text-slate-300 hover:bg-slate-800 font-bold text-xs rounded-lg">
              Sectors
            </Button>
          </Link>
          <Link href="/wallet">
            <Button variant="outline" size="sm" className="bg-[#02040a] border-slate-800 text-slate-300 hover:bg-slate-800 font-bold text-xs rounded-lg">
              Whales
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="outline" size="sm" className="bg-[#02040a] border-slate-800 text-slate-300 hover:bg-slate-800 font-bold text-xs rounded-lg">
              Settings
            </Button>
          </Link>
          <LanguageToggle />
          <SystemHealth />
        </div>
      </header>

      {/* Quantum Real-time Telemetry Bar */}
      <div className="relative z-10">
        <QuantumTelemetryBar />
      </div>

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
        <div className="relative z-10 p-2 bg-slate-900 border border-sky-500/40 rounded-lg text-sky-200 text-xs font-mono font-bold flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-2">
          <span className="flex items-center space-x-2">
            <span className="animate-pulse text-sky-400">⚡</span>
            <span>{paperMessage}</span>
          </span>
          <span className="text-[9px] text-sky-400/80 uppercase tracking-widest font-mono">PAPER_EXECUTION_BAR</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left Column: Opportunities, Chart & AI Copilot (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          {/* Cyber Opportunities Terminal - SPOTLIGHT CARD & BORDER BEAM */}
          <SpotlightCard className="bg-[#050814]/90 border border-slate-800 rounded-xl overflow-hidden relative">
            <BorderBeam size={220} duration={12} colorFrom="#38bdf8" colorTo="#10b981" />

            <CardHeader className="flex flex-row items-center justify-between py-1.5 px-3 border-b border-slate-800/80 font-mono">
              <CardTitle className="text-xs font-black tracking-wider uppercase flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                <span className="text-slate-100">{t.liveOpportunities}</span>
                <Badge variant="outline" className="text-[8px] font-mono font-bold py-0.5 px-1.5 bg-slate-900 border-slate-700 text-emerald-400">
                  [LIVE_OBJECTS: AUTOMATED]
                </Badge>
              </CardTitle>

              {/* CAROUSEL SLIDER CONTROLS */}
              <div className="flex items-center space-x-1 font-mono">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => scrollCarousel("left")}
                  className="text-[10px] h-5 w-5 p-0 bg-[#02040a] border-slate-800 text-slate-300 hover:bg-slate-800 font-bold rounded"
                  title="Slide Left"
                >
                  ←
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => scrollCarousel("right")}
                  className="text-[10px] h-5 w-5 p-0 bg-[#02040a] border-slate-800 text-slate-300 hover:bg-slate-800 font-bold rounded"
                  title="Slide Right"
                >
                  →
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchOpps}
                  disabled={isRefreshing}
                  className="text-[9px] py-0.5 px-2 bg-[#02040a] border-slate-800 text-slate-300 hover:bg-slate-800 font-mono font-bold transition-all duration-300 rounded ml-1"
                >
                  {isRefreshing ? t.updatingBtn : t.updateBtn}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-2.5">
              {loading ? (
                <div className="py-6 text-center text-xs font-mono text-sky-400/80 animate-pulse flex flex-col items-center justify-center space-y-2">
                  <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                  <span>[EVALUATING_MULTI_ASSET_INTELLIGENCE_FEEDS...]</span>
                </div>
              ) : opportunities.length === 0 ? (
                <div className="py-6 text-center text-xs font-mono text-slate-400">
                  {t.noOpportunities}
                </div>
              ) : (
                /* HORIZONTAL SCROLLING ROW / ANIMATED AUTO-ROTATING SLIDER CAROUSEL */
                <div
                  ref={carouselRef}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="flex items-center space-x-2.5 overflow-x-auto pb-1 scroll-smooth snap-x scrollbar-thin font-mono"
                >
                  {opportunities.map((opp) => {
                    const isExpanded = expandedOppId === opp.opportunityId;
                    const isSelected = selectedAsset === opp.asset;

                    return (
                      <div
                        key={opp.opportunityId}
                        onClick={() => toggleExpand(opp.opportunityId, opp.asset)}
                        className={`min-w-[250px] max-w-[270px] shrink-0 snap-start p-2.5 rounded-lg border transition-all duration-200 cursor-pointer relative group ${
                          isSelected
                            ? "bg-[#090e24] border-sky-500/60 shadow-md scale-[1.01]"
                            : "bg-[#02040a] hover:bg-[#070c1e] border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center space-x-1.5">
                            <div className="w-6 h-6 rounded bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-black text-[10px] text-sky-300">
                              {opp.asset.slice(0, 3)}
                            </div>
                            <div>
                              <span className="font-mono font-black text-xs text-white tracking-wide">{opp.asset}</span>
                              <span className="ml-1 text-[8px] font-mono px-1 py-0.2 rounded bg-slate-900 border border-slate-800 text-sky-400 uppercase font-bold">
                                {opp.opportunityType}
                              </span>
                            </div>
                          </div>

                          {/* HERO GIANT KPI SCORE */}
                          <div className="text-right flex items-baseline space-x-0.5">
                            <span className="font-mono font-black text-2xl text-emerald-400 tabular-nums">
                              {opp.score}
                            </span>
                            <span className="text-[9px] text-slate-500 font-bold">/100</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-1 text-[9px] bg-[#050814] p-1.5 rounded mb-1.5 border border-slate-800/80 font-mono">
                          <div>
                            <span className="text-slate-500 block text-[8px] font-bold uppercase">{t.price}:</span>
                            <span className="text-slate-100 font-bold text-[10px] tabular-nums">
                              ${opp.currentPrice > 10 ? opp.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }) : opp.currentPrice.toFixed(4)}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[8px] font-bold uppercase">{t.trendRsi}:</span>
                            <span className="text-slate-200 font-bold text-[9px]">
                              {opp.technicalSummary.trend} ({opp.technicalSummary.rsi})
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[8px] font-bold uppercase">{t.riskLevel}:</span>
                            <span className={opp.riskLevel === "LOW" ? "text-emerald-400 font-bold text-[9px]" : "text-amber-400 font-bold text-[9px]"}>
                              {opp.riskLevel}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[8px] font-mono text-slate-400">
                          <span className="text-slate-500">FEED: {opp.source}</span>
                          <span className="text-sky-400 font-bold group-hover:underline">
                            {isExpanded ? t.hideDetail : t.showDetail}
                          </span>
                        </div>

                        {isExpanded && (
                          <div
                            className="mt-2 pt-2 border-t border-slate-800 text-[10px] font-sans space-y-2 bg-[#02040a] p-2 rounded text-slate-300 animate-in fade-in duration-200 border border-slate-800"
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
                              <span className="text-sky-400 font-mono font-bold block mb-0.5 text-[9px] uppercase">[TARGET_EXIT]:</span>
                              <p className="text-slate-200 text-[10px] leading-snug">{opp.conditions.exitConditions[0]}</p>
                            </div>

                            <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between font-mono">
                              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">[PAPER_TRIGGER]:</span>
                              <div className="flex items-center space-x-1.5">
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleQuickPaperTrade(opp.asset, opp.currentPrice, "BUY")}
                                  className="bg-emerald-700 hover:bg-emerald-600 text-white font-mono font-bold text-[9px] h-5 px-2 rounded"
                                >
                                  [ENTER_LONG]
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleQuickPaperTrade(opp.asset, opp.currentPrice, "SELL")}
                                  className="bg-rose-700 hover:bg-rose-600 text-white font-mono font-bold text-[9px] h-5 px-2 rounded"
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
          </SpotlightCard>

          {/* Real-time SVG / TradingView Price Chart */}
          <PriceChart symbol={selectedAsset} />

          {/* AI Multi-Agent Copilot */}
          <AiCopilot />
        </div>

        {/* Right Column: Orderbook Depth & Compact Horizontal Risk Radar wrapped in HudFrame */}
        <div className="space-y-3">
          <HudFrame title="ORDERBOOK DEPTH VISUALIZER" subtitle="LIVE DEPTH" accentColor="cyan">
            <OrderBookVisualizer symbol={selectedAsset} />
          </HudFrame>
          <HudFrame title="RISK RADAR TELEMETRY" subtitle="MONTE CARLO" accentColor="emerald">
            <RiskRadar symbol={selectedAsset} />
          </HudFrame>
        </div>
      </div>
    </main>
  );
}
