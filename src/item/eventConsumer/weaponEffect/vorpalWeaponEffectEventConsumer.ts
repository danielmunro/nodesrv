import { injectable } from "inversify"
import {EventType} from "../../../event/enum/eventType"
import EventConsumer from "../../../event/interface/eventConsumer"
import EventResponse from "../../../event/messageExchange/eventResponse"
import FightEvent from "../../../mob/fight/event/fightEvent"
import {Equipment} from "../../enum/equipment"
import {WeaponEffect} from "../../enum/weaponEffect"

@injectable()
export default class VorpalWeaponEffectEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [ EventType.AttackRound ]
  }

  public async consume(event: FightEvent): Promise<EventResponse> {
    const weapon = event.mob.getFirstEquippedItemAtPosition(Equipment.Weapon)
    if (weapon && weapon.weaponEffects.includes(WeaponEffect.Vorpal)) {
      event.attacks.push(await event.fight.createAttack(event.mob, event.fight.getOpponentFor(event.mob)))
      return EventResponse.modified(event)
    }
    return EventResponse.none(event)
  }
}
