import { Attack } from "./attack"

export class Round {
  public readonly attack: Attack
  public readonly counter: Attack
  public readonly isFatality: boolean

  constructor(attack: Attack, counter: Attack = null) {
    this.attack = attack
    this.counter = counter
    this.isFatality = !this.attack.isDefenderAlive || this.counter && !this.counter.isDefenderAlive
  }
}
