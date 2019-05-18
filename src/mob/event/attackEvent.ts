import {EventType} from "../../event/enum/eventType"
import {Mob} from "../model/mob"
import MobEvent from "./mobEvent"

export default class AttackEvent extends MobEvent {
  constructor(mob: Mob, target: Mob) {
    super(EventType.Attack, mob, target)
  }

  public getAttacker(): Mob {
    return this.mob
  }

  public getTarget(): Mob {
    return this.context
  }
}
