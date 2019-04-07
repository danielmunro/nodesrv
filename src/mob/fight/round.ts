import { Room } from "../../room/model/room"
import {pickOne} from "../../support/random/helpers"
import { Mob } from "../model/mob"
import {BodyPart} from "../race/enum/bodyParts"
import { Attack } from "./attack"
import Death from "./death"
import { Fight } from "./fight"

export class Round {
  public readonly room: Room
  public readonly isFatality: boolean
  public readonly victor?: Mob
  public readonly vanquished?: Mob
  public readonly death?: Death
  public readonly bodyParts?: BodyPart[]

  constructor(
    public readonly fight: Fight,
    public readonly attacks: Attack[] = [],
    public readonly counters: Attack[] = []) {
    const lastAttack = this.getLastAttack()
    const lastCounter = this.getLastCounter()
    this.room = fight.room
    this.isFatality = lastAttack && !lastAttack.isDefenderAlive || lastCounter && !lastCounter.isDefenderAlive
    if (lastAttack && !lastAttack.isDefenderAlive) {
      this.isFatality = true
      this.victor = lastAttack.attacker
      this.vanquished = lastAttack.defender
      this.death = lastAttack.death
    } else if (lastCounter && !lastCounter.isDefenderAlive) {
      this.isFatality = true
      this.victor = lastCounter.attacker
      this.vanquished = lastCounter.defender
      this.death = lastCounter.death
    }
    if (this.death) {
      this.bodyParts = [pickOne(this.death.mobKilled.race().bodyParts)]
    }
  }

  public getLastAttack(): Attack {
    return this.attacks[this.attacks.length - 1]
  }

  public getLastCounter(): Attack {
    return this.counters[this.counters.length - 1]
  }

  public isParticipant(mob: Mob) {
    const lastAttack = this.getLastAttack()
    return mob === lastAttack.attacker || mob === lastAttack.defender
  }

  public getWinner(): Mob | undefined {
    return this.death ? this.death.killer : undefined
  }
}
