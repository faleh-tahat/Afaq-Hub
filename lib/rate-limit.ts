// Fixed-window rate limiter.
//
// With UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN set (Upstash free
// tier is enough), counters are shared by every server instance. Without them,
// or if Redis is unreachable, each instance counts in its own memory, which
// still stops a single client hammering one instance.

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

const MAX_MEMORY_KEYS = 10_000;
const memory = new Map<string, { count: number; resetAt: number }>();

function memoryHit(key: string, windowMs: number, now: number) {
  let entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    // Bound memory under a flood of unique keys: drop expired entries first,
    // then the oldest, so the limiter itself cannot be used to exhaust RAM.
    if (memory.size >= MAX_MEMORY_KEYS) {
      memory.forEach((e, k) => {
        if (e.resetAt <= now) memory.delete(k);
      });
      if (memory.size >= MAX_MEMORY_KEYS) {
        const oldest = memory.keys().next().value;
        if (oldest !== undefined) memory.delete(oldest);
      }
    }
    entry = { count: 0, resetAt: now + windowMs };
    memory.set(key, entry);
  }
  entry.count += 1;
  return entry;
}

async function redisHit(key: string, windowMs: number, now: number) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([
        ['INCR', key],
        ['PEXPIRE', key, String(windowMs), 'NX'],
        ['PTTL', key],
      ]),
      cache: 'no-store',
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return null;
    const [incr, , pttl] = (await res.json()) as { result: number }[];
    const ttl = pttl.result > 0 ? pttl.result : windowMs;
    return { count: incr.result, resetAt: now + ttl };
  } catch {
    return null;
  }
}

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const entry = (await redisHit(`rl:${key}`, windowMs, now)) ?? memoryHit(key, windowMs, now);
  return {
    allowed: entry.count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}

// Test helper.
export function resetRateLimits(): void {
  memory.clear();
}
