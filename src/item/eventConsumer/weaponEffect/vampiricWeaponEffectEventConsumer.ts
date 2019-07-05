import {EventType} from "../../../event/enum/eventType"
import EventConsumer from "../../../event/eventConsumer"
import EventResponse from "../../../event/eventResponse"
import DamageEvent from "../../../mob/event/damageEvent"
import ResponseMessage from "../../../request/responseMessage"
import roll from "../../../support/random/dice"
import {ItemEntity} from "../../entity/itemEntity"
import {Equipment} from "../../enum/equipment"
import {WeaponEffect} from "../../enum/weaponEffect"
import WeaponEffectService from "../../service/weaponEffectService"
import {WeaponEffectMessages} from "./constants"

export default class VampiricWeaponEffectEventConsumer implements EventConsumer {
  constructor(private readonly weaponEffectService: WeaponEffectService) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.DamageCalculation ]
  }

  public async consume(event: DamageEvent): Promise<EventResponse> {
    const equippedWeapon = event.source.getFirstEquippedItemAtPosition(Equipment.Weapon)
    if (equippedWeapon && equippedWeapon.weaponEffects.includes(WeaponEffect.Vampiric)) {
      return this.applyVampiricWeaponEffect(event, equippedWeapon)
    }
    return EventResponse.none(event)
  }

  private async applyVampiricWeaponEffect(event: DamageEvent, weapon: ItemEntity): Promise<EventResponse> {
    const amount = roll(2, event.amount / 3)
    event.mob.hp -= amount
    event.source.hp += amount
    this.weaponEffectService.sendMessageToMobRoom(
      event.mob,
      new ResponseMessage(
        event.mob,
        WeaponEffectMessages.Vampiric.VampiricStrike,
        { item: weapon, target: event.mob },
        { item: weapon, target: "you" },
        { item: weapon, target: event.mob }))
    return EventResponse.none(event)
  }
}
