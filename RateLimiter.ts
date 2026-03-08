import { RateLimiterService } from "./services/rate-limiter-service";
import { SimpleRequest } from "./SimpleRequest";

export class RateLimiter {
  private rateLimiterService: RateLimiterService;
  constructor() {
    this.rateLimiterService = new RateLimiterService();
  }
  allowRequest(request: SimpleRequest): boolean {
    return this.rateLimiterService.allowRequest(
      request.userTier,
      request.entityId,
      request.timestamp,
    );
  }
}
