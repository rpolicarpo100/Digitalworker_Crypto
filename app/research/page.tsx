"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { LanguageToggle } from "../../components/ui/LanguageToggle";
import { ResearchReportExporter } from "../../components/dashboard/ResearchReportExporter";
import { MultiAssetAnalysisReport, AnalysisMode } from "../../lib/types/multi-asset";
import { CyberShieldIcon, EnergyBoltIcon, RadarSweepIcon } from "../../components/ui/Icons";

export default function ResearchPage() {
  const [query, setQuery] = useState("NVDA");
  const [mode, setMode] = useState<AnalysisMode>("PROFESSIONAL");
  const [report, setReport] = useState<MultiAssetAnalysisReport | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = useCallback(async (symbol: string, currentMode: AnalysisMode) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/assets/research?symbol=${encodeURIComponent(symbol)}&mode=${currentMode}`);
      if (res.ok) {
        const json = await res.json();
        setReport(json);
      }
    } catch (e) {
      console.error("Failed to fetch research report:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport("NVDA", "PROFESSIONAL");
  }, [fetchReport]);

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
            <span className="text-xl">📊</span>
            <h1 className="text-xl font-black font-mono tracking-tight text-white uppercase bg-gradient-to-r from-cyan-300 via-sky-100 to-emerald-300 bg-clip-text text-transparent">
              MULTI-ASSET FINANCIAL INTELLIGENCE RESEARCH ENGINE
            </h1>
          </div>
          <Badge variant="success" className="text-[9px] font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            [ZERO_FICTION: VERIFIED]
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          {report && <ResearchReportExporter report={report} />}
          <LanguageToggle />
        </div>
      </div>

      {/* Multi-Asset Search & Analysis Mode Switcher */}
      <div className="relative z-10 space-y-3 bg-[#070d1e]/80 p-3.5 rounded-2xl border border-cyan-500/20 backdrop-blur-xl shadow-lg">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 flex-1">
            <Input
              placeholder="Search ticker across Crypto, Stocks, ETFs, REITs (e.g. NVDA, BTC, ASML, MC)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchReport(query, mode)}
              className="max-w-md bg-[#040814] border-slate-800 text-xs font-mono focus:border-cyan-400 text-slate-100"
            />
            <Button onClick={() => fetchReport(query, mode)} size="sm" className="text-xs bg-cyan-600 hover:bg-cyan-500 font-mono font-bold px-4 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              🔍 ANALYZE ASSET
            </Button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 text-[9px] font-mono uppercase font-bold mr-1">[RESEARCH_MODE]:</span>
          {(["QUICK", "STANDARD", "PROFESSIONAL", "DEEP_RESEARCH", "THIRD_EYE"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                fetchReport(query, m);
              }}
              className={`px-3 py-1 rounded-xl text-[11px] font-mono font-bold transition-all duration-300 ${
                mode === m
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : "bg-[#040814] border border-slate-800 text-slate-400 hover:text-slate-100"
              }`}
            >
              [{m}]
            </button>
          ))}
        </div>
      </div>

      {/* Main Research Report */}
      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-cyan-400 animate-pulse flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>[FETCHING_FUNDAMENTALS_VALUATIONS_DEVILS_ADVOCATE_AUDIT...]</span>
        </div>
      ) : !report ? (
        <div className="py-12 text-center text-xs font-mono text-slate-400">
          No data available for symbol {query}.
        </div>
      ) : (
        <div className="relative z-10 space-y-4 font-mono">
          {/* Executive Summary Card */}
          <Card className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-800/80 flex flex-row items-center justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-black text-white">{report.profile.symbol}</h2>
                  <span className="text-sm font-bold text-slate-300 font-sans">{report.profile.name}</span>
                  <Badge variant="outline" className="text-[10px] border-cyan-500/40 text-cyan-300 font-bold uppercase">
                    {report.profile.assetClass} • {report.profile.marketCapTier}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-sans">
                  Exchange: {report.profile.exchange} | Country: {report.profile.country} | Sector: {report.profile.sector} | Industry: {report.profile.industry}
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400">
                  ${report.priceUsd.toLocaleString()}
                </span>
                <span className={report.change24hPercent >= 0 ? "block text-xs text-emerald-400 font-bold" : "block text-xs text-rose-400 font-bold"}>
                  {report.change24hPercent >= 0 ? `+${report.change24hPercent.toFixed(2)}%` : `${report.change24hPercent.toFixed(2)}%`}
                </span>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {/* Scorecard Bar */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center">
                <div className="p-2.5 bg-[#040814] rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Composite Score</span>
                  <span className="text-emerald-400 font-black text-lg">{report.scores.compositeScore}/100</span>
                </div>
                <div className="p-2.5 bg-[#040814] rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Confidence Score</span>
                  <span className="text-cyan-400 font-black text-lg">{report.scores.confidenceScore}/100</span>
                </div>
                <div className="p-2.5 bg-[#040814] rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Fundamental Score</span>
                  <span className="text-slate-200 font-bold text-base">{report.scores.fundamentalScore}/100</span>
                </div>
                <div className="p-2.5 bg-[#040814] rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Valuation Score</span>
                  <span className="text-slate-200 font-bold text-base">{report.scores.valuationScore}/100</span>
                </div>
                <div className="p-2.5 bg-[#040814] rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Dividend Quality</span>
                  <span className="text-slate-200 font-bold text-base">{report.scores.dividendScore}/100</span>
                </div>
                <div className="p-2.5 bg-[#040814] rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Classification</span>
                  <Badge variant="success" className="text-[10px] font-bold mt-1">
                    {report.opportunityClassification}
                  </Badge>
                </div>
              </div>

              {/* Fundamentals & Valuation Grid (if stock) */}
              {report.fundamentals && report.valuation && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-[#040814] rounded-xl border border-slate-800 space-y-2">
                    <span className="text-cyan-400 font-bold text-xs uppercase block flex items-center space-x-1">
                      <EnergyBoltIcon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Financial Fundamentals:</span>
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <p>• Revenue: <strong className="text-slate-100">${(report.fundamentals.revenueUsd / 1e9).toFixed(2)}B</strong></p>
                      <p>• Revenue YoY: <strong className="text-emerald-400">+{report.fundamentals.revenueGrowthYoyPercent}%</strong></p>
                      <p>• Gross Margin: <strong className="text-slate-100">{report.fundamentals.grossMarginPercent}%</strong></p>
                      <p>• Operating Margin: <strong className="text-slate-100">{report.fundamentals.operatingMarginPercent}%</strong></p>
                      <p>• Free Cash Flow: <strong className="text-slate-100">${(report.fundamentals.freeCashFlowUsd / 1e9).toFixed(2)}B</strong></p>
                      <p>• ROE: <strong className="text-slate-100">{report.fundamentals.roePercent}%</strong></p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#040814] rounded-xl border border-slate-800 space-y-2">
                    <span className="text-amber-400 font-bold text-xs uppercase block flex items-center space-x-1">
                      <RadarSweepIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>Valuation Multiples & Scenarios:</span>
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <p>• P/E Ratio: <strong className="text-slate-100">{report.valuation.peRatio}x</strong></p>
                      <p>• Forward P/E: <strong className="text-slate-100">{report.valuation.forwardPe}x</strong></p>
                      <p>• PEG Ratio: <strong className="text-slate-100">{report.valuation.pegRatio}</strong></p>
                      <p>• FCF Yield: <strong className="text-emerald-400">{report.valuation.fcfYieldPercent}%</strong></p>
                      <p>• Bear Scenario: <strong className="text-rose-400">${report.scenarios.bear.priceUsd}</strong></p>
                      <p>• Bull Scenario: <strong className="text-emerald-400">${report.scenarios.bull.priceUsd}</strong></p>
                    </div>
                  </div>
                </div>
              )}

              {/* Devil's Advocate & Third Eye Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-[#040814] rounded-xl border border-rose-800/60 space-y-2 text-rose-200">
                  <span className="text-rose-400 font-bold text-xs uppercase block flex items-center space-x-1">
                    <CyberShieldIcon className="w-3.5 h-3.5 text-rose-400" />
                    <span>DEVIL'S ADVOCATE (BEARISH REVIEW):</span>
                  </span>
                  <p className="text-[11px] text-slate-200">{report.devilsAdvocate.bearishReview}</p>
                  <p className="text-[11px] text-rose-300 font-bold">• Strongest Counter-Argument: {report.devilsAdvocate.strongestCounterArgument}</p>
                </div>

                <div className="p-3.5 bg-[#040814] rounded-xl border border-amber-800/60 space-y-2 text-amber-200">
                  <span className="text-amber-400 font-bold text-xs uppercase block">THIRD EYE (HIDDEN RISKS & DIVERGENCES):</span>
                  <p className="text-[11px] text-slate-200">{report.thirdEye?.narrativeVsFundamentalsDivergence}</p>
                  {report.thirdEye?.hiddenRisks && report.thirdEye.hiddenRisks.length > 0 && (
                    <p className="text-[11px] text-amber-300 font-bold">• Hidden Risk: {report.thirdEye.hiddenRisks[0]}</p>
                  )}
                </div>
              </div>

              {/* Data Provenance Footer */}
              <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800 flex justify-between">
                <span>Source: {report.dataProvenance.source} ({report.dataProvenance.status})</span>
                <span>Retrieved: {new Date(report.dataProvenance.retrievedAt).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
