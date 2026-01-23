interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();
let lastCleanup = Date.now();

// Lazy cleanup: remove expired entries when store gets large
function cleanupIfNeeded() {
  const now = Date.now();
  if (store.size > 1000 || now - lastCleanup > 60_000) {
    for (const [key, entry] of store) {
      if (now > entry.resetAt) {
        store.delete(key);
      }
    }
    lastCleanup = now;
  }
}

interface RateLimitOptions {
  /** Max requests allowed in the window */
  limit: number;
  /** Window size in seconds */
  windowSeconds: number;
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions
): { success: boolean; remaining: number } {
  cleanupIfNeeded();
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetAt) {
    store.set(identifier, {
      count: 1,
      resetAt: now + options.windowSeconds * 1000,
    });
    return { success: true, remaining: options.limit - 1 };
  }

  if (entry.count >= options.limit) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: options.limit - entry.count };
}

export function getRateLimitIdentifier(request: Request): string {
  // Use x-forwarded-for (set by reverse proxy/CDN) or x-real-ip
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
  return ip;
}
