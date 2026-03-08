import { USER_TIER } from "./enums/user-type";

export class SimpleRequest {
  constructor(
    private _userTier: USER_TIER,
    private _entityId: string,
    private _timestamp: number,
  ) {}

  get userTier() {
    return this._userTier;
  }
  get entityId() {
    return this._entityId;
  }
  get timestamp() {
    return this._timestamp;
  }
  getdisplay(): void {
    console.log(
      `EntityId: ${this.entityId} UserType: ${this.userTier} timestamp: ${this.timestamp}`,
    );
  }
}
