import { injectable } from "inversify"
import {EventType} from "../../../event/enum/eventType"
import EventConsumer from "../../../event/interface/eventConsumer"
import EventResponse from "../../../event/messageExchange/eventResponse"
import {percentRoll} from "../../../support/random/helpers"
import {MAX_PRACTICE_LEVEL} from "../../constants"
import {MobEntity} from "../../entity/mobEntity"
import SkillEvent from "../event/skillEvent"

@injectable()
export default class ImproveInvokedSkillsEventConsumer implements EventConsumer {
  private static getRollCheck(mob: MobEntity) {
    return Math.max(1, (mob.attribute().getInt() - 18)) * 2
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.SkillInvoked ]
  }

  public async isEventConsumable(event: SkillEvent): Promise<boolean> {
    return event.skill.level < MAX_PRACTICE_LEVEL &&
      percentRoll() <= ImproveInvokedSkillsEventConsumer.getRollCheck(event.mob)
  }

  public async consume(event: SkillEvent): Promise<EventResponse> {
    event.skill.level += 1
    return EventResponse.none(event)
  }
}
