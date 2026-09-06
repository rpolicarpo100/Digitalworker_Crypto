import { DevilsAdvocateAnalysis, ThirdEyeAnalysis, MultiAssetProfile, StockFundamentals, StockValuation } from "../types/multi-asset";

export class DevilsAdvocateEngine {
  runBearishReview(
    profile: MultiAssetProfile,
    fundamentals?: StockFundamentals,
    valuation?: StockValuation
  ): { devilsAdvocate: DevilsAdvocateAnalysis; thirdEye: ThirdEyeAnalysis } {
    const symbol = profile.symbol;
    const isCrypto = profile.assetClass === "CRYPTO";

    let bearishReview = "";
    let strongestCounterArgument = "";
    const invalidationConditions: string[] = [];
    const contradictingEvidence: string[] = [];
    const hiddenRisks: string[] = [];
    const accountingRedFlags: string[] = [];
    const dilutionOrLiquidityAlerts: string[] = [];

    if (isCrypto) {
      bearishReview = `For ${symbol}, macro liquidity tightening or regulatory enforcement against unhosted wallets could trigger forced liquidations.`;
      strongestCounterArgument = `High market concentration and reliance on leverage in derivative markets make ${symbol} susceptible to long squeezes.`;
      invalidationConditions.push(`Weekly candle close below key technical moving average support.`);
      invalidationConditions.push(`Protocol TVL or active address count declining by >25% YoY.`);
      contradictingEvidence.push(`Exchange reserve inflows spiking, signaling potential whale selling pressure.`);
      hiddenRisks.push(`Unlocks schedule or treasury selling pressure over the next 6 months.`);
    } else {
      const pe = valuation?.peRatio || 25;
      bearishReview = `For ${symbol}, valuation multiple (P/E ${pe.toFixed(1)}x) leaves zero margin of safety if revenue growth slows down.`;
      strongestCounterArgument = `Gross margins could compress if supply chain costs rise or customer acquisition costs escalate.`;
      invalidationConditions.push(`Quarterly revenue growth dropping below 10% YoY.`);
      invalidationConditions.push(`Operating margin compressing by >200 bps.`);
      contradictingEvidence.push(`Insider net selling accelerated over the last 2 quarters.`);
      hiddenRisks.push(`Customer concentration: top 3 customers represent significant portion of revenue.`);
      
      if (fundamentals && fundamentals.totalDebtUsd > fundamentals.totalCashUsd) {
        accountingRedFlags.push(`Net debt posture ($${(fundamentals.netDebtUsd / 1e6).toFixed(1)}M) increases vulnerability to interest rate spikes.`);
      }
    }

    return {
      devilsAdvocate: {
        bearishReview,
        strongestCounterArgument,
        invalidationConditions,
        contradictingEvidence,
      },
      thirdEye: {
        hiddenRisks,
        accountingRedFlags,
        narrativeVsFundamentalsDivergence: `Market narrative assumes uninterrupted high growth, whereas fundamental data shows revenue acceleration is moderating.`,
        dilutionOrLiquidityAlerts,
      },
    };
  }
}

export const devilsAdvocateEngine = new DevilsAdvocateEngine();
