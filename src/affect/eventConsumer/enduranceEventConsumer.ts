import { injectable } from "inversify"
import Cost from "../../check/cost/cost"
import {CostType} from "../../check/cost/costType"
import {EventType} from "../../event/enum/eventType"
import {createCostEvent} from "../../event/factory/eventFactory"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import {MobEntity} from "../../mob/entity/mobEntity"
import CostEvent from "../../mob/event/costEvent"
import {AffectType} from "../enum/affectType"

@injectable()
export default class EnduranceEventConsumer implements EventConsumer {
  private static reduceAmount(mob: MobEntity, cost: Cost) {
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
