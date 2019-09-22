import { injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import {createSkillEvent} from "../../event/factory/eventFactory"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import SkillEvent from "../../mob/skill/event/skillEvent"
import {percentRoll} from "../../support/random/helpers"
import {AffectType} from "../enum/affectType"

@injectable()
export default class ForgetEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.SkillInvoked]
  }

  public async isEventConsumable(event: SkillEvent): Promise<boolean> {
    return event.mob.affect().has(AffectType.Forget) && event.skill.level / 2 < percentRoll()
  }

  public async consume(event: SkillEvent): Promise<EventResponse> {
    return EventResponse.modified(createSkillEvent(event.skill, event.mob, false))
  }
}
