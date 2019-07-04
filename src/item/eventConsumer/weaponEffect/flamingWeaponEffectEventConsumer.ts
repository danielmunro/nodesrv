import {AffectType} from "../../../affect/enum/affectType"
import {EventType} from "../../../event/enum/eventType"
import EventConsumer from "../../../event/eventConsumer"
import EventResponse from "../../../event/eventResponse"
import {createDestroyItemEvent, createModifiedDamageEvent} from "../../../event/factory/eventFactory"
import EventService from "../../../event/service/eventService"
import {MobEntity} from "../../../mob/entity/mobEntity"
import DamageEvent from "../../../mob/event/damageEvent"
import {DamageType} from "../../../mob/fight/enum/damageType"
import vulnerabilityModifier from "../../../mob/fight/vulnerabilityModifier"
import LocationService from "../../../mob/service/locationService"
import ResponseBuilder from "../../../request/builder/responseBuilder"
import {RoomEntity} from "../../../room/entity/roomEntity"
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
      await this.checkForFlammableEquipment(event.mob)
      return this.checkForRacialVulnerability(event, equippedWeapon)
    }
    return EventResponse.none(event)
  }

  private async checkForFlammableEquipment(mob: MobEntity) {
    mob.equipped.items.forEach(async item => {
      if (isMaterialFlammable(item.material) && !item.affect().has(AffectType.Fireproof)) {
        await this.calculateBurningEquipment(item, mob)
      }
    })
  }

  private async checkForRacialVulnerability(event: DamageEvent, weapon: ItemEntity): Promise<EventResponse> {
    const damageAbsorption = event.mob.race().damageAbsorption.find(damage => damage.damageType === DamageType.Fire)
    if (damageAbsorption && roll(1, 8) === 1) {
      const room = this.locationService.getRoomForMob(event.mob)
      this.clientService.sendResponseToRoom(
        ResponseBuilder.createResponse(
          event.mob,
          room,
          WeaponEffectMessages.Flame.MobBurned,
          { item: weapon, target: event.mob + "'s", target2: "they" },
          { item: weapon, target: "your", target2: "you"},
          { item: weapon, target: event.mob + "'s", target2: "they" }))
      return EventResponse.modified(createModifiedDamageEvent(
        event, vulnerabilityModifier(damageAbsorption.vulnerability)))
    }
    return EventResponse.none(event)
  }

  private async calculateBurningEquipment(item: ItemEntity, mob: MobEntity) {
    if (roll(1, 10) === 1) {
      await this.eventService.publish(createDestroyItemEvent(item))
      const room = this.locationService.getRoomForMob(mob)
      if (item.isContainer()) {
        this.dropContainerContents(item, room)
      }
      this.clientService.sendResponseToRoom(
        ResponseBuilder.createResponse(
          mob,
          room,
          WeaponEffectMessages.Flame.ItemBurned,
          { item, target: mob },
          { item, target: "you" },
          { item, target: mob }))
    }
  }

  private dropContainerContents(item: ItemEntity, room: RoomEntity) {
    item.container.inventory.items.forEach(i =>
      room.inventory.addItem(i))
  }
}
