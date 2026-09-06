"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { mevSlippageEngine } from "@/lib/engines/mev-slippage-engine";

export function OrderImpactCalculator({ symbol = "BTC" }: { symbol?: string }) {
  const [tradeSize, setTradeSize] = useState<number>(1000);
  const [isDex, setIsDex] = useState<boolean>(true);
  const [chain, setChain] = useState<"ethereum" | "solana" | "bsc" | "arbitrum" | "cex">("ethereum");

  // Run MevSlippageEngine
  const sim = mevSlippageEngine.calculateRealisticExecution({
    tradeSizeUsd: tradeSize,
    liquidityDepthUsd: symbol === "BTC" || symbol === "ETH" ? 250000 : 35000,
    grossSpreadPercent: 1.8,
    blockchain: chain,
    isDex,
  });

  return (
    <Card className="bg-[#0b101e] border-slate-800">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold flex items-center space-x-2">
          <span>⚡ Realism Simulator: Price Impact & MEV Risk ({symbol})</span>
        </CardTitle>
        <Badge variant={sim.isExecutable ? "success" : "destructive"} className="text-[10px]">
          {sim.isExecutable ? "EXECUTE READY" : "REJECTED BY RISK"}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3 text-xs">
        {/* Trade Size Buttons */}
        <div>
          <span className="text-slate-400 block text-[10px] mb-1">Simulated Trade Size (USD):</span>
          <div className="grid grid-cols-4 gap-1.5">
            {[250, 1000, 5000, 25000].map((size) => (
              <Button
                key={size}
                variant={tradeSize === size ? "default" : "outline"}
                size="sm"
                onClick={() => setTradeSize(size)}
                className="text-[11px] h-7 font-mono"
              >
                ${size.toLocaleString()}
              </Button>
            ))}
          </div>
        </div>

        {/* Chain & Venue Selector */}
        <div className="flex items-center justify-between bg-[#060c18] p-2 rounded">
          <span className="text-slate-400 text-[10px]">Execution Venue:</span>
          <div className="flex space-x-1">
            {(["ethereum", "solana", "bsc", "cex"] as const).map((c) => (
              <button
                key={c}
                onClick={() => {
                  setChain(c);
                  setIsDex(c !== "cex");
                }}
                className={`px-2 py-0.5 text-[10px] rounded uppercase font-mono transition-colors ${
                  chain === c ? "bg-blue-600 text-white" : "bg-[#0b101e] text-slate-400 hover:text-slate-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Realistic Simulation Results Grid */}
        <div className="grid grid-cols-2 gap-2 font-mono">
          <div className="p-2 bg-[#080e1a] rounded border border-slate-800/80">
            <span className="text-slate-500 block text-[10px]">Price Impact:</span>
            <span className={sim.priceImpactPercent > 2 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
              {sim.priceImpactPercent.toFixed(2)}%
            </span>
          </div>

          <div className="p-2 bg-[#080e1a] rounded border border-slate-800/80">
            <span className="text-slate-500 block text-[10px]">MEV Threat Level:</span>
            <span className={sim.mevRiskScore > 50 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
              {sim.mevThreatLevel} ({sim.mevRiskScore}/100)
            </span>
          </div>

          <div className="p-2 bg-[#080e1a] rounded border border-slate-800/80">
            <span className="text-slate-500 block text-[10px]">Est. Gas & Slippage:</span>
            <span className="text-slate-200">
              ${sim.estimatedGasFeeUsd.toFixed(2)} ({sim.estimatedSlippagePercent.toFixed(2)}%)
            </span>
          </div>

          <div className="p-2 bg-[#080e1a] rounded border border-slate-800/80">
            <span className="text-slate-500 block text-[10px]">Realistic Net Edge:</span>
            <span className={sim.realisticNetProfitUsd > 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
              ${sim.realisticNetProfitUsd.toFixed(2)} ({sim.realisticNetEdgePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Warning / Rejection explanation */}
        {!sim.isExecutable && sim.rejectionReason && (
          <div className="p-2 bg-rose-950/40 border border-rose-800/60 rounded text-rose-300 text-[11px]">
            ⚠️ <strong>Skeptical Rejection:</strong> {sim.rejectionReason}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
