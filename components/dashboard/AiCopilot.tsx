"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

export function AiCopilot() {
  const [query, setQuery] = useState("What opportunities exist for BTC right now?");
  const [symbol, setSymbol] = useState("BTC");
  const [response, setResponse] = useState<GroundedAiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, symbol }),
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

  return (
    <Card className="bg-[#0b101e] border-slate-800">
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>🤖 AI Multi-Agent Copilot</span>
            <Badge variant="success">Grounded & Contrarian</Badge>
          </div>
          {response && (
            <Badge variant={response.confidence === "High" ? "success" : "warning"}>
              Confidence: {response.confidenceScore}/100
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Ask AI Copilot (e.g. Why is BTC bullish? What could break this setup?)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="w-24 font-mono uppercase"
          />
          <Button onClick={handleAsk} size="sm">Ask Copilot</Button>
        </div>

        {loading && (
          <div className="py-6 text-center text-xs text-slate-500 animate-pulse">
            Orchestrating AI agents (Market Scanner, Technical Analyst, Risk Manager, Contrarian Judge)...
          </div>
        )}

        {response && !loading && (
          <div className="space-y-3 text-xs bg-[#080d19] p-3.5 rounded border border-slate-800">
            {/* Answer */}
            <div>
              <span className="text-blue-400 font-bold block mb-1">ANSWER:</span>
              <p className="text-slate-200 leading-relaxed">{response.answer}</p>
            </div>

            {/* Evidence & Sources */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
              <div>
                <span className="text-slate-500 font-medium block">Verified Data Sources:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {response.sources.map((s) => (
                    <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Timestamp:</span>
                <span className="text-slate-400 font-mono text-[11px] mt-1 block">
                  {new Date(response.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>

            {/* Contrarian Arguments (Section 21) */}
            <div className="pt-2 border-t border-slate-800/60">
              <span className="text-amber-400 font-bold block mb-1">
                🛡️ CONTRARIAN ANALYSIS (Why Could This Be Wrong?):
              </span>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                {response.counterarguments.map((arg, idx) => (
                  <li key={idx}>{arg}</li>
                ))}
              </ul>
            </div>

            {/* Invalidation Conditions */}
            <div className="pt-2 border-t border-slate-800/60">
              <span className="text-rose-400 font-bold block mb-1">
                ❌ THESIS INVALIDATION THRESHOLDS:
              </span>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                {response.invalidation.map((inv, idx) => (
                  <li key={idx}>{inv}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
