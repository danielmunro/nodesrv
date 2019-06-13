import { RoomEntity } from "../../room/entity/roomEntity"
import {pickOne} from "../../support/random/helpers"
import { MobEntity } from "../entity/mobEntity"
import {BodyPart} from "../race/enum/bodyParts"
import { Attack } from "./attack"
import Death from "./death"
import { Fight } from "./fight"

export class Round {
  public readonly room: RoomEntity
  public readonly isFatality: boolean
  public readonly victor?: MobEntity
  public readonly vanquished?: MobEntity
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

  public isParticipant(mob: MobEntity) {
    const lastAttack = this.getLastAttack()
    return mob === lastAttack.attacker || mob === lastAttack.defender
  }

  public getWinner(): MobEntity | undefined {
    return this.death ? this.death.killer : undefined
  }
}
