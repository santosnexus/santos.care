type LogLevel = "info" | "warn" | "error" | "debug";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) || (process.env.NODE_ENV === "production" ? "info" : "debug");

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function sanitizeForProduction(data: any): any {
  if (process.env.NODE_ENV !== "production") return data;
  if (typeof data === "string") return "[string]";
  if (typeof data === "object" && data !== null) return "[object]";
  return data;
}

export const logger = {
  info: (message: string, ...args: any[]) => {
    if (!shouldLog("info")) return;
    console.log(JSON.stringify({ level: "info", message, timestamp: new Date().toISOString() }));
  },
  warn: (message: string, ...args: any[]) => {
    if (!shouldLog("warn")) return;
    console.warn(JSON.stringify({ level: "warn", message, timestamp: new Date().toISOString() }));
  },
  error: (message: string, error?: unknown) => {
    if (!shouldLog("error")) return;
    const errorInfo = error instanceof Error
      ? { name: error.name, message: error.message }
      : { value: sanitizeForProduction(error) };
    console.error(JSON.stringify({ level: "error", message, ...errorInfo, timestamp: new Date().toISOString() }));
  },
  debug: (message: string, ...args: any[]) => {
    if (!shouldLog("debug")) return;
    console.debug(JSON.stringify({ level: "debug", message, timestamp: new Date().toISOString() }));
  },
};
