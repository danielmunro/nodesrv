import { Timer } from './timer'

export class ImmediateTimer implements Timer {
  public getRandomTickLength(): number {
    return 0 // not so random
  }
}