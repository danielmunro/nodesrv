import {EventType} from "../../../event/enum/eventType"
import EventConsumer from "../../../event/interface/eventConsumer"
import EventResponse from "../../../event/messageExchange/eventResponse"
import FightEvent from "../../../mob/fight/event/fightEvent"
import {SpecializationType} from "../../../mob/specialization/enum/specializationType"
import {Equipment} from "../../enum/equipment"
import {WeaponEffect} from "../../enum/weaponEffect"

export default class FavoredWeaponEffectEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [ EventType.AttackRound ]
  }

  public async consume(event: FightEvent): Promise<EventResponse> {
    const weapon = event.mob.getFirstEquippedItemAtPosition(Equipment.Weapon)
    if (weapon &&
      weapon.weaponEffects.includes(WeaponEffect.Favored) &&
      event.mob.specializationType === SpecializationType.Cleric) {
      event.attacks.push(await event.fight.attack(event.mob, event.fight.getOpponentFor(event.mob)))
      return EventResponse.modified(event)
    }
    return EventResponse.none(event)
  }
}
