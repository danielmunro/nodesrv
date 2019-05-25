import Cost from "../../check/cost/cost"
import {CostType} from "../../check/cost/costType"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {createCostEvent} from "../../event/factory/eventFactory"
import CostEvent from "../../mob/event/costEvent"
import {Mob} from "../../mob/model/mob"
import {AffectType} from "../enum/affectType"

export default class EnduranceEventConsumer implements EventConsumer {
  private static reduceAmount(mob: Mob, cost: Cost) {
    if (typeof cost.amount === "function") {
      return cost.amount(mob) / 3
    }

    return cost.amount / 3
  }

  public async consume(event: CostEvent): Promise<EventResponse> {
    if (event.mob.affect().has(AffectType.Endurance)
      && event.costs.find(cost => cost.costType === CostType.Mv)) {
      return EventResponse.modified(
        createCostEvent(
          event.mob,
          event.costs.map(cost =>
            cost.costType === CostType.Mv ?
              new Cost(CostType.Mv, EnduranceEventConsumer.reduceAmount(event.mob, cost)) : cost)))
    }
    return EventResponse.none(event)
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.CostApplied ]
  }
}
