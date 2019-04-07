import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import SkillEvent from "../../skill/skillEvent"
import {percentRoll} from "../../support/random/helpers"
import {AffectType} from "../affectType"

export default class ForgetEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.SkillInvoked]
  }

  public async consume(event: SkillEvent): Promise<EventResponse> {
    if (event.mob.affect().has(AffectType.Forget) && event.skill.level / 2 < percentRoll()) {
      return EventResponse.modified(new SkillEvent(event.skill, event.mob, false))
    }
    return EventResponse.none(event)
  }
}
