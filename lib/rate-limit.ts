/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window counter approach.
 *
 * NOT suitable for multi-instance deployments (use Redis instead).
 * For single-server / hobby deploys this is production-ready.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key)
    }
  }
}, 5 * 60 * 1000)

interface RateLimitOptions {
  /** Maximum number of requests in the window. Default: 10 */
  limit?: number
  /** Window duration in seconds. Default: 60 */
  windowSeconds?: number
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetAt: number
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const { limit = 10, windowSeconds = 60 } = options
  const now = Date.now()
  const windowMs = windowSeconds * 1000

  const entry = store.get(identifier)

  if (!entry || now > entry.resetAt) {
    // First request or window expired
    store.set(identifier, { count: 1, resetAt: now + windowMs })
    return { success: true, limit, remaining: limit - 1, resetAt: now + windowMs }
  }

  if (entry.count >= limit) {
    return { success: false, limit, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { success: true, limit, remaining: limit - entry.count, resetAt: entry.resetAt }
}
