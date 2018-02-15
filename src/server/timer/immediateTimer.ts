import { Timer } from './timer'

export class ImmediateTimer implements Timer {
  public getTimerLength(): number {
    return 0
  }
}