import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import MobEvent from "../../mob/event/mobEvent"
import EventContext from "../../request/context/eventContext"
import {Request} from "../../request/request"
import {RequestType} from "../../request/requestType"
import Skill from "../skill"
import {SkillType} from "../skillType"

export default class FastHealingEventConsumer implements EventConsumer {
  constructor(private readonly fastHealing: Skill) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.Tick]
  }

  public async consume(event: MobEvent): Promise<EventResponse> {
    const request = new Request(event.mob, event.context, new EventContext(RequestType.Noop))
    const result = await this.fastHealing.doAction(request)
    if (result.isSuccessful()) {
      return EventResponse.satisfied(event, SkillType.FastHealing)
    }
    return EventResponse.none(event)
  }
}
