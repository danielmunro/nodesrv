import {EventType} from "../../event/enum/eventType"
import {MobInteractionEvent} from "../../event/event"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import EventService from "../../event/eventService"
import {createMobEvent} from "../../event/factory"
import {AffectType} from "../enum/affectType"

export default class DetectTouchEventConsumer implements EventConsumer {
  constructor(private readonly eventService: EventService) {}

  public async consume(event: MobInteractionEvent): Promise<EventResponse> {
    const aff = event.target.affect()
    if (aff.has(AffectType.DetectTouch)) {
      await this.eventService.publish(
        createMobEvent(EventType.MobUpdated, event.target, `${event.mob} is touching you.`))
    }
    return EventResponse.none(event)
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.Touch ]
  }
}
