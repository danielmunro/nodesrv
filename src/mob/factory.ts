import { newStartingAttributes, newStartingVitals } from "../attributes/factory"
import Attributes from "../attributes/model/attributes"
import Vitals from "../attributes/model/vitals"
import { Item } from "../item/model/item"
import { Room } from "../room/model/room"
import { Disposition } from "./enum/disposition"
import FightTable from "./fight/fightTable"
import LocationService from "./locationService"
import MobService from "./mobService"
import MobTable from "./mobTable"
import { Mob } from "./model/mob"
import MobLocation from "./model/mobLocation"
import MobReset from "./model/mobReset"
import { Race } from "./race/race"

export function newMobReset(
  mob: Mob,
  room: Room,
  maxQuantity: number,
  maxPerRoom: number): MobReset {
  const mobReset = new MobReset()
  mobReset.mob = mob
  mobReset.room = room
  mobReset.disposition = Disposition.Standing
  mobReset.maxQuantity = maxQuantity
  mobReset.maxPerRoom = maxPerRoom

  return mobReset
}

export function newMobLocation(
  mob: Mob,
  room: Room): MobLocation {
  const mobLocation = new MobLocation()
  mobLocation.mob = mob
  mobLocation.room = room

  return mobLocation
}

export function newCritterMob(name: string, description: string, level: number, race: Race = Race.Critter): Mob {
  const vitals = newStartingVitals(level)
  return newMob(
    name,
    description,
    race,
    vitals,
    newStartingAttributes(vitals.copy(), level),
    true)
}

export function newMob(name: string, description: string, race: Race, vitals: Vitals,
                       attributes: Attributes, wanders: boolean = false, items: Item[] = []): Mob {

  const mob = new Mob()
  mob.name = name
  mob.description = description
  mob.race = race
  mob.vitals = vitals
  mob.attributes.push(attributes)
  mob.traits.wanders = wanders
  items.forEach((item) => mob.inventory.addItem(item))

  return mob
}

export async function createMobService(mobTable: MobTable, aLocationService: LocationService) {
  return new MobService(new MobTable(), mobTable, new FightTable(), aLocationService)
}
