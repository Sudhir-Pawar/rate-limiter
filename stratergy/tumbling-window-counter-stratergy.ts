import { RateLimiterStratergy } from "../interface/rate-limiter-stratergy";

interface WindowState {
  remainingRequests: number;
  windowStart: number;
  windowEnd: number;
}

export class TumblingWindowCounterStratergy implements RateLimiterStratergy {
  private windowInSec: number;
  private maxRequestAllowed: number;
  private windows: Map<string, WindowState>;
  constructor(maxRequestAllowed: number, windowInSec: number) {
    this.maxRequestAllowed = maxRequestAllowed;
    this.windowInSec = windowInSec;
    this.windows = new Map<string, WindowState>();
  }
  allowRequest(entityId: string, timestamp: number): boolean {
    const windowState = this.windows.get(entityId);
    if (!windowState) {
      this.windows.set(entityId, this.getNewWindowState(timestamp));
      return true;
    }

    if (timestamp > windowState.windowEnd) {
      // new window
      this.windows.set(entityId, this.getNewWindowState(timestamp));
      return true;
    }

    if (windowState.remainingRequests >= 1) {
      windowState.remainingRequests--;
      this.windows.set(entityId, windowState);
      return true;
    }

    return false;
  }

  private getNewWindowState(timestamp: number) {
    return {
      remainingRequests: this.maxRequestAllowed - 1,
      windowStart: timestamp,
      windowEnd: timestamp + this.windowInSec * 1000,
    };
  }
}
