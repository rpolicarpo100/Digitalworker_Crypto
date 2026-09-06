type LogLevel = "debug" | "info" | "warn" | "error";

interface LogPayload {
  level: LogLevel;
  message: string;
  service?: string;
  requestId?: string;
  provider?: string;
  latencyMs?: number;
  error?: string | Error;
  data?: Record<string, unknown>;
  timestamp: string;
}

const REDACT_KEYS = ["apiKey", "key", "secret", "password", "privateKey", "token", "authorization"];

function redact(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (REDACT_KEYS.some((k) => key.toLowerCase().includes(k.toLowerCase()))) {
      result[key] = "[REDACTED]";
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = redact(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  return result;
}

export const logger = {
  info(message: string, meta: Omit<LogPayload, "level" | "message" | "timestamp"> = {}) {
    this.log("info", message, meta);
  },
  warn(message: string, meta: Omit<LogPayload, "level" | "message" | "timestamp"> = {}) {
    this.log("warn", message, meta);
  },
  error(message: string, meta: Omit<LogPayload, "level" | "message" | "timestamp"> = {}) {
    this.log("error", message, meta);
  },
  debug(message: string, meta: Omit<LogPayload, "level" | "message" | "timestamp"> = {}) {
    if (process.env.NODE_ENV !== "production") {
      this.log("debug", message, meta);
    }
  },
  log(level: LogLevel, message: string, meta: Omit<LogPayload, "level" | "message" | "timestamp"> = {}) {
    const payload: LogPayload = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...meta,
      ...(meta.data ? { data: redact(meta.data) } : {}),
      ...(meta.error instanceof Error ? { error: meta.error.message } : {}),
    };
    const formatted = JSON.stringify(payload);
    if (level === "error") {
      console.error(formatted);
    } else if (level === "warn") {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }
  },
};
