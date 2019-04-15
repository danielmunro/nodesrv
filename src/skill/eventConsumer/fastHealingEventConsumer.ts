import Skill from "../../action/impl/skill"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import MobEvent from "../../mob/event/mobEvent"
import EventContext from "../../request/context/eventContext"
import Request from "../../request/request"
import {RequestType} from "../../request/requestType"

export default class FastHealingEventConsumer implements EventConsumer {
  constructor(private readonly fastHealing: Skill) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.Tick]
  }

  public async consume(event: MobEvent): Promise<EventResponse> {
    const request = new Request(event.mob, event.context, new EventContext(RequestType.Noop))
    await this.fastHealing.handle(request)
    return EventResponse.none(event)
  }
}
