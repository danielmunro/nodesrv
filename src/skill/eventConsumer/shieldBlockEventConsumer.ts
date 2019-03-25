import Action from "../../action/action"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import FightEvent from "../../mob/fight/event/fightEvent"
import {Mob} from "../../mob/model/mob"
import EventContext from "../../request/context/eventContext"
import {Request} from "../../request/request"
import {RequestType} from "../../request/requestType"
import {SkillType} from "../skillType"

export default class ShieldBlockEventConsumer implements EventConsumer {
  constructor(private readonly shieldBlock: Action) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.AttackRoundStart ]
  }

  public async consume(event: FightEvent): Promise<EventResponse> {
    const target = event.fight.getOpponentFor(event.mob) as Mob
    if (!target.skills.find(skill => skill.skillType === SkillType.ShieldBlock)) {
      return EventResponse.none(event)
    }
    const request = new Request(target, event.fight.room, new EventContext(RequestType.Noop))
    const result = await this.shieldBlock.handle(request)
    if (result.isSuccessful()) {
      return EventResponse.satisfied(event, SkillType.ShieldBlock)
    }
    return EventResponse.none(event)
  }
}