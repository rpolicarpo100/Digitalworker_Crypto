export interface ExecutionSafetyStatus {
  isEmergencyStopActive: boolean;
  isLiveTradingEnabled: boolean;
  userConsentGranted: boolean;
  dailyLossUsd: number;
  dailyLossLimitUsd: number;
  maxPositionSizeUsd: number;
  maxPortfolioExposureUsd: number;
  maxAllowedSlippagePercent: number;
  maxAllowedGasGwei: number;
  safetyFlags: string[];
  timestamp: string;
}

export class ExecutionSafetyEngine {
  private isEmergencyStopActive = false;
  private userConsentGranted = false;
  private dailyLossUsd = 0;
  private dailyLossLimitUsd = 500; // $500 max daily loss safety cap
  private maxPositionSizeUsd = 2000; // $2,000 max single order cap
  private maxPortfolioExposureUsd = 10000; // $10,000 max total exposure
  private maxAllowedSlippagePercent = 1.0; // 1% max slippage
  private maxAllowedGasGwei = 100; // 100 Gwei max gas price

  activateEmergencyStop(reason = "User initiated emergency stop"): ExecutionSafetyStatus {
    this.isEmergencyStopActive = true;
    return this.getStatus([`EMERGENCY_STOP_ACTIVATED: ${reason}`]);
  }

  deactivateEmergencyStop(): ExecutionSafetyStatus {
    this.isEmergencyStopActive = false;
    return this.getStatus();
  }

  grantUserConsent(consentToken: string): boolean {
    if (consentToken && consentToken.length >= 16) {
      this.userConsentGranted = true;
      return true;
    }
    return false;
  }

  revokeUserConsent(): void {
    this.userConsentGranted = false;
  }

  validateLiveTradeExecution(
    orderUsdAmount: number,
    slippagePercent: number,
    gasGwei = 20
  ): { canExecute: boolean; rejectionReason?: string } {
    if (this.isEmergencyStopActive) {
      return { canExecute: false, rejectionReason: "Execution REJECTED: Global Emergency Kill Switch is ACTIVE" };
    }

    if (!this.userConsentGranted) {
      return { canExecute: false, rejectionReason: "Execution REJECTED: Explicit user consent token not granted" };
    }

    if (this.dailyLossUsd >= this.dailyLossLimitUsd) {
      return { canExecute: false, rejectionReason: `Execution REJECTED: Daily loss limit exceeded ($${this.dailyLossUsd} / $${this.dailyLossLimitUsd})` };
    }

    if (orderUsdAmount > this.maxPositionSizeUsd) {
      return { canExecute: false, rejectionReason: `Execution REJECTED: Order size ($${orderUsdAmount}) exceeds max position size limit ($${this.maxPositionSizeUsd})` };
    }

    if (slippagePercent > this.maxAllowedSlippagePercent) {
      return { canExecute: false, rejectionReason: `Execution REJECTED: Order slippage (${slippagePercent}%) exceeds max allowed slippage (${this.maxAllowedSlippagePercent}%)` };
    }

    if (gasGwei > this.maxAllowedGasGwei) {
      return { canExecute: false, rejectionReason: `Execution REJECTED: Gas price (${gasGwei} Gwei) exceeds max allowed gas (${this.maxAllowedGasGwei} Gwei)` };
    }

    return { canExecute: true };
  }

  recordTradeLoss(lossUsd: number): void {
    if (lossUsd > 0) {
      this.dailyLossUsd += lossUsd;
    }
  }

  resetDailyLoss(): void {
    this.dailyLossUsd = 0;
  }

  getStatus(extraFlags: string[] = []): ExecutionSafetyStatus {
    const safetyFlags: string[] = [...extraFlags];

    if (this.isEmergencyStopActive) safetyFlags.push("EMERGENCY_STOP_ACTIVE");
    if (!this.userConsentGranted) safetyFlags.push("USER_CONSENT_MISSING");
    if (this.dailyLossUsd >= this.dailyLossLimitUsd) safetyFlags.push("DAILY_LOSS_LIMIT_REACHED");

    return {
      isEmergencyStopActive: this.isEmergencyStopActive,
      isLiveTradingEnabled: false, // ALWAYS LOCKED FOR SAFETY
      userConsentGranted: this.userConsentGranted,
      dailyLossUsd: this.dailyLossUsd,
      dailyLossLimitUsd: this.dailyLossLimitUsd,
      maxPositionSizeUsd: this.maxPositionSizeUsd,
      maxPortfolioExposureUsd: this.maxPortfolioExposureUsd,
      maxAllowedSlippagePercent: this.maxAllowedSlippagePercent,
      maxAllowedGasGwei: this.maxAllowedGasGwei,
      safetyFlags,
      timestamp: new Date().toISOString(),
    };
  }
}

export const executionSafetyEngine = new ExecutionSafetyEngine();
