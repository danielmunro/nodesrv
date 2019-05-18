import {EventType} from "../../event/enum/eventType"
import EventConsumer from "../../event/eventConsumer"
import EventResponse from "../../event/eventResponse"
import FightEvent from "../../mob/fight/event/fightEvent"
import {Mob} from "../../mob/model/mob"
import roll from "../../support/random/dice"
import {AffectType} from "../enum/affectType"

export default class CrusadeEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [EventType.AttackRound]
  }

  public async consume(event: FightEvent): Promise<EventResponse> {
    if (event.mob.affect().has(AffectType.Crusade) && roll(1, 2) === 1) {
      const fight = event.fight
      event.attacks.push(await fight.attack(event.mob, fight.getOpponentFor(event.mob) as Mob))
    }
    return EventResponse.none(event)
  }
}
