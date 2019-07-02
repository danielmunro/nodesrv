import {AffectType} from "../../../affect/enum/affectType"
import {EventType} from "../../../event/enum/eventType"
import EventConsumer from "../../../event/eventConsumer"
import EventResponse from "../../../event/eventResponse"
import {createDestroyItemEvent} from "../../../event/factory/eventFactory"
import EventService from "../../../event/service/eventService"
import {MobEntity} from "../../../mob/entity/mobEntity"
import DamageEvent from "../../../mob/event/damageEvent"
import LocationService from "../../../mob/service/locationService"
import ResponseBuilder from "../../../request/builder/responseBuilder"
import ClientService from "../../../server/service/clientService"
import roll from "../../../support/random/dice"
import {ItemEntity} from "../../entity/itemEntity"
import {Equipment} from "../../enum/equipment"
import {WeaponEffect} from "../../enum/weaponEffect"
import {isMaterialFlammable} from "../../service/materialProperties"
import {WeaponEffectMessages} from "./constants"

export default class FlamingWeaponEffectEventConsumer implements EventConsumer {
  constructor(
    private readonly eventService: EventService,
    private readonly locationService: LocationService,
    private readonly clientService: ClientService) {}

  public getConsumingEventTypes(): EventType[] {
    return [ EventType.DamageCalculation ]
  }

  public async consume(event: DamageEvent): Promise<EventResponse> {
    const equippedWeapon = event.source.getFirstEquippedItemAtPosition(Equipment.Weapon)
    if (equippedWeapon && equippedWeapon.weaponEffects.includes(WeaponEffect.Flaming)) {
      event.mob.equipped.items.forEach(async item => {
        if (isMaterialFlammable(item.material) && !item.affect().has(AffectType.Fireproof)) {
          await this.calculateBurningEquipment(item, event.mob)
        }
      })
    }
    return EventResponse.none(event)
  }

  private async calculateBurningEquipment(item: ItemEntity, mob: MobEntity) {
    if (roll(1, 8) === 1) {
      await this.eventService.publish(createDestroyItemEvent(item))
      this.clientService.sendResponseToRoom(
        ResponseBuilder.createResponse(
          mob,
          this.locationService.getRoomForMob(mob),
          WeaponEffectMessages.flamingWeaponEffect,
          { item, target: mob },
          { item, target: "you" },
          { item, target: mob }))
    }
  }
}
