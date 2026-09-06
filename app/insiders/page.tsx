"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { LanguageToggle } from "../../components/ui/LanguageToggle";
import { CyberShieldIcon, EnergyBoltIcon } from "../../components/ui/Icons";

interface InsiderTransaction {
  id: string;
  companySymbol: string;
  companyName: string;
  insiderName: string;
  insiderTitle: string;
  transactionType: "BUY" | "SELL";
  sharesCount: number;
  sharePriceUsd: number;
  totalValueUsd: number;
  filingDate: string;
  convictionSignal: string;
}

export default function InsidersPage() {
  const [transactions, setTransactions] = useState<InsiderTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInsiders() {
      try {
        const res = await fetch("/api/insiders/transactions");
        if (res.ok) {
          const json = await res.json();
          setTransactions(json.transactions || []);
        }
      } catch (e) {
        console.error("Failed to load insider transactions:", e);
      } finally {
        setLoading(false);
      }
    }
    loadInsiders();
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
            <span className="text-xl">🕵️</span>
            <h1 className="text-xl font-black font-mono tracking-tight text-white uppercase bg-gradient-to-r from-cyan-300 via-sky-100 to-emerald-300 bg-clip-text text-transparent">
              SEC FORM 4 CORPORATE INSIDER TRADING TRACKER
            </h1>
          </div>
          <Badge variant="success" className="text-[9px] font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            [EXECUTIVE_BUYS: VERIFIED]
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          <LanguageToggle />
        </div>
      </div>

      {/* Transactions Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-16 text-center text-xs font-mono text-cyan-400 animate-pulse">
            [MONITORING_SEC_FORM_4_FILINGS...]
          </div>
        ) : (
          transactions.map((tx) => (
            <Card key={tx.id} className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl rounded-2xl overflow-hidden font-mono">
              <CardHeader className="pb-2 border-b border-slate-800">
                <CardTitle className="text-sm font-black flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-lg font-extrabold">{tx.companySymbol}</span>
                    <Badge variant={tx.transactionType === "BUY" ? "success" : "destructive"} className="text-[10px] font-bold">
                      [{tx.transactionType}]
                    </Badge>
                  </div>
                  <span className="text-emerald-400 text-lg font-black font-mono">
                    ${(tx.totalValueUsd / 1000000).toFixed(2)}M
                  </span>
                </CardTitle>
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">{tx.companyName}</p>
              </CardHeader>

              <CardContent className="pt-3 space-y-3 text-xs">
                <div className="bg-[#040814] p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center text-slate-200 font-bold">
                    <span>{tx.insiderName}</span>
                    <span className="text-cyan-300 text-[10px]">{tx.insiderTitle}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Shares: {tx.sharesCount.toLocaleString()} @ ${tx.sharePriceUsd}</span>
                    <span>Signal: <strong className="text-emerald-400">{tx.convictionSignal}</strong></span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[9px] text-slate-500 pt-1">
                  <span>SOURCE: SEC FORM 4 OFFICIAL FILING</span>
                  <span>FILED: {new Date(tx.filingDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
