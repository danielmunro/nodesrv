import {pickOne} from "../../support/random/helpers"
import { MobEntity } from "../entity/mobEntity"
import {BodyPart} from "../race/enum/bodyParts"
import { Attack } from "./attack"
import Death from "./death"
import { Fight } from "./fight"

export class Round {
  public readonly isFatality: boolean = false
  public readonly victor?: MobEntity
  public readonly vanquished?: MobEntity
  public readonly death?: Death
  public readonly bodyParts?: BodyPart[]

  constructor(
    public readonly fight: Fight,
    public readonly attacks: Attack[] = [],
    public readonly counters: Attack[] = []) {
    const fatalAttack = attacks.find(attack => !attack.isDefenderAlive)
    const fatalCounter = counters.find(attack => !attack.isDefenderAlive)
    if (fatalAttack && !fatalAttack.isDefenderAlive) {
      this.isFatality = true
      this.victor = fatalAttack.attacker
      this.vanquished = fatalAttack.defender
      this.death = fatalAttack.death
    } else if (fatalCounter && !fatalCounter.isDefenderAlive) {
      this.isFatality = true
      this.victor = fatalCounter.attacker
      this.vanquished = fatalCounter.defender
      this.death = fatalCounter.death
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

  public isParticipant(mob: MobEntity) {
    const lastAttack = this.getLastAttack()
    return mob === lastAttack.attacker || mob === lastAttack.defender
  }

  public getWinner(): MobEntity | undefined {
    return this.death ? this.death.killer : undefined
  }
}
