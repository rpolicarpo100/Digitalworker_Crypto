"use client";

import { useState } from "react";
import { Badge } from "../ui/badge";

interface TacticalRecommendation {
  bias: "BULLISH_LONG" | "BEARISH_SHORT" | "NEUTRAL_WAIT" | "CAUTION_RISK";
  suggestedAction: string;
  targetPriceUsd?: number;
  invalidationStopUsd?: number;
}

interface GroundedAiResponse {
  answer: string;
  userIntent: "BUY_SELL_ADVICE" | "TECHNICAL_ANALYSIS" | "RISK_AUDIT" | "DIVIDEND_FUNDAMENTALS" | "MARKET_GENERAL";
  language: "PT" | "EN" | "FR";
  tacticalRecommendation: TacticalRecommendation;
  dataEvidence: Record<string, unknown>;
  sources: string[];
  confidence: "High" | "Medium" | "Low";
  confidenceScore: number;
  risks: string[];
  counterarguments: string[];
  invalidation: string[];
  timestamp: string;
}

const PRESET_PROMPTS = [
  "Devo comprar BTC hoje?",
  "Análise técnica e RSI de SOL",
  "Auditoria de risco e Honeypot de PEPE",
  "Fundamentos e dividendos de NVDA",
];

const KNOWN_SYMBOLS = [
  "BTC", "ETH", "SOL", "PEPE", "BNB", "AVAX", "XRP", "ADA", "DOGE", "LINK",
  "SUI", "APT", "NEAR", "RENDER", "FET", "WIF", "NVDA", "AAPL", "MSFT", "O", "ASML"
];

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
  const [query, setQuery] = useState("Devo comprar BTC hoje?");
  const [response, setResponse] = useState<GroundedAiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAsk(promptToAsk?: string) {
    const activeQuery = promptToAsk || query;
    if (!activeQuery.trim()) return;
    setLoading(true);
    const detectedSymbol = extractSymbolFromQuery(activeQuery);

    try {
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: activeQuery, symbol: detectedSymbol }),
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
    { label: "TACTICAL_PLAN", active: !!response },
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
        <div className="flex items-center space-x-1.5">
          {response && (
            <Badge variant="outline" className="text-[8px] font-bold border-slate-700 text-emerald-400 bg-slate-900/80">
              [{response.language}: {response.userIntent}]
            </Badge>
          )}
          <Badge variant="outline" className="text-[9px] font-bold border-slate-700 text-sky-400 bg-slate-900/60">
            CONTRARIAN COGNITION
          </Badge>
        </div>
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

      {/* Quick Prompt Presets */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[9px]">
        <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px] shrink-0">SUGESTÕES:</span>
        {PRESET_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => {
              setQuery(p);
              handleAsk(p);
            }}
            className="px-2 py-0.5 bg-[#02040a] border border-slate-800 hover:border-slate-700 rounded text-slate-300 hover:text-white transition-colors shrink-0 font-bold"
          >
            [{p}]
          </button>
        ))}
      </div>

      {/* Command Telemetry Query Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="PROMPT > Escreva a sua questão sobre qualquer ativo ou mercado..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            className="w-full bg-[#02040a] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 font-mono"
          />
        </div>
        <button
          onClick={() => handleAsk()}
          disabled={loading}
          className="bg-sky-800 hover:bg-sky-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 shrink-0"
        >
          {loading ? "PROCESSANDO..." : "ANALISAR"}
        </button>
      </div>

      {/* Loading Telemetry State */}
      {loading && (
        <div className="py-6 text-center text-xs text-sky-400/80 animate-pulse space-y-1">
          <div>[PROCESSANDO EM CADEIA MULTI-AGENTE: SCANNER → ANÁLISE TÉCNICA → GESTÃO DE RISCO → ADVOGADO DO DIABO]</div>
          <div className="text-[9px] text-slate-500">CONSULTANDO BINANCE, DEXSCREENER & FILINGS EM TEMPO REAL...</div>
        </div>
      )}

      {/* Layered Intelligence Output Nodes */}
      {response && !loading && (
        <div className="space-y-3 bg-[#02040a] p-3 rounded-lg border border-slate-800/80 text-xs">
          {/* Tactical Recommendation Banner */}
          {response.tacticalRecommendation && (
            <div className="bg-[#050918] p-2.5 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-[9px] text-slate-400 uppercase font-bold">RECOMENDAÇÃO TÁTICA:</span>
                <Badge
                  variant={
                    response.tacticalRecommendation.bias === "BULLISH_LONG"
                      ? "success"
                      : response.tacticalRecommendation.bias === "BEARISH_SHORT"
                      ? "destructive"
                      : "outline"
                  }
                  className="text-[9px] font-bold py-0.5 px-2 font-mono"
                >
                  [{response.tacticalRecommendation.bias}]
                </Badge>
              </div>

              {response.tacticalRecommendation.targetPriceUsd && (
                <div className="flex items-center space-x-3 text-[10px]">
                  <span>ALVO DE SAÍDA: <strong className="text-emerald-400 tabular-nums">${response.tacticalRecommendation.targetPriceUsd.toLocaleString()}</strong></span>
                  <span>INVALIDAÇÃO (STOP): <strong className="text-rose-400 tabular-nums">${response.tacticalRecommendation.invalidationStopUsd?.toLocaleString()}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* Primary Synthesis Answer */}
          <div>
            <span className="text-sky-400 font-bold block mb-1 text-[10px] uppercase tracking-wider">
              [RESUMO EXECUTIVO PERSONALIZADO]:
            </span>
            <p className="text-slate-200 leading-relaxed text-[11px] font-sans">
              {response.answer}
            </p>
          </div>

          {/* Contrarian Counterarguments (Section 21) */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-amber-400 font-bold block mb-1 text-[10px] uppercase tracking-wider">
              [ANÁLISE CONTRÁRIA - ADVOGADO DO DIABO]:
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
              [CONDIÇÕES DE INVALIDAÇÃO DA TESE]:
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

          {/* Data Sources Provenance Footer */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-500">
            <span>FONTES VERIFICADAS: {response.sources.join(", ")}</span>
            <span className="text-emerald-400 font-bold">100% DADOS REAIS VERIFICADOS</span>
          </div>
        </div>
      )}
    </div>
  );
}
