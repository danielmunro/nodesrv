import {EventType} from "../../../event/enum/eventType"
import EventConsumer from "../../../event/eventConsumer"
import EventResponse from "../../../event/eventResponse"
import DamageEvent from "../../../mob/event/damageEvent"
import ResponseMessage from "../../../request/responseMessage"
import Maybe from "../../../support/functional/maybe"
import roll from "../../../support/random/dice"
import {ItemEntity} from "../../entity/itemEntity"
import {WeaponEffect} from "../../enum/weaponEffect"
import WeaponEffectService from "../../service/weaponEffectService"
import {WeaponEffectMessages} from "./constants"

export default class VampiricWeaponEffectEventConsumer implements EventConsumer {
  constructor(private readonly weaponEffectService: WeaponEffectService) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.DamageCalculation ]
  }

  public async consume(event: DamageEvent): Promise<EventResponse> {
    return new Maybe(WeaponEffectService.getWeaponMatchingWeaponEffect(event.source, WeaponEffect.Vampiric))
      .do(equippedWeapon => this.applyVampiricWeaponEffect(event, equippedWeapon))
      .or(() => EventResponse.none(event))
      .get()
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
