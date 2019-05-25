import {EventType} from "../../event/enum/eventType"
import {MobInteractionEvent} from "../../event/event"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {createMobMessageEvent} from "../../event/factory/eventFactory"
import EventService from "../../event/service/eventService"
import {AffectType} from "../enum/affectType"

export default class DetectTouchEventConsumer implements EventConsumer {
  constructor(private readonly eventService: EventService) {}

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
