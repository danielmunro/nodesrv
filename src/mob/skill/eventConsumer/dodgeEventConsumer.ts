import Action from "../../../action/impl/action"
import {EventType} from "../../../event/enum/eventType"
import EventConsumer from "../../../event/interface/eventConsumer"
import EventResponse from "../../../event/messageExchange/eventResponse"
import EventContext from "../../../request/context/eventContext"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import FightEvent from "../../fight/event/fightEvent"
import {SkillType} from "../skillType"

export default class DodgeEventConsumer implements EventConsumer {
  constructor(private readonly dodge: Action) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.AttackRoundStart]
  }

  public async consume(event: FightEvent): Promise<EventResponse> {
    if (!event.mob.getSkill(SkillType.Dodge)) {
      return EventResponse.none(event)
    }
    const result = await this.dodge.handle(
      new Request(event.mob, event.fight.room, { requestType: RequestType.Noop } as EventContext))
    if (result.isSuccessful()) {
      return EventResponse.satisfied(event, SkillType.Dodge)
    }
    return EventResponse.none(event)
  }
}
