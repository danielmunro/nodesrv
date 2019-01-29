import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import {MAX_PRACTICE_LEVEL} from "../../mob/constants"
import roll from "../../random/dice"
import SkillEvent from "../skillEvent"

export default class SkillInvokedEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.SkillInvoked]
  }

  public async consume(event: SkillEvent): Promise<EventResponse> {
    const skill = event.skill
    if (skill.level < MAX_PRACTICE_LEVEL && roll(1, 100) <= event.mob.getCombinedAttributes().stats.int / 3) {
      skill.level += 1
    }
    return EventResponse.none(event)
  }
}
