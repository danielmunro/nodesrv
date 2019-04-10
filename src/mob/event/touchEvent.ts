import {EventType} from "../../event/eventType"
import {Mob} from "../model/mob"
import MobEvent from "./mobEvent"

export default class TouchEvent extends MobEvent {
  constructor(mob: Mob, target: Mob) {
    super(EventType.Touch, mob, target)
  }

  public getAttacker(): Mob {
    return this.mob
  }

  public getTarget(): Mob {
    return this.context
  }
}
