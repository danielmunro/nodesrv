import EventResponse from "../../../event/eventResponse"
import {createModifiedDamageEvent} from "../../../event/factory/eventFactory"
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

export default class FrostWeaponEffectEventConsumer extends AbstractWeaponEffectEventConsumer {
  public getWeaponEffect(): WeaponEffect {
    return WeaponEffect.Frost
  }

  public applyWeaponEffect(event: DamageEvent, weapon: ItemEntity): Promise<EventResponse> {
    return new Maybe(WeaponEffectService.findDamageAbsorption(event.mob, DamageType.Frost))
      .do(damageAbsorption => {
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
      })
      .or(() => EventResponse.none(event))
      .get()
  }
}
