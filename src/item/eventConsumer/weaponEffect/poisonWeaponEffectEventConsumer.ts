import {AffectType} from "../../../affect/enum/affectType"
import {newAffect} from "../../../affect/factory/affectFactory"
import {createModifiedDamageEvent} from "../../../event/factory/eventFactory"
import EventResponse from "../../../event/messageExchange/eventResponse"
import {MobEntity} from "../../../mob/entity/mobEntity"
import DamageEvent from "../../../mob/event/damageEvent"
import {DamageType} from "../../../mob/fight/enum/damageType"
import vulnerabilityModifier from "../../../mob/fight/vulnerabilityModifier"
import ResponseMessage from "../../../request/responseMessage"
import Maybe from "../../../support/functional/maybe/maybe"
import roll from "../../../support/random/dice"
import {ItemEntity} from "../../entity/itemEntity"
import {WeaponEffect} from "../../enum/weaponEffect"
import WeaponEffectService from "../../service/weaponEffectService"
import AbstractWeaponEffectEventConsumer from "./abstractWeaponEffectEventConsumer"
import {WeaponEffectMessages} from "./constants"

export default class PoisonWeaponEffectEventConsumer extends AbstractWeaponEffectEventConsumer {
  public getWeaponEffect(): WeaponEffect {
    return WeaponEffect.Poison
  }

  public async applyWeaponEffect(event: DamageEvent, weapon: ItemEntity): Promise<EventResponse> {
    this.weaponEffectService.sendMessageToMobRoom(
      event.mob,
      new ResponseMessage(
        event.mob,
        WeaponEffectMessages.Poison.MobHit,
        { item: weapon, target: event.mob, verb: "is" },
        { item: weapon, target: "you", verb: "are" },
        { item: weapon, target: event.mob, verb: "is" }))
    const modifier = new Maybe(WeaponEffectService.findDamageAbsorption(event.mob, DamageType.Poison))
      .do(damageAbsorption =>
        vulnerabilityModifier(damageAbsorption.vulnerability))
      .or(() => AbstractWeaponEffectEventConsumer.defaultBonus)
      .get()
    await this.checkPoisonMob(event.mob, weapon)
    return EventResponse.modified(createModifiedDamageEvent(event, modifier))
  }

  private async checkPoisonMob(mob: MobEntity, weapon: ItemEntity) {
    if (roll(1, 10) === 1) {
      mob.affect().add(newAffect(AffectType.Poison))
      this.weaponEffectService.sendMessageToMobRoom(
        mob,
        new ResponseMessage(
          mob,
          WeaponEffectMessages.Poison.MobPoisoned,
          { item: weapon, target: mob, verb: "turns" },
          { item: weapon, target: "you", verb: "turn" },
          { item: weapon, target: mob, verb: "turns" }))
    }
  }
}
