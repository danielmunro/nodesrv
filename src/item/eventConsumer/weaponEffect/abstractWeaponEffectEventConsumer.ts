import { inject, injectable } from "inversify"
import {EventType} from "../../../event/enum/eventType"
import EveryMessageEventConsumer from "../../../event/eventConsumer/everyMessageEventConsumer"
import EventConsumer from "../../../event/interface/eventConsumer"
import EventResponse from "../../../event/messageExchange/eventResponse"
import DamageEvent from "../../../mob/event/damageEvent"
import Maybe from "../../../support/functional/maybe/maybe"
import {Types} from "../../../support/types"
import {ItemEntity} from "../../entity/itemEntity"
import {WeaponEffect} from "../../enum/weaponEffect"
import WeaponEffectService from "../../service/weaponEffectService"

@injectable()
// tslint:disable-next-line:max-line-length
export default abstract class AbstractWeaponEffectEventConsumer extends EveryMessageEventConsumer implements EventConsumer {
  public static defaultBonus = 0.15

  constructor(
    @inject(Types.WeaponEffectService) protected readonly weaponEffectService: WeaponEffectService) {
    super()
  }

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.DamageCalculation ]
  }

  public async consume(event: DamageEvent): Promise<EventResponse> {
    return new Maybe<EventResponse>
    (WeaponEffectService.getWeaponMatchingWeaponEffect(event.source, this.getWeaponEffect()))
      .do(async equippedWeapon => this.applyWeaponEffect(event, equippedWeapon))
      .or(() => EventResponse.none(event))
      .get()
  }

  public abstract getWeaponEffect(): WeaponEffect

  public abstract applyWeaponEffect(event: DamageEvent, weapon: ItemEntity): Promise<EventResponse>
}
