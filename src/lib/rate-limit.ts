import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const WINDOW_SIZE = 60;
const MAX_REQUESTS = 5;
const KEY_PREFIX = "prontu:ratelimit:";

export const verificarRateLimit = async (identifier: string): Promise<{
  permitido: boolean;
  restantes: number;
  reset: number;
}> => {
  const key = `${KEY_PREFIX}${identifier}`;
  const now = Date.now();
  const windowStart = now - WINDOW_SIZE * 1000;
  
  try {
    const pipeline = redis.pipeline();
    
    pipeline.zremrangebyscore(key, 0, windowStart);
    pipeline.zcard(key);
    pipeline.zadd(key, now, `${now}-${Math.random()}`);
    pipeline.expire(key, WINDOW_SIZE);
    
    const results = await pipeline.exec();
    const count = results?.[1]?.[1] as number || 0;
    
    const remaining = Math.max(0, MAX_REQUESTS - count);
    const reset = Math.ceil((now + WINDOW_SIZE * 1000) / 1000);
    
    if (count > MAX_REQUESTS) {
      return {
        permitido: false,
        restantes: 0,
        reset,
      };
    }
    
    return {
      permitido: true,
      restantes: remaining,
      reset,
    };
  } catch (error) {
    console.error("Erro no rate limit Redis:", error);
    return {
      permitido: true,
      restantes: MAX_REQUESTS,
      reset: Math.ceil((Date.now() + WINDOW_SIZE * 1000) / 1000),
    };
  }
};