import { Timer } from './timer'
import roll from "../../dice"

export class ImmediateTimer implements Timer {
  public getRandomTickLength(): number {
    return 0 // not so random
  }
}