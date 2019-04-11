import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import EventService from "../../event/eventService"
import {EventType} from "../../event/eventType"
import MobEvent from "../../mob/event/mobEvent"
import {Mob} from "../../mob/model/mob"
import {AffectType} from "../affectType"

export default class DetectTouchEventConsumer implements EventConsumer {
  constructor(private readonly eventService: EventService) {}

  public async consume(event: MobEvent): Promise<EventResponse> {
    const target = event.context as Mob
    const aff = target.affect()
    if (aff.has(AffectType.DetectTouch)) {
      await this.eventService.publish(
        new MobEvent(EventType.MobUpdated, target, `${event.mob} is touching you.`))
    }
    return EventResponse.none(event)
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.Touch ]
  }
}
