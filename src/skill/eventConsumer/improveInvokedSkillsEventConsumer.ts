import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {MAX_PRACTICE_LEVEL} from "../../mob/constants"
import {MobEntity} from "../../mob/entity/mobEntity"
import {percentRoll} from "../../support/random/helpers"
import SkillEvent from "../event/skillEvent"

export default class ImproveInvokedSkillsEventConsumer implements EventConsumer {
  private static getRollCheck(mob: MobEntity) {
    return Math.max(1, (mob.attribute().getInt() - 18)) * 2
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
