import { Mob } from "../model/mob"
import { Attack } from "./attack"
import { Room } from "../../room/model/room"

export class Round {
  public readonly room: Room
  public readonly isFatality: boolean
  public readonly victor?: Mob
  public readonly vanquished?: Mob

  constructor(public readonly attacks: Attack[] = [], public readonly counters: Attack[] = []) {
    this.room = attacks[0].attacker.room
    const lastAttack = this.getLastAttack()
    const lastCounter = this.getLastCounter()
    this.isFatality = this.attacks && !lastAttack.isDefenderAlive || this.counters && !lastCounter.isDefenderAlive
    if (!lastAttack.isDefenderAlive) {
      this.isFatality = true
      this.victor = lastAttack.attacker
      this.vanquished = lastAttack.defender
    } else if (!lastCounter.isDefenderAlive) {
      this.isFatality = true
      this.victor = lastCounter.attacker
      this.vanquished = lastCounter.defender
    }
  }

  public getLastAttack(): Attack {
    return this.attacks[this.attacks.length - 1]
  }

  public getLastCounter(): Attack {
    return this.counters[this.counters.length - 1]
  }
}
