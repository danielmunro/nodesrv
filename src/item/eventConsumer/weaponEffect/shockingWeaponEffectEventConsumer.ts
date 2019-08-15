import {createModifiedDamageEvent} from "../../../event/factory/eventFactory"
import EventResponse from "../../../event/messageExchange/eventResponse"
import ResponseMessage from "../../../messageExchange/responseMessage"
import {MobEntity} from "../../../mob/entity/mobEntity"
import DamageEvent from "../../../mob/event/damageEvent"
import {DamageType} from "../../../mob/fight/enum/damageType"
import vulnerabilityModifier from "../../../mob/fight/vulnerabilityModifier"
import Maybe from "../../../support/functional/maybe/maybe"
import roll from "../../../support/random/dice"
import {ItemEntity} from "../../entity/itemEntity"
import {WeaponEffect} from "../../enum/weaponEffect"
import {isMaterialConductive} from "../../service/materialProperties"
import WeaponEffectService from "../../service/weaponEffectService"
import AbstractWeaponEffectEventConsumer from "./abstractWeaponEffectEventConsumer"
import {WeaponEffectMessages} from "./constants"

export default class ShockingWeaponEffectEventConsumer extends AbstractWeaponEffectEventConsumer {
  private static calculateModifier(mob: MobEntity): number {
    return new Maybe<number>(WeaponEffectService.findDamageAbsorption(mob, DamageType.Electric))
      .do(damageAbsorption => vulnerabilityModifier(damageAbsorption.vulnerability))
      .or(() => AbstractWeaponEffectEventConsumer.defaultBonus)
      .get()
  }

  public getWeaponEffect(): WeaponEffect {
    return WeaponEffect.Shocking
  }

  public async applyWeaponEffect(event: DamageEvent, weapon: ItemEntity): Promise<EventResponse> {
    this.weaponEffectService.sendMessageToMobRoom(
      event.mob,
      new ResponseMessage(
        event.mob,
        WeaponEffectMessages.Shocking.MobShocked,
        { item: weapon, target: event.mob },
        { item: weapon, target: "you" },
        { item: weapon, target: event.mob }))
    await this.dropConductiveEquipment(event.mob, weapon)
    return EventResponse.modified(
      createModifiedDamageEvent(event, ShockingWeaponEffectEventConsumer.calculateModifier(event.mob)))
  }

  private async dropConductiveEquipment(mob: MobEntity, weapon: ItemEntity) {
    await Promise.all(mob.equipped.items.map(async item => {
      if (isMaterialConductive(item.material) && roll(1, 8) === 1) {
        await this.weaponEffectService.dropItem(mob, item)
        this.weaponEffectService.sendMessageToMobRoom(
          mob,
          new ResponseMessage(
            mob,
            WeaponEffectMessages.Shocking.ItemShocked,
            { item, weapon, target: " " + mob },
            { item, weapon, target: "" },
            { item, weapon, target: " " + mob }))
      }
    }))
  }
}
