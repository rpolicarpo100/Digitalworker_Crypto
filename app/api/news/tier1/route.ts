import { NextResponse } from "next/server";
import { tier1NewsEngine } from "@/lib/engines/tier1-news-engine";

export async function GET() {
  const news = tier1NewsEngine.getLatestNews();
  return NextResponse.json({
    status: "SUCCESS",
    count: news.length,
    news,
    timestamp: new Date().toISOString(),
  });
}
