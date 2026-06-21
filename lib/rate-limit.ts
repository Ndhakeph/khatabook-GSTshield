/**
 * Tiny in-memory, per-IP sliding-window rate limiter.
 *
 * This is a best-effort abuse guard for a public demo — state lives in the
 * process and resets on cold starts, which is acceptable here. It is not a
 * distributed limiter.
 */

const HOUR_MS = 60 * 60 * 1000;
const store = new Map<string, number[]>();

export interface RateLimitResult {
    allowed: boolean;
    limit: number;
    remaining: number;
    retryAfterSeconds: number;
}

export function rateLimit(key: string, limit = 10, windowMs: number = HOUR_MS): RateLimitResult {
    const now = Date.now();
    const windowStart = now - windowMs;

    const hits = (store.get(key) ?? []).filter((t) => t > windowStart);

    if (hits.length >= limit) {
        store.set(key, hits);
        const retryAfterSeconds = Math.max(1, Math.ceil((hits[0] + windowMs - now) / 1000));
        return { allowed: false, limit, remaining: 0, retryAfterSeconds };
    }

    hits.push(now);
    store.set(key, hits);
    return { allowed: true, limit, remaining: limit - hits.length, retryAfterSeconds: 0 };
}

/** Extract the client IP from standard proxy headers (Vercel sets these). */
export function getClientIp(req: Request): string {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    return req.headers.get('x-real-ip') ?? 'unknown';
}
