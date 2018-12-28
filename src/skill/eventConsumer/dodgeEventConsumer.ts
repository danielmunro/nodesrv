import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import {Trigger} from "../../mob/enum/trigger"
import FightEvent from "../../mob/fight/event/fightEvent"
import EventContext from "../../request/context/eventContext"
import {Request} from "../../request/request"
import {RequestType} from "../../request/requestType"
import SkillDefinition from "../skillDefinition"
import {SkillType} from "../skillType"

export default class DodgeEventConsumer implements EventConsumer {
  constructor(private readonly dodge: SkillDefinition) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.AttackRoundStart]
  }

  public async consume(event: FightEvent): Promise<EventResponse> {
    const request = new Request(event.mob, event.fight.room, new EventContext(RequestType.Noop, Trigger.AttackRound))
    const result = await this.dodge.doAction(request)
    if (result.isSuccessful()) {
      return EventResponse.satisfied(event, SkillType.Dodge)
    }
    return EventResponse.none(event)
  }
}
