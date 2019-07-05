import {EventType} from "../../../event/enum/eventType"
import EventConsumer from "../../../event/eventConsumer"
import EventResponse from "../../../event/eventResponse"
import {MobEntity} from "../../../mob/entity/mobEntity"
import FightEvent from "../../../mob/fight/event/fightEvent"
import {Equipment} from "../../enum/equipment"
import {WeaponEffect} from "../../enum/weaponEffect"

export default class VorpalWeaponEffectEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [ EventType.AttackRound ]
  }

  public async consume(event: FightEvent): Promise<EventResponse> {
    const weapon = event.mob.getFirstEquippedItemAtPosition(Equipment.Weapon)
    if (weapon && weapon.weaponEffects.includes(WeaponEffect.Vorpal)) {
      event.attacks.push(await event.fight.attack(event.mob, event.fight.getOpponentFor(event.mob) as MobEntity))
      return EventResponse.modified(event)
    }
    return EventResponse.none(event)
  }
}
