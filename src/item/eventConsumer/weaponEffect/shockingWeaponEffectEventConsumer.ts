import EventResponse from "../../../event/eventResponse"
import {createModifiedDamageEvent} from "../../../event/factory/eventFactory"
import {MobEntity} from "../../../mob/entity/mobEntity"
import DamageEvent from "../../../mob/event/damageEvent"
import {DamageType} from "../../../mob/fight/enum/damageType"
import vulnerabilityModifier from "../../../mob/fight/vulnerabilityModifier"
import ResponseMessage from "../../../request/responseMessage"
import Maybe from "../../../support/functional/maybe"
import {ItemEntity} from "../../entity/itemEntity"
import {WeaponEffect} from "../../enum/weaponEffect"
import WeaponEffectService from "../../service/weaponEffectService"
import AbstractWeaponEffectEventConsumer from "./abstractWeaponEffectEventConsumer"
import {WeaponEffectMessages} from "./constants"

export default class ShockingWeaponEffectEventConsumer extends AbstractWeaponEffectEventConsumer {
  private static calculateModifier(mob: MobEntity): number {
    return new Maybe(WeaponEffectService.findDamageAbsorption(mob, DamageType.Electric))
      .do(damageAbsorption => vulnerabilityModifier(damageAbsorption.vulnerability))
      .or(() => 0.15)
      .get()
  }

  public getWeaponEffect(): WeaponEffect {
    return WeaponEffect.Shocking
  }

  public applyWeaponEffect(event: DamageEvent, weapon: ItemEntity): Promise<EventResponse> {
    this.weaponEffectService.sendMessageToMobRoom(
      event.mob,
      new ResponseMessage(
        event.mob,
        WeaponEffectMessages.Shocking.MobShocked,
        { item: weapon, target: event.mob },
        { item: weapon, target: "you" },
        { item: weapon, target: event.mob }))
    // drop conductive equipment
    return EventResponse.modified(
      createModifiedDamageEvent(event, ShockingWeaponEffectEventConsumer.calculateModifier(event.mob)))
  }
}
