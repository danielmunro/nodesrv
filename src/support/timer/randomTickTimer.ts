import {DiceRoller} from "../random/dice"
import { Timer } from "./timer"

export class RandomTickTimer implements Timer {
  private readonly diceRoll: DiceRoller

  constructor(diceRoll: DiceRoller) {
    this.diceRoll = diceRoll
  }

  public getTimerLength(): number {
    return this.diceRoll.getRoll()
  }
}
