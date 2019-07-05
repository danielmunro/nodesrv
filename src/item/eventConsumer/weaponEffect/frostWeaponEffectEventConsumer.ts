import {EventType} from "../../../event/enum/eventType"
import EventConsumer from "../../../event/eventConsumer"
import EventResponse from "../../../event/eventResponse"
import {createModifiedDamageEvent} from "../../../event/factory/eventFactory"
import DamageEvent from "../../../mob/event/damageEvent"
import {DamageType} from "../../../mob/fight/enum/damageType"
import vulnerabilityModifier from "../../../mob/fight/vulnerabilityModifier"
import ResponseMessage from "../../../request/responseMessage"
import {ItemEntity} from "../../entity/itemEntity"
import {Equipment} from "../../enum/equipment"
import {WeaponEffect} from "../../enum/weaponEffect"
import WeaponEffectService from "../../service/weaponEffectService"
import {WeaponEffectMessages} from "./constants"

export default class FrostWeaponEffectEventConsumer implements EventConsumer {
  constructor(private readonly weaponEffectService: WeaponEffectService) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.DamageCalculation ]
  }

  public async consume(event: DamageEvent): Promise<EventResponse> {
    const equippedWeapon = event.source.getFirstEquippedItemAtPosition(Equipment.Weapon)
    if (equippedWeapon && equippedWeapon.weaponEffects.includes(WeaponEffect.Frost)) {
      return this.checkForRacialVulnerability(event, equippedWeapon)
    }
    return EventResponse.none(event)
  }

  private async checkForRacialVulnerability(event: DamageEvent, weapon: ItemEntity): Promise<EventResponse> {
    const damageAbsorption = WeaponEffectService.findDamageAbsorption(event.mob, DamageType.Frost)
    if (damageAbsorption) {
      this.weaponEffectService.sendMessageToMobRoom(
        event.mob,
        new ResponseMessage(
          event.mob,
          WeaponEffectMessages.Frost.MobFrozen,
          { item: weapon, target: event.mob },
          { item: weapon, target: "you" },
          { item: weapon, target: event.mob }))
      return EventResponse.modified(createModifiedDamageEvent(
        event, vulnerabilityModifier(damageAbsorption.vulnerability)))
    }
    return EventResponse.none(event)
  }
}
