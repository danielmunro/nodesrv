import { Timer } from './timer'
import roll from "../../dice"

export class LiveTimer implements Timer {
  public getRandomTickLength(): number {
    return 10000 * roll(1, 2)
  }
}