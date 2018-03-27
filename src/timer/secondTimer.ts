import { Timer } from "./timer"

const SECOND_INTERVAL_IN_MS = 1000

export class SecondIntervalTimer implements Timer {
  public getTimerLength(): number {
    return SECOND_INTERVAL_IN_MS
  }
}
