/**
 * GOD — Proxy (Middleware replacement for Next.js 16.3+)
 * Security headers, CSP, auth placeholder
 * 
 * Next.js 16.3 deprecates middleware.ts in favor of proxy.ts
 * This file replaces middleware.ts per codemod
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers — OWASP baseline
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  
  // CSP — basic, allow self, unsafe-inline for Next.js, and external APIs
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.binance.com https://data-api.binance.vision https://api.coingecko.com https://api.dexscreener.com https://api.geckoterminal.com https://api.alternative.me https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
  ].join("; ");
  
  response.headers.set("Content-Security-Policy", csp);

  // Request ID
  const requestId = request.headers.get("x-request-id") || `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  response.headers.set("X-Request-Id", requestId);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
