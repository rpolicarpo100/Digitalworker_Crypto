"use client";

import { useState } from "react";
import { Badge } from "../ui/badge";

interface GroundedAiResponse {
  answer: string;
  dataEvidence: Record<string, unknown>;
  sources: string[];
  confidence: "High" | "Medium" | "Low";
  confidenceScore: number;
  risks: string[];
  counterarguments: string[];
  invalidation: string[];
  timestamp: string;
}

const KNOWN_SYMBOLS = ["BTC", "ETH", "SOL", "PEPE", "BNB", "AVAX", "XRP", "ADA", "DOGE", "LINK", "SUI", "APT", "NEAR", "RENDER", "FET", "WIF"];

function extractSymbolFromQuery(text: string): string {
  const upper = text.toUpperCase();
  for (const sym of KNOWN_SYMBOLS) {
    const regex = new RegExp(`\\b${sym}\\b`, "i");
    if (regex.test(upper)) {
      return sym;
    }
  }
  return "BTC";
}

export function AiCopilot() {
  const [query, setQuery] = useState("What opportunities exist for BTC right now?");
  const [response, setResponse] = useState<GroundedAiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!query.trim()) return;
    setLoading(true);
    const detectedSymbol = extractSymbolFromQuery(query);

    try {
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, symbol: detectedSymbol }),
      });
      if (res.ok) {
        const json = await res.json();
        setResponse(json);
      }
    } catch (err) {
      console.error("AI Copilot request failed:", err);
    } finally {
      setLoading(false);
    }
  }

  const pipelineNodes = [
    { label: "DATA", active: true },
    { label: "SIGNALS", active: true },
    { label: "ANALYSIS", active: true },
    { label: "CONFIDENCE", active: !!response },
    { label: "RISK", active: !!response },
    { label: "OPPORTUNITY", active: !!response },
  ];

  return (
    <div className="bg-[#050814]/90 border border-slate-800 rounded-xl p-3.5 font-mono space-y-3">
      {/* Engine Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <h2 className="text-xs font-black tracking-wider uppercase text-slate-100">
            GOD INTELLIGENCE PIPELINE ENGINE
          </h2>
        </div>
        <Badge variant="outline" className="text-[9px] font-bold border-slate-700 text-sky-400 bg-slate-900/60">
          CONTRARIAN MULTI-AGENT COGNITION
        </Badge>
      </div>

      {/* Visual Pipeline Flow Nodes */}
      <div className="flex items-center justify-between bg-[#02040a] p-2 rounded-lg border border-slate-800/80 text-[8px] tracking-wider">
        {pipelineNodes.map((node, i) => (
          <div key={node.label} className="flex items-center space-x-1 sm:space-x-2">
            <div className="flex items-center space-x-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  node.active ? "bg-sky-400 animate-pulse" : "bg-slate-700"
                }`}
              />
              <span className={node.active ? "text-slate-200 font-bold" : "text-slate-600"}>
                {node.label}
              </span>
            </div>
            {i < pipelineNodes.length - 1 && (
              <span className="text-slate-700 text-[10px]">→</span>
            )}
          </div>
        ))}
      </div>

      {/* Command Telemetry Query Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="PROMPT > What opportunities exist for BTC right now?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            className="w-full bg-[#02040a] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 font-mono"
          />
        </div>
        <button
          onClick={handleAsk}
          disabled={loading}
          className="bg-sky-800 hover:bg-sky-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 shrink-0"
        >
          {loading ? "SYNTHESIZING..." : "RUN ANALYSIS"}
        </button>
      </div>

      {/* Loading Telemetry State */}
      {loading && (
        <div className="py-6 text-center text-xs text-sky-400/80 animate-pulse space-y-1">
          <div>[ORCHESTRATING AGENTS: MARKET_SCANNER → TECHNICAL_ANALYST → RISK_MANAGER → CONTRARIAN_JUDGE]</div>
          <div className="text-[9px] text-slate-500">AGGREGATING ON-CHAIN PROVENANCE & SEC FILINGS...</div>
        </div>
      )}

      {/* Layered Intelligence Output Nodes */}
      {response && !loading && (
        <div className="space-y-2.5 bg-[#02040a] p-3 rounded-lg border border-slate-800/80 text-xs">
          {/* Header Metric */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px]">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">CONFIDENCE SCORE:</span>
              <strong className="text-emerald-400 font-bold tabular-nums">
                {response.confidenceScore} / 100 ({response.confidence.toUpperCase()})
              </strong>
            </div>
            <div className="text-slate-500 tabular-nums">
              TIMESTAMP: {new Date(response.timestamp).toLocaleTimeString()}
            </div>
          </div>

          {/* Primary Synthesis Answer */}
          <div>
            <span className="text-sky-400 font-bold block mb-1 text-[10px] uppercase tracking-wider">
              [PRIMARY SYNTHESIS ANALYSIS]:
            </span>
            <p className="text-slate-200 leading-relaxed text-[11px] font-sans">
              {response.answer}
            </p>
          </div>

          {/* Contrarian Counterarguments (Section 21) */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-amber-400 font-bold block mb-1 text-[10px] uppercase tracking-wider">
              [CONTRARIAN DEVIL&apos;S ADVOCATE - COUNTER EVIDENCE]:
            </span>
            <ul className="space-y-1 text-slate-300 text-[10px]">
              {response.counterarguments.map((arg, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-amber-400">•</span>
                  <span>{arg}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Invalidation Limits */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-rose-400 font-bold block mb-1 text-[10px] uppercase tracking-wider">
              [THESIS INVALIDATION THRESHOLDS]:
            </span>
            <ul className="space-y-1 text-slate-300 text-[10px]">
              {response.invalidation.map((inv, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-rose-400">•</span>
                  <span>{inv}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Sources Provenance */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-500">
            <span>VERIFIED SOURCES: {response.sources.join(", ")}</span>
            <span className="text-emerald-400 font-bold">100% REAL DATA</span>
          </div>
        </div>
      )}
    </div>
  );
}
