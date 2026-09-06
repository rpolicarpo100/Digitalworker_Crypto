import { NextResponse } from "next/server";
import { executionSafetyEngine } from "@/lib/engine/execution-safety";

export async function GET() {
  return NextResponse.json(executionSafetyEngine.getStatus());
}
