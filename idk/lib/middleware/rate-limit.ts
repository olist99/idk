import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../auth/prisma';

// In-memory rate limiters for different endpoints
const rateLimiters = {
  auth: new RateLimiterMemory({
    points: 5, // 5 requests
    duration: 60 * 15, // per 15 minutes
    blockDuration: 60 * 15, // block for 15 minutes
  }),
  api: new RateLimiterMemory({
    points: 100, // 100 requests
    duration: 60 * 15, // per 15 minutes
  }),
  upload: new RateLimiterMemory({
    points: 10, // 10 uploads
    duration: 60 * 60, // per hour
  }),
  message: new RateLimiterMemory({
    points: 50, // 50 messages
    duration: 60 * 60, // per hour
  }),
  match: new RateLimiterMemory({
    points: 100, // 100 swipes
    duration: 60 * 60, // per hour
  }),
};

/**
 * Get identifier for rate limiting (IP or user ID)
 */
function getIdentifier(req: NextRequest, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }
  
  const ip = req.headers.get('x-forwarded-for') ||
             req.headers.get('x-real-ip') ||
             req.ip ||
             'unknown';
  
  return `ip:${ip}`;
}

/**
 * Rate limit middleware
 */
export async function rateLimit(
  req: NextRequest,
  type: keyof typeof rateLimiters = 'api',
  userId?: string
): Promise<{ success: boolean; error?: string; retryAfter?: number }> {
  const identifier = getIdentifier(req, userId);
  const limiter = rateLimiters[type];
  
  try {
    await limiter.consume(identifier);
    return { success: true };
  } catch (rateLimiterRes) {
    const res = rateLimiterRes as RateLimiterRes;
    const retryAfter = Math.ceil(res.msBeforeNext / 1000);
    
    // Log rate limit hit
    await prisma.rateLimit.upsert({
      where: {
        identifier_endpoint_windowStart: {
          identifier,
          endpoint: type,
          windowStart: new Date(Date.now() - (Date.now() % (15 * 60 * 1000))),
        },
      },
      create: {
        identifier,
        endpoint: type,
        requests: 1,
        windowStart: new Date(Date.now() - (Date.now() % (15 * 60 * 1000))),
      },
      update: {
        requests: {
          increment: 1,
        },
      },
    });
    
    return {
      success: false,
      error: 'Too many requests. Please try again later.',
      retryAfter,
    };
  }
}

/**
 * Check if IP is blocked
 */
export async function isIpBlocked(ip: string): Promise<boolean> {
  // Check for repeated abuse
  const recentViolations = await prisma.rateLimit.count({
    where: {
      identifier: `ip:${ip}`,
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      requests: {
        gte: 1000, // Very high request count
      },
    },
  });
  
  return recentViolations > 5;
}

/**
 * Apply rate limit to API route
 */
export async function withRateLimit(
  req: NextRequest,
  handler: () => Promise<NextResponse>,
  type: keyof typeof rateLimiters = 'api',
  userId?: string
): Promise<NextResponse> {
  const result = await rateLimit(req, type, userId);
  
  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      {
        status: 429,
        headers: {
          'Retry-After': result.retryAfter?.toString() || '60',
          'X-RateLimit-Limit': rateLimiters[type].points.toString(),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }
  
  return handler();
}

/**
 * Clean old rate limit records
 */
export async function cleanOldRateLimits(): Promise<void> {
  const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days
  
  await prisma.rateLimit.deleteMany({
    where: {
      createdAt: {
        lt: cutoffDate,
      },
    },
  });
}

/**
 * Get rate limit status
 */
export async function getRateLimitStatus(
  identifier: string,
  type: keyof typeof rateLimiters
): Promise<{
  limit: number;
  remaining: number;
  resetAt: Date;
}> {
  const limiter = rateLimiters[type];
  
  try {
    const res = await limiter.get(identifier);
    
    return {
      limit: limiter.points,
      remaining: res ? limiter.points - res.consumedPoints : limiter.points,
      resetAt: new Date(Date.now() + (res?.msBeforeNext || limiter.duration * 1000)),
    };
  } catch (error) {
    return {
      limit: limiter.points,
      remaining: limiter.points,
      resetAt: new Date(Date.now() + limiter.duration * 1000),
    };
  }
}
