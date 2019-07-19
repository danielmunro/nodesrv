import Action from "../../../action/impl/action"
import {EventType} from "../../../event/enum/eventType"
import EventConsumer from "../../../event/interface/eventConsumer"
import EventResponse from "../../../event/messageExchange/eventResponse"
import {Equipment} from "../../../item/enum/equipment"
import EventContext from "../../../request/context/eventContext"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import FightEvent from "../../fight/event/fightEvent"
import {SkillType} from "../skillType"

export default class ParryEventConsumer implements EventConsumer {
  constructor(private readonly parry: Action) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.AttackRoundStart ]
  }

  public async consume(event: FightEvent): Promise<EventResponse> {
    const target = event.fight.getOpponentFor(event.mob)
    if (!target.skills.find(skill => skill.skillType === SkillType.Parry)
      || !target.equipped.items.find(item => item.equipment === Equipment.Weapon)) {
      return EventResponse.none(event)
    }
    const request = new Request(target, event.fight.room, { requestType: RequestType.Noop } as EventContext)
    const result = await this.parry.handle(request)
    if (result.isSuccessful()) {
      return EventResponse.satisfied(event, SkillType.Parry)
    }
    return EventResponse.none(event)
  }
}