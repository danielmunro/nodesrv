import { Timer } from './timer'

const MS_IN_ONE_MINUTE = 60000

export class MinuteTimer implements Timer {
  public getTimerLength(): number {
    return MS_IN_ONE_MINUTE
  }
}