import { RATE_LIMIT_ALGO_TYPE } from "../enums/rate-limit-algo-type";
import { USER_TIER } from "../enums/user-type";
import { RateLimiterFactory } from "../factory/rate-limiter-factory";
import { RateLimiterStratergy } from "../interface/rate-limiter-stratergy";

export class RateLimiterService {
  private rateLimiters: Map<USER_TIER, RateLimiterStratergy[]>;

  constructor() {
    // here we would normally fetch rules set
    this.rateLimiters = new Map<USER_TIER, RateLimiterStratergy[]>();
    this.rateLimiters.set(USER_TIER.FREE, [
      RateLimiterFactory.createRateLimiter(
        10,
        60,
        RATE_LIMIT_ALGO_TYPE.TOKEN_BUCKET,
      ),
    ]);

    this.rateLimiters.set(USER_TIER.PREMIUM, [
      RateLimiterFactory.createRateLimiter(
        100,
        60,
        RATE_LIMIT_ALGO_TYPE.SLIDING_WINDOW_COUNTER,
      ),
    ]);
  }

  allowRequest(
    userTier: USER_TIER,
    entityId: string,
    timestamp: number,
  ): boolean {
    const limiters = this.rateLimiters.get(userTier);
    if (!limiters) {
      throw new Error(`Rate limiter not confgured for USER_TIER: ${userTier}`);
    }

    const result = limiters.every(function (limiter) {
      return limiter.allowRequest(entityId, timestamp);
    });

    return result;
  }
}
