import { Attack } from "./attack"

export class Round {
  public readonly isFatality: boolean

  constructor(public readonly attack: Attack = null, public readonly counter: Attack = null) {
    this.isFatality = this.attack && !this.attack.isDefenderAlive || this.counter && !this.counter.isDefenderAlive
  }
}
