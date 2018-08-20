import { Mob } from "../model/mob"
import { Attack } from "./attack"

export class Round {
  public readonly isFatality: boolean
  public readonly victor?: Mob
  public readonly vanquished?: Mob

  constructor(public readonly attack: Attack = null, public readonly counter: Attack = null) {
    this.isFatality = this.attack && !this.attack.isDefenderAlive || this.counter && !this.counter.isDefenderAlive
    if (!this.attack.isDefenderAlive) {
      this.isFatality = true
      this.victor = this.attack.attacker
      this.vanquished = this.attack.defender
    } else if (!this.counter.isDefenderAlive) {
      this.isFatality = true
      this.victor = this.counter.attacker
      this.vanquished = this.counter.defender
    }
  }
}
