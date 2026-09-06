"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { LanguageToggle } from "../../components/ui/LanguageToggle";

interface SmallCapAsset {
  profile: {
    symbol: string;
    name: string;
    marketCapUsd: number;
    marketCapTier: string;
    sector: string;
  };
  priceUsd: number;
  change24hPercent: number;
  smallCapRisk: {
    liquidityScore: number;
    bidAskSpreadPercent: number;
    dilutionRiskScore: number;
    antiPumpDumpRisk: string;
    pumpDumpFlags: string[];
    cashRunwayMonths: number;
    insiderOwnershipPercent: number;
    institutionalOwnershipPercent: number;
  };
  riskFingerprint: {
    liquidityRisk: number;
    dilutionRisk: number;
    debtRisk: number;
    governanceRisk: number;
    volatilityRisk: number;
    aggregateRiskScore: number;
    overallRiskCategory: string;
  };
  dilutionAnalysis: {
    annualDilutionRatePercent: { value: number };
    atmFacilityActive: { value: boolean };
    warrantsOrConvertiblesOutstanding: { value: boolean };
    mitigationAdvice: string;
  };
}

export default function SmallCapsPage() {
  const [assets, setAssets] = useState<SmallCapAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSmallCaps() {
      try {
        const res = await fetch("/api/small-caps");
        if (res.ok) {
          const json = await res.json();
          setAssets(json.assets || []);
        }
      } catch (e) {
        console.error("Failed to load small cap intelligence:", e);
      } finally {
        setLoading(false);
      }
    }
    loadSmallCaps();
  }, []);

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
            <span className="text-xl">🔬</span>
            <h1 className="text-xl font-black font-mono tracking-tight text-white uppercase bg-gradient-to-r from-cyan-300 via-sky-100 to-emerald-300 bg-clip-text text-transparent">
              NANO, MICRO & SMALL CAP RESEARCH LAB
            </h1>
          </div>
          <Badge variant="warning" className="text-[9px] font-mono font-bold bg-amber-950 border border-amber-500/40 text-amber-300">
            [RISK_FINGERPRINT: ARMED]
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          <LanguageToggle />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-xs font-mono text-cyan-400 animate-pulse">
            [AUDITING_CASH_RUNWAY_DILUTION_RISKS_AND_INSIDER_HOLDINGS...]
          </div>
        ) : (
          assets.map((item) => (
            <Card key={item.profile.symbol} className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl rounded-2xl overflow-hidden p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-black text-white">{item.profile.symbol}</span>
                    <Badge variant="outline" className="text-[9px] font-mono border-blue-500/40 text-blue-300 uppercase">
                      {item.profile.marketCapTier}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-slate-400 font-sans block">{item.profile.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-white text-base font-bold">${item.priceUsd.toFixed(2)}</span>
                  <span className={item.change24hPercent >= 0 ? "text-emerald-400 text-xs font-bold block" : "text-rose-400 text-xs font-bold block"}>
                    {item.change24hPercent >= 0 ? `+${item.change24hPercent.toFixed(2)}%` : `${item.change24hPercent.toFixed(2)}%`}
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 bg-[#040814] p-2.5 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Cash Runway:</span>
                  <span className={item.smallCapRisk.cashRunwayMonths < 12 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                    {item.smallCapRisk.cashRunwayMonths} Months
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Dilution Risk:</span>
                  <span className="text-amber-400 font-bold">{item.smallCapRisk.dilutionRiskScore}/100</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Insider Ownership:</span>
                  <span className="text-slate-200 font-bold">{item.smallCapRisk.insiderOwnershipPercent}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Inst. Holdings:</span>
                  <span className="text-slate-200 font-bold">{item.smallCapRisk.institutionalOwnershipPercent}%</span>
                </div>
              </div>

              {/* Dilution Alert */}
              <div className="p-2.5 bg-[#040814] rounded-xl border border-slate-800 text-[10px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-cyan-400 font-bold uppercase text-[9px]">[ATM_AND_WARRANTS]:</span>
                  <Badge variant={item.dilutionAnalysis.atmFacilityActive.value ? "warning" : "success"} className="text-[8px]">
                    {item.dilutionAnalysis.atmFacilityActive.value ? "ATM ACTIVE" : "NO ATM"}
                  </Badge>
                </div>
                <p className="text-slate-300">{item.dilutionAnalysis.mitigationAdvice}</p>
              </div>

              {/* Pump & Dump Risk */}
              {item.smallCapRisk.pumpDumpFlags.length > 0 && (
                <div className="p-2 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-[10px]">
                  <span className="font-bold block uppercase mb-0.5">⚠️ Red Flag Warning:</span>
                  <p>• {item.smallCapRisk.pumpDumpFlags[0]}</p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
