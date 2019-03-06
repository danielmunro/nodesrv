import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import {MAX_PRACTICE_LEVEL} from "../../mob/constants"
import {Mob} from "../../mob/model/mob"
import {percentRoll} from "../../random/dice"
import SkillEvent from "../skillEvent"

export default class ImproveInvokedSkillsEventConsumer implements EventConsumer {
  private static getRollCheck(mob: Mob) {
    return mob.getCombinedAttributes().stats.int - 10
  }

  public getConsumingEventTypes(): EventType[] {
    return [EventType.SkillInvoked]
  }

  public async consume(event: SkillEvent): Promise<EventResponse> {
    const skill = event.skill
    if (skill.level < MAX_PRACTICE_LEVEL &&
      percentRoll() <= ImproveInvokedSkillsEventConsumer.getRollCheck(event.mob)) {
      skill.level += 1
    }
    return EventResponse.none(event)
  }
}
