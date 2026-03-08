import { RateLimiterStratergy } from "../interface/rate-limiter-stratergy";

interface BucketState {
  lastRefillTime: number;
  tokens: number;
}
export class TokenBucketStratergy implements RateLimiterStratergy {
  private maxBucketSize: number;
  private refillRateInSec: number;
  private buckets: Map<string, BucketState>;
  constructor(maxBucketSize: number, refillRateInSec: number) {
    this.maxBucketSize = maxBucketSize;
    this.refillRateInSec = refillRateInSec;
    this.buckets = new Map<string, BucketState>();
  }

  allowRequest(entityId: string, timestamp: number): boolean {
    const metaData = this.buckets.get(entityId);
    if (!metaData) {
      // new Request
      this.buckets.set(entityId, {
        lastRefillTime: timestamp,
        tokens: this.maxBucketSize - 1,
      });
      return true;
    }
    const updatedTokenCount = this.refillTokens(
      metaData.tokens,
      metaData.lastRefillTime,
      timestamp,
    );

    metaData.lastRefillTime = timestamp;
    metaData.tokens = updatedTokenCount;

    if (metaData.tokens >= 1) {
      metaData.tokens -= 1;
      this.buckets.set(entityId, metaData);
      return true;
    }

    this.buckets.set(entityId, metaData);
    return false;
  }

  private refillTokens(
    currentTokenCount: number,
    lastRefillTime: number,
    currentTimestamp: number,
  ) {
    const diffInMS = currentTimestamp - lastRefillTime;
    const earnedTokens = diffInMS / (this.refillRateInSec * 1000);
    const updatedTokenCount = Math.min(
      this.maxBucketSize,
      earnedTokens + currentTokenCount,
    );

    return updatedTokenCount;
  }
}
