import { Timer } from "./timer"

const MS_IN_FIVE_MINUTE = 300000

export class FiveMinuteTimer implements Timer {
  public getTimerLength(): number {
    return MS_IN_FIVE_MINUTE
  }
}
