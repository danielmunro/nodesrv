import { Timer } from "./timer"

const SHORT_INTERVAL_IN_MS = 10

export class ShortIntervalTimer implements Timer {
  public getTimerLength(): number {
    return SHORT_INTERVAL_IN_MS
  }
}
