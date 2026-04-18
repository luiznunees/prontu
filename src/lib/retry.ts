interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: any) => boolean;
  onRetry?: (attempt: number, error: any, delayMs: number) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  shouldRetry: () => true,
  onRetry: () => {},
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      if (attempt === opts.maxRetries) {
        break;
      }

      if (!opts.shouldRetry(error)) {
        throw error;
      }

      const delayMs = Math.min(
        opts.initialDelayMs * Math.pow(opts.backoffMultiplier, attempt),
        opts.maxDelayMs
      );

      opts.onRetry(attempt + 1, error, delayMs);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}

export function isRetryableError(error: any): boolean {
  const message = error?.message?.toLowerCase() || "";
  const status = error?.status || error?.code;

  return (
    message.includes("rate limit") ||
    message.includes("429") ||
    message.includes("503") ||
    message.includes("timeout") ||
    message.includes("network") ||
    message.includes("etimedout") ||
    message.includes("high demand") ||
    message.includes("temporarily unavailable") ||
    status === 429 ||
    status === 503 ||
    status === "ETIMEDOUT"
  );
}

export function isGeminiOverloadError(error: any): boolean {
  const message = error?.message?.toLowerCase() || "";
  return (
    message.includes("high demand") ||
    message.includes("temporarily unavailable") ||
    message.includes("503") ||
    error?.status === 503
  );
}