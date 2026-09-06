"use client";

import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";

interface HealthData {
  status: string;
  providers: Array<{
    provider: string;
    status: string;
    latencyMs: number;
  }>;
}

export function SystemHealth() {
  const [health, setHealth] = useState<HealthData | null>(null);

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch("/api/health");
        if (res.ok) {
          const json = await res.json();
          setHealth(json);
        }
      } catch {
        // handle
      }
    }
    checkHealth();
  }, []);

  if (!health) return null;

  return (
    <div className="flex items-center space-x-2 text-xs text-slate-400">
      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span>System:</span>
      <Badge variant={health.status === "ONLINE" ? "success" : "warning"}>
        {health.status}
      </Badge>
    </div>
  );
}
