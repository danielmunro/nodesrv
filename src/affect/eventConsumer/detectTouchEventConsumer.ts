import { inject, injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import {createMobMessageEvent} from "../../event/factory/eventFactory"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import EventService from "../../event/service/eventService"
import {MobInteractionEvent} from "../../event/type/mobInteractionEvent"
import {Types} from "../../support/types"
import {AffectType} from "../enum/affectType"

@injectable()
export default class DetectTouchEventConsumer implements EventConsumer {
  constructor(@inject(Types.EventService) private readonly eventService: EventService) {}

  public async consume(event: MobInteractionEvent): Promise<EventResponse> {
    const aff = event.target.affect()
    if (aff.has(AffectType.DetectTouch)) {
      await this.eventService.publish(
        createMobMessageEvent(event.target, `${event.mob} is touching you.`))
    }
    return EventResponse.none(event)
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.Touch ]
  }
}
