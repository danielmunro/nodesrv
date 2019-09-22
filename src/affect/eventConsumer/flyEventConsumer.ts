import { injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import {createModifiedMobMoveEvent} from "../../event/factory/eventFactory"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import MobMoveEvent from "../../mob/event/mobMoveEvent"
import {AffectType} from "../enum/affectType"

@injectable()
export default class FlyEventConsumer implements EventConsumer {
  public async isEventConsumable(event: MobMoveEvent): Promise<boolean> {
    return event.mob.affect().has(AffectType.Fly)
  }

  public async consume(event: MobMoveEvent): Promise<EventResponse> {
    return EventResponse.modified(createModifiedMobMoveEvent(event, 0))
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.MobMoved ]
  }
}
