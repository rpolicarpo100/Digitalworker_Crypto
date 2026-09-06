interface ProviderStats {
  totalRequests: number;
  successRequests: number;
  failedRequests: number;
  lastRequestTime?: string;
  dailyCount: number;
  resetDate: string;
}

class ApiGovernor {
  private stats: Map<string, ProviderStats> = new Map();

  private getTodayDateString(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private initProvider(provider: string): ProviderStats {
    const today = this.getTodayDateString();
    let s = this.stats.get(provider);
    if (!s) {
      s = {
        totalRequests: 0,
        successRequests: 0,
        failedRequests: 0,
        dailyCount: 0,
        resetDate: today,
      };
      this.stats.set(provider, s);
    } else if (s.resetDate !== today) {
      s.dailyCount = 0;
      s.resetDate = today;
    }
    return s;
  }

  recordCall(provider: string, success: boolean): void {
    const s = this.initProvider(provider);
    s.totalRequests++;
    s.dailyCount++;
    s.lastRequestTime = new Date().toISOString();
    if (success) {
      s.successRequests++;
    } else {
      s.failedRequests++;
    }
  }

  getStats() {
    const result: Record<string, ProviderStats> = {};
    for (const [provider] of this.stats.entries()) {
      result[provider] = this.initProvider(provider);
    }
    return result;
  }
}

export const apiGovernor = new ApiGovernor();
