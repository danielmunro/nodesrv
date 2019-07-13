import {EventType} from "../../event/enum/eventType"
import {createModifiedMobMoveEvent} from "../../event/factory/eventFactory"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import MobMoveEvent from "../../mob/event/mobMoveEvent"
import {AffectType} from "../enum/affectType"

export default class FlyEventConsumer implements EventConsumer {
  public async consume(event: MobMoveEvent): Promise<EventResponse> {
    if (event.mob.affect().has(AffectType.Fly)) {
      return EventResponse.modified(createModifiedMobMoveEvent(event, 0))
    }
    return EventResponse.none(event)
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobMoved ]
  }
}
