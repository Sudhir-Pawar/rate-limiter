import { RATE_LIMIT_ALGO_TYPE } from "../enums/rate-limit-algo-type";
import { RateLimiterStratergy } from "../interface/rate-limiter-stratergy";
import { FixedWindowCounterStratergy } from "../stratergy/fixed-window-counter-stratergy";
import { SlidingWindowCounterStratergy } from "../stratergy/sliding-window-counter-stratergy";
import { SlidingWindowLogStratergy } from "../stratergy/sliding-window-log-stratergy";
import { TokenBucketStratergy } from "../stratergy/token-bucket-stratergy";
import { TumblingWindowCounterStratergy } from "../stratergy/tumbling-window-counter-stratergy";

export class RateLimiterFactory {
  public static createRateLimiter(
    capacity: number,
    durationInMS: number,
    algoType: RATE_LIMIT_ALGO_TYPE,
  ): RateLimiterStratergy {
    switch (algoType) {
      case RATE_LIMIT_ALGO_TYPE.TOKEN_BUCKET:
        return new TokenBucketStratergy(capacity, durationInMS);
      case RATE_LIMIT_ALGO_TYPE.FIXED_WINDOW_COUNTER:
        return new FixedWindowCounterStratergy(capacity, durationInMS);
      case RATE_LIMIT_ALGO_TYPE.TUMBLING_WINDOW_COUNTER:
        return new TumblingWindowCounterStratergy(capacity, durationInMS);
      case RATE_LIMIT_ALGO_TYPE.SLIDING_WINDOW_LOG:
        return new SlidingWindowLogStratergy(capacity, durationInMS);
      case RATE_LIMIT_ALGO_TYPE.SLIDING_WINDOW_COUNTER:
        return new SlidingWindowCounterStratergy(capacity, durationInMS);
      default:
        throw new Error("Invalid RATE_LIMIT_ALGO_TYPE");
    }
  }
}
