import { NextResponse } from "next/server";
import { providerManager } from "@/lib/providers/manager";
import { cacheManager } from "@/lib/cache/manager";
import { apiGovernor } from "@/lib/providers/governor";
import { isSupabaseConfigured } from "@/lib/db/supabase";

export async function GET() {
  const startTime = Date.now();
  const providersHealth = await providerManager.healthCheckAll();

  const isAnyOnline = providersHealth.some((p) => p.status === "ONLINE");
  const isAllOnline = providersHealth.every((p) => p.status === "ONLINE" || p.provider === "alchemy" || p.provider === "dune");

  const systemStatus = isAllOnline ? "ONLINE" : isAnyOnline ? "DEGRADED" : "OFFLINE";

  return NextResponse.json(
    {
      status: systemStatus,
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - startTime,
      providers: providersHealth,
      system: {
        cache: cacheManager.getStats(),
        governor: apiGovernor.getStats(),
      },
      env: {
        supabaseConfigured: isSupabaseConfigured(),
      },
    },
    {
      status: systemStatus === "OFFLINE" ? 503 : 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Request-Id": `req_${Math.random().toString(36).slice(2, 10)}`,
      },
    }
  );
}
