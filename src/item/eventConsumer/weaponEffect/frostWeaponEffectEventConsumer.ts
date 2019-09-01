import { injectable } from "inversify"
import {createModifiedDamageEvent} from "../../../event/factory/eventFactory"
import EventResponse from "../../../event/messageExchange/eventResponse"
import ResponseMessage from "../../../messageExchange/responseMessage"
import DamageEvent from "../../../mob/event/damageEvent"
import {DamageType} from "../../../mob/fight/enum/damageType"
import vulnerabilityModifier from "../../../mob/fight/vulnerabilityModifier"
import Maybe from "../../../support/functional/maybe/maybe"
import {ItemEntity} from "../../entity/itemEntity"
import {WeaponEffect} from "../../enum/weaponEffect"
import WeaponEffectService from "../../service/weaponEffectService"
import AbstractWeaponEffectEventConsumer from "./abstractWeaponEffectEventConsumer"
import {WeaponEffectMessages} from "./constants"

@injectable()
export default class FrostWeaponEffectEventConsumer extends AbstractWeaponEffectEventConsumer {
  public getWeaponEffect(): WeaponEffect {
    return WeaponEffect.Frost
  }

  public applyWeaponEffect(event: DamageEvent, weapon: ItemEntity): Promise<EventResponse> {
    this.weaponEffectService.sendMessageToMobRoom(
      event.mob,
      new ResponseMessage(
        event.mob,
        WeaponEffectMessages.Frost.MobFrozen,
        { item: weapon, target: event.mob },
        { item: weapon, target: "you" },
        { item: weapon, target: event.mob }))
    const modifier = new Maybe<number>(WeaponEffectService.findDamageAbsorption(event.mob, DamageType.Frost))
      .do(damageAbsorption =>
        vulnerabilityModifier(damageAbsorption.vulnerability))
      .or(() => AbstractWeaponEffectEventConsumer.defaultBonus)
      .get()
    return EventResponse.modified(createModifiedDamageEvent(event, modifier))
  }
}
