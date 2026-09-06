export interface VirtualPosition {
  id: string;
  symbol: string;
  quantity: number;
  entryPriceUsd: number;
  currentPriceUsd: number;
  unrealizedPnlUsd: number;
  unrealizedPnlPercent: number;
  timestamp: string;
}

export interface VirtualTrade {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number;
  fillPriceUsd: number;
  feeUsd: number;
  realizedPnlUsd: number;
  isPaper: true;
  timestamp: string;
}

export interface VirtualPortfolio {
  initialBalanceUsd: number;
  cashBalanceUsd: number;
  equityUsd: number;
  totalPnlUsd: number;
  roiPercent: number;
  winRatePercent: number;
  profitFactor: number;
  maxDrawdownPercent: number;
  sharpeRatio: number;
  positions: VirtualPosition[];
  tradesHistory: VirtualTrade[];
}

export class PaperTradingEngine {
  private portfolio: VirtualPortfolio;

  constructor(initialBalanceUsd = 10000) {
    this.portfolio = {
      initialBalanceUsd,
      cashBalanceUsd: initialBalanceUsd,
      equityUsd: initialBalanceUsd,
      totalPnlUsd: 0,
      roiPercent: 0,
      winRatePercent: 0,
      profitFactor: 0,
      maxDrawdownPercent: 0,
      sharpeRatio: 0,
      positions: [],
      tradesHistory: [],
    };
  }

  executePaperOrder(
    symbol: string,
    side: "BUY" | "SELL",
    usdAmount: number,
    marketPriceUsd: number,
    slippagePercent = 0.1,
    closeEntirePosition = false
  ): { success: boolean; trade?: VirtualTrade; message: string } {
    if (usdAmount <= 0 || marketPriceUsd <= 0) {
      return { success: false, message: "Invalid order amount or price" };
    }

    const fillPrice = side === "BUY" ? marketPriceUsd * (1 + slippagePercent / 100) : marketPriceUsd * (1 - slippagePercent / 100);

    if (side === "BUY") {
      const feeUsd = usdAmount * 0.001; // 0.1% paper trading fee
      const quantity = usdAmount / fillPrice;

      if (this.portfolio.cashBalanceUsd < usdAmount + feeUsd) {
        return { success: false, message: "Insufficient paper cash balance" };
      }

      this.portfolio.cashBalanceUsd -= usdAmount + feeUsd;
      const existingPos = this.portfolio.positions.find((p) => p.symbol === symbol);

      if (existingPos) {
        const newQty = existingPos.quantity + quantity;
        const newEntry = (existingPos.quantity * existingPos.entryPriceUsd + quantity * fillPrice) / newQty;
        existingPos.quantity = newQty;
        existingPos.entryPriceUsd = newEntry;
      } else {
        this.portfolio.positions.push({
          id: `pos_${symbol}_${Date.now()}`,
          symbol,
          quantity,
          entryPriceUsd: fillPrice,
          currentPriceUsd: marketPriceUsd,
          unrealizedPnlUsd: 0,
          unrealizedPnlPercent: 0,
          timestamp: new Date().toISOString(),
        });
      }

      const trade: VirtualTrade = {
        id: `trade_${Date.now()}`,
        symbol,
        side: "BUY",
        quantity,
        fillPriceUsd: fillPrice,
        feeUsd,
        realizedPnlUsd: 0,
        isPaper: true,
        timestamp: new Date().toISOString(),
      };

      this.portfolio.tradesHistory.push(trade);
      this.recalculatePortfolio();
      return { success: true, trade, message: "Paper BUY order executed successfully" };
    } else {
      // SELL
      const posIdx = this.portfolio.positions.findIndex((p) => p.symbol === symbol);
      if (posIdx === -1) {
        return { success: false, message: `No active paper position for ${symbol}` };
      }

      const pos = this.portfolio.positions[posIdx];
      const sellQty = closeEntirePosition ? pos.quantity : Math.min(pos.quantity, usdAmount / fillPrice);
      const grossProceeds = sellQty * fillPrice;
      const feeUsd = grossProceeds * 0.001;
      const costBasis = sellQty * pos.entryPriceUsd;
      const realizedPnlUsd = grossProceeds - costBasis - feeUsd;

      this.portfolio.cashBalanceUsd += grossProceeds - feeUsd;
      pos.quantity -= sellQty;

      if (pos.quantity <= 0.000001 || closeEntirePosition) {
        this.portfolio.positions.splice(posIdx, 1);
      }

      const trade: VirtualTrade = {
        id: `trade_${Date.now()}`,
        symbol,
        side: "SELL",
        quantity: sellQty,
        fillPriceUsd: fillPrice,
        feeUsd,
        realizedPnlUsd,
        isPaper: true,
        timestamp: new Date().toISOString(),
      };

      this.portfolio.tradesHistory.push(trade);
      this.recalculatePortfolio();
      return { success: true, trade, message: "Paper SELL order executed successfully" };
    }
  }

  private recalculatePortfolio() {
    let positionsValue = 0;
    for (const pos of this.portfolio.positions) {
      pos.unrealizedPnlUsd = (pos.currentPriceUsd - pos.entryPriceUsd) * pos.quantity;
      pos.unrealizedPnlPercent = pos.entryPriceUsd > 0 ? ((pos.currentPriceUsd - pos.entryPriceUsd) / pos.entryPriceUsd) * 100 : 0;
      positionsValue += pos.quantity * pos.currentPriceUsd;
    }

    this.portfolio.equityUsd = this.portfolio.cashBalanceUsd + positionsValue;
    this.portfolio.totalPnlUsd = this.portfolio.equityUsd - this.portfolio.initialBalanceUsd;
    this.portfolio.roiPercent = (this.portfolio.totalPnlUsd / this.portfolio.initialBalanceUsd) * 100;

    const closedTrades = this.portfolio.tradesHistory.filter((t) => t.side === "SELL");
    if (closedTrades.length > 0) {
      const winning = closedTrades.filter((t) => t.realizedPnlUsd > 0);
      this.portfolio.winRatePercent = (winning.length / closedTrades.length) * 100;

      const grossProfit = winning.reduce((s, t) => s + t.realizedPnlUsd, 0);
      const grossLoss = Math.abs(closedTrades.filter((t) => t.realizedPnlUsd < 0).reduce((s, t) => s + t.realizedPnlUsd, 0));
      this.portfolio.profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 99 : 0;
    }
  }

  getPortfolio(): VirtualPortfolio {
    this.recalculatePortfolio();
    return this.portfolio;
  }
}

export const paperTradingEngine = new PaperTradingEngine();
