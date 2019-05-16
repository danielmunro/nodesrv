import Cost from "../../check/cost/cost"
import Event from "../../event/event"
import {EventType} from "../../event/eventType"
import {Mob} from "../model/mob"

export default class CostEvent implements Event {
  constructor(
    public readonly mob: Mob,
    public readonly costs: Cost[]) {}

  public getEventType(): EventType {
    return EventType.CostApplied
  }
}
