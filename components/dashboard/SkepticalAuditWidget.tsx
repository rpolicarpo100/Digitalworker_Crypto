"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

export function SkepticalAuditWidget() {
  return (
    <Card className="bg-[#0b101e] border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span>🧐 Institutional Skepticism & Audit</span>
          <Badge variant="outline" className="text-[10px] border-emerald-500/50 text-emerald-400">
            0% MOCK DATA
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-xs">
        <div className="p-2 bg-[#060a14] rounded border border-slate-800/80 space-y-1.5 text-[11px]">
          <div className="flex items-start space-x-2">
            <span className="text-emerald-400 font-bold">✓</span>
            <p className="text-slate-300">
              <strong className="text-slate-100">Live API Verification:</strong> 100% of price data is directly fetched from Binance, DEX Screener, or CoinGecko with latency tracking.
            </p>
          </div>

          <div className="flex items-start space-x-2">
            <span className="text-emerald-400 font-bold">✓</span>
            <p className="text-slate-300">
              <strong className="text-slate-100">Net Edge Deductions:</strong> DEX Arbitrage scans enforce gas fee, DEX 0.3% protocol fee, and price impact penalties before flagging opportunities.
            </p>
          </div>

          <div className="flex items-start space-x-2">
            <span className="text-emerald-400 font-bold">✓</span>
            <p className="text-slate-300">
              <strong className="text-slate-100">Contrarian AI Veto:</strong> The AI Multi-Agent Copilot mandates a dedicated counterargument check to explicitly identify why a trade setup could fail.
            </p>
          </div>

          <div className="flex items-start space-x-2">
            <span className="text-amber-400 font-bold">!</span>
            <p className="text-slate-300">
              <strong className="text-slate-100">Liquidity Illusion Shield:</strong> Arbitrage spreads above 10% are automatically rejected if pool depth cannot support $500 orders without &gt;2% price slippage.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
