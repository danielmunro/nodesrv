import { injectable } from "inversify"
import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/interface/eventConsumer"
import EventResponse from "../../event/messageExchange/eventResponse"
import FightEvent from "../../mob/fight/event/fightEvent"
import {AffectType} from "../enum/affectType"

@injectable()
export default class HasteEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.AttackRound]
  }

  public async isEventConsumable(event: FightEvent): Promise<boolean> {
    return event.mob.affect().has(AffectType.Haste)
  }

  public async consume(event: FightEvent): Promise<EventResponse> {
    const fight = event.fight
    event.attacks.push(await fight.createAttack(event.mob, fight.getOpponentFor(event.mob)))
    return EventResponse.none(event)
  }
}
