export interface RateLimiterStratergy {
  allowRequest(entityId: string, timestamp: number): boolean;
}
