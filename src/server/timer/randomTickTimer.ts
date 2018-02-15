import { Timer } from './timer'
import roll, { DiceRoller } from "../../dice/dice"

export class RandomTickTimer implements Timer {
  private readonly diceRoll: DiceRoller

  constructor(diceRoll: DiceRoller) {
    this.diceRoll = diceRoll
  }

  public getTimerLength(): number {
    return this.diceRoll.getRoll()
  }
}