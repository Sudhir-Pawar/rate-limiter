import { RateLimiterStratergy } from "../interface/rate-limiter-stratergy";

interface FixedWindowState {
  remainingRequests: number;
  windowStart: number;
}

export class FixedWindowCounterStratergy implements RateLimiterStratergy {
  private windowInSec: number;
  private maxRequestAllowed: number;
  private windows: Map<string, FixedWindowState>;
  constructor(maxRequestAllowed: number, windowInSec: number) {
    this.maxRequestAllowed = maxRequestAllowed;
    this.windowInSec = windowInSec;
    this.windows = new Map<string, FixedWindowState>();
  }
  allowRequest(entityId: string, timestamp: number): boolean {
    const windowState = this.windows.get(entityId);
    const currentWindowStart = this.getCurrentWindowStart(timestamp);
    if (!windowState) {
      this.windows.set(entityId, this.getNewWindowState(currentWindowStart));
      return true;
    }

    if (windowState.windowStart !== currentWindowStart) {
      // new window
      this.windows.set(entityId, this.getNewWindowState(currentWindowStart));
      return true;
    }

    if (windowState.remainingRequests >= 1) {
      windowState.remainingRequests--;
      this.windows.set(entityId, windowState);
      return true;
    }

    return false;
  }

  private getNewWindowState(windowStart: number) {
    return {
      remainingRequests: this.maxRequestAllowed - 1,
      windowStart: windowStart,
    };
  }

  private getCurrentWindowStart(timestamp: number) {
    const windowInMs = this.windowInSec * 1000;
    return Math.floor(timestamp / windowInMs) * windowInMs;
  }
}
