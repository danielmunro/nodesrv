import Skill from "../../action/skill"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import {EventType} from "../../event/eventType"
import FightEvent from "../../mob/fight/event/fightEvent"
import {Mob} from "../../mob/model/mob"
import EventContext from "../../request/context/eventContext"
import {Request} from "../../request/request"
import {RequestType} from "../../request/requestType"

export default class SecondAttackEventConsumer implements EventConsumer {
  constructor(private readonly secondAttack: Skill) {}

  public getConsumingEventTypes(): EventType[] {
    return [EventType.AttackRound]
  }

  public async consume(event: FightEvent): Promise<EventResponse> {
    const fight = event.fight
    const request = new Request(
      event.mob, fight.room, new EventContext(RequestType.Noop, event))
    const result = await this.secondAttack.handle(request)
    if (result.isSuccessful()) {
      event.attacks.push(await fight.attack(event.mob, fight.getOpponentFor(event.mob) as Mob))
    }
    return EventResponse.none(event)
  }
}
