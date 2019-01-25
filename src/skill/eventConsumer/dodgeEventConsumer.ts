import Action from "../../action/action"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import FightEvent from "../../mob/fight/event/fightEvent"
import EventContext from "../../request/context/eventContext"
import {Request} from "../../request/request"
import {RequestType} from "../../request/requestType"
import {SkillType} from "../skillType"

export default class DodgeEventConsumer implements EventConsumer {
  constructor(private readonly dodge: Action) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.AttackRoundStart]
  }

  public async consume(event: FightEvent): Promise<EventResponse> {
    const request = new Request(event.mob, event.fight.room, new EventContext(RequestType.Noop))
    const result = await this.dodge.handle(request)
    if (result.isSuccessful()) {
      return EventResponse.satisfied(event, SkillType.Dodge)
    }
    return EventResponse.none(event)
  }
}
