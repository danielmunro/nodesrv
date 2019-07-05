import {AffectType} from "../../../affect/enum/affectType"
import EventResponse from "../../../event/eventResponse"
import {createModifiedDamageEvent} from "../../../event/factory/eventFactory"
import {MobEntity} from "../../../mob/entity/mobEntity"
import DamageEvent from "../../../mob/event/damageEvent"
import {DamageType} from "../../../mob/fight/enum/damageType"
import vulnerabilityModifier from "../../../mob/fight/vulnerabilityModifier"
import ResponseMessage from "../../../request/responseMessage"
import Maybe from "../../../support/functional/maybe"
import roll from "../../../support/random/dice"
import {ItemEntity} from "../../entity/itemEntity"
import {WeaponEffect} from "../../enum/weaponEffect"
import {isMaterialFlammable} from "../../service/materialProperties"
import WeaponEffectService from "../../service/weaponEffectService"
import AbstractWeaponEffectEventConsumer from "./abstractWeaponEffectEventConsumer"
import {WeaponEffectMessages} from "./constants"

export default class FlamingWeaponEffectEventConsumer extends AbstractWeaponEffectEventConsumer {
  public getWeaponEffect(): WeaponEffect {
    return WeaponEffect.Flaming
  }

  public async applyWeaponEffect(event: DamageEvent, weapon: ItemEntity): Promise<EventResponse> {
    await this.checkForFlammableEquipment(event.mob)
    return this.increaseDamageModifier(event, weapon)
  }

  private async checkForFlammableEquipment(mob: MobEntity) {
    mob.equipped.items.forEach(async item => {
      if (isMaterialFlammable(item.material) && !item.affect().has(AffectType.Fireproof)) {
        await this.calculateBurningEquipment(item, mob)
      }
    })
  }

  private async increaseDamageModifier(event: DamageEvent, weapon: ItemEntity): Promise<EventResponse> {
    return new Maybe(WeaponEffectService.findDamageAbsorption(event.mob, DamageType.Fire))
      .do(damageAbsorption => {
        this.weaponEffectService.sendMessageToMobRoom(
          event.mob,
          new ResponseMessage(
            event.mob,
            WeaponEffectMessages.Flame.MobBurned,
            { item: weapon, target: event.mob + "'s", target2: "they" },
            { item: weapon, target: "your", target2: "you"},
            { item: weapon, target: event.mob + "'s", target2: "they" }))
        return EventResponse.modified(createModifiedDamageEvent(
          event, vulnerabilityModifier(damageAbsorption.vulnerability)))
      })
      .or(() => EventResponse.none(event))
      .get()
  }

  private async calculateBurningEquipment(item: ItemEntity, mob: MobEntity) {
    if (roll(1, 10) === 1) {
      await this.weaponEffectService.destroyItemOnMob(mob, item)
      this.weaponEffectService.sendMessageToMobRoom(
        mob,
        new ResponseMessage(
          mob,
          WeaponEffectMessages.Flame.ItemBurned,
          { item, target: mob },
          { item, target: "you" },
          { item, target: mob }))
    }
  }
}
