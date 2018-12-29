import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import {Trigger} from "../../mob/enum/trigger"
import FightEvent from "../../mob/fight/event/fightEvent"
import EventContext from "../../request/context/eventContext"
import {Request} from "../../request/request"
import {RequestType} from "../../request/requestType"
import SkillDefinition from "../skillDefinition"

export default class SecondAttackEventConsumer implements EventConsumer {
  constructor(private readonly secondAttack: SkillDefinition) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.AttackRound]
  }

  public async consume(event: FightEvent): Promise<EventResponse> {
    const fight = event.fight
    const request = new Request(
      event.mob, fight.room, new EventContext(RequestType.Noop, Trigger.AttackRound, event))
    const result = await this.secondAttack.doAction(request)
    if (result.isSuccessful()) {
      event.attacks.push(await fight.attack(event.mob, fight.getOpponentFor(event.mob)))
    }
    return EventResponse.none(event)
  }
}
