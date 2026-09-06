import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_APP_NAME: z.string().default("GOD"),
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
  
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Providers
  COINGECKO_API_URL: z.string().default("https://api.coingecko.com/api/v3"),
  COINGECKO_API_KEY: z.string().optional(),
  BINANCE_API_URL: z.string().default("https://api.binance.com"),
  DEXSCREENER_API_URL: z.string().default("https://api.dexscreener.com"),
  FEAR_GREED_API_URL: z.string().default("https://api.alternative.me"),
  ALCHEMY_API_KEY: z.string().optional(),
  DUNE_API_KEY: z.string().optional(),

  // Feature Flags
  ENABLE_DEX: z.string().default("true").transform((v) => v === "true"),
  ENABLE_ARBITRAGE: z.string().default("true").transform((v) => v === "true"),
  ENABLE_PAPER_TRADING: z.string().default("true").transform((v) => v === "true"),
  ENABLE_LIVE_TRADING: z.string().default("false").transform((v) => v === "true"),

  // Rate Limits
  RATE_LIMIT_COINGECKO_RPM: z.string().default("10").transform((v) => parseInt(v, 10)),
  RATE_LIMIT_BINANCE_RPM: z.string().default("1200").transform((v) => parseInt(v, 10)),
  RATE_LIMIT_DEXSCREENER_RPM: z.string().default("60").transform((v) => parseInt(v, 10)),
});

export const env = envSchema.parse(process.env);
