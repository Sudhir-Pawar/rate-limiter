import { RateLimiterStratergy } from "../interface/rate-limiter-stratergy";

interface SlidingWCState {
  previousWindowCount: number;
  currentWindowCount: number;
  currentWindowStartTime: number;
}

export class SlidingWindowCounterStratergy implements RateLimiterStratergy {
  private maxRequestAllowed: number;
  private windowInSec: number;
  private windows: Map<string, SlidingWCState>;
  constructor(maxRequestAllowed: number, windowInSec: number) {
    this.maxRequestAllowed = maxRequestAllowed;
    this.windowInSec = windowInSec;
    this.windows = new Map<string, SlidingWCState>();
  }

  allowRequest(entityId: string, timestamp: number): boolean {
    const windowState = this.windows.get(entityId);
    const currentWindowStartTime = this.getCurrentWindowStartTime(timestamp);
    if (!windowState) {
      // new User
      this.windows.set(entityId, {
        previousWindowCount: 0,
        currentWindowCount: 1,
        currentWindowStartTime: currentWindowStartTime,
      });
      return true;
    }

    if (currentWindowStartTime == windowState.currentWindowStartTime) {
      // current window
      const percentagePassed =
        (timestamp - currentWindowStartTime) / (this.windowInSec * 1000);
      const overlapPercentage = 1 - percentagePassed;
      const totalRequestCount =
        windowState.currentWindowCount +
        windowState.previousWindowCount * overlapPercentage;

      if (totalRequestCount < this.maxRequestAllowed) {
        windowState.currentWindowCount++;
        this.windows.set(entityId, windowState);
        return true;
      } else {
        return false;
      }
    }

    // new window
    const timeSinceLastWindow =
      currentWindowStartTime - windowState.currentWindowStartTime;
    if (timeSinceLastWindow === this.windowInSec * 1000) {
      windowState.previousWindowCount = windowState.currentWindowCount;
    } else {
      windowState.previousWindowCount = 0;
    }
    windowState.currentWindowCount = 1;
    windowState.currentWindowStartTime = currentWindowStartTime;
    this.windows.set(entityId, windowState);
    return true;
  }

  private getCurrentWindowStartTime(timestamp: number) {
    const windowInMS = this.windowInSec * 1000;
    return Math.floor(timestamp / windowInMS) * windowInMS;
  }
}
