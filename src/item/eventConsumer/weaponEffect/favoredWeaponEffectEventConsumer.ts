import { injectable } from "inversify"
import {EventType} from "../../../event/enum/eventType"
import EventConsumer from "../../../event/interface/eventConsumer"
import EventResponse from "../../../event/messageExchange/eventResponse"
import FightEvent from "../../../mob/fight/event/fightEvent"
import {SpecializationType} from "../../../mob/specialization/enum/specializationType"
import {Equipment} from "../../enum/equipment"
import {WeaponEffect} from "../../enum/weaponEffect"

@injectable()
export default class FavoredWeaponEffectEventConsumer implements EventConsumer {
  public getConsumingEventTypes(): EventType[] {
    return [ EventType.AttackRound ]
  }

  public async isEventConsumable(event: FightEvent): Promise<boolean> {
    const weapon = event.mob.getFirstEquippedItemAtPosition(Equipment.Weapon)
    return !!weapon &&
      weapon.weaponEffects.includes(WeaponEffect.Favored) &&
      event.mob.specializationType === SpecializationType.Cleric
  }

  public async consume(event: FightEvent): Promise<EventResponse> {
    event.attacks.push(await event.fight.createAttack(event.mob, event.fight.getOpponentFor(event.mob)))
    return EventResponse.modified(event)
  }
}
