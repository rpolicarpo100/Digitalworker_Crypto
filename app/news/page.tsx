"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { LanguageToggle } from "../../components/ui/LanguageToggle";
import { CyberShieldIcon, EnergyBoltIcon } from "../../components/ui/Icons";

interface Tier1NewsItem {
  id: string;
  headline: string;
  sourceTier: string;
  publisher: string;
  assetSymbols: string[];
  catalystCategory: string;
  sentiment: string;
  materialityScore: number;
  summary: string;
  publishedAt: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<Tier1NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch("/api/news/tier1");
        if (res.ok) {
          const json = await res.json();
          setNews(json.news || []);
        }
      } catch (e) {
        console.error("Failed to load news:", e);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
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
            <span className="text-xl">📰</span>
            <h1 className="text-xl font-black font-mono tracking-tight text-white uppercase bg-gradient-to-r from-cyan-300 via-sky-100 to-emerald-300 bg-clip-text text-transparent">
              TIER 1 VERIFIED FINANCIAL NEWS & CATALYST INTELLIGENCE
            </h1>
          </div>
          <Badge variant="success" className="text-[9px] font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            [TIER_1_FILTER: ARMED]
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          <LanguageToggle />
        </div>
      </div>

      {/* News List */}
      <div className="relative z-10 space-y-3 font-mono">
        {loading ? (
          <div className="py-16 text-center text-xs font-mono text-cyan-400 animate-pulse">
            [FILTERING_HEADLINES_AND_VERIFYING_REGULATORY_FILINGS...]
          </div>
        ) : (
          news.map((item) => (
            <Card key={item.id} className="bg-[#070d1e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-xl rounded-2xl overflow-hidden p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-[9px] font-mono border-blue-500/40 text-blue-300 font-bold uppercase">
                      {item.sourceTier}
                    </Badge>
                    <Badge variant="success" className="text-[9px] font-mono font-bold">
                      {item.catalystCategory}
                    </Badge>
                    <span className="text-[10px] text-slate-400">Publisher: {item.publisher}</span>
                  </div>
                  <h3 className="text-base font-black text-white font-sans leading-snug">{item.headline}</h3>
                  <p className="text-xs text-slate-300 font-sans">{item.summary}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-lg font-black text-emerald-400 block">{item.materialityScore}/100</span>
                  <span className="text-[9px] text-slate-400 uppercase font-bold">Materiality</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
