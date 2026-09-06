import { NextResponse } from "next/server";
import { stressTestEngine } from "@/lib/engines/stress-test-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = stressTestEngine.runStressTest(
      body?.initialPortfolioUsd,
      body?.cryptoAllocationPercent,
      body?.stockAllocationPercent,
      body?.cashAllocationPercent
    );
    return NextResponse.json(result);
  } catch {
    const result = stressTestEngine.runStressTest();
    return NextResponse.json(result);
  }
}
