import Skill from "../../action/impl/skill"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import TickEvent from "../../mob/event/tickEvent"
import EventContext from "../../request/context/eventContext"
import Request from "../../request/request"
import {RequestType} from "../../request/requestType"

export default class FastHealingEventConsumer implements EventConsumer {
  constructor(private readonly fastHealing: Skill) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.Tick ]
  }

  public async consume(event: TickEvent): Promise<EventResponse> {
    const request = new Request(event.mob, event.room, new EventContext(RequestType.Noop))
    await this.fastHealing.handle(request)
    return EventResponse.none(event)
  }
}
