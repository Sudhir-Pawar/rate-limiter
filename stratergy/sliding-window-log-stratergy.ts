import { RateLimiterStratergy } from "../interface/rate-limiter-stratergy";

interface SlidingWindowState {
  requestList: number[];
}
export class SlidingWindowLogStratergy implements RateLimiterStratergy {
  private windowInSec: number;
  private maxRequestAllowed: number;
  private windows: Map<string, SlidingWindowState>;
  constructor(maxRequestAllowed: number, windowInSec: number) {
    this.windowInSec = windowInSec;
    this.maxRequestAllowed = maxRequestAllowed;
    this.windows = new Map<string, SlidingWindowState>();
  }

  allowRequest(entityId: string, timestamp: number): boolean {
    const windowState = this.windows.get(entityId);
    if (!windowState) {
      this.windows.set(entityId, {
        requestList: [timestamp],
      });
      return true;
    }
    const currentWindowStart = timestamp - this.windowInSec * 1000;
    let currentWindowStartIndex: number = -1;

    for (let i = 0; i < windowState.requestList.length; i++) {
      const reqTimeStamp = windowState.requestList[i];
      if (reqTimeStamp > currentWindowStart) {
        currentWindowStartIndex = i;
        break;
      }
    }

    if (currentWindowStartIndex == -1) {
      // new window
      this.windows.set(entityId, {
        requestList: [timestamp],
      });
      return true;
    }

    windowState.requestList = windowState.requestList.slice(
      currentWindowStartIndex,
      windowState.requestList.length,
    );

    if (windowState.requestList.length < this.maxRequestAllowed) {
      windowState.requestList.push(timestamp);
      this.windows.set(entityId, windowState);
      return true;
    }

    return false;
  }
}
