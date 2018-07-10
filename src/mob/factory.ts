import { newAttributes, newHitroll, newStartingStats, newVitals } from "../attributes/factory"
import Attributes from "../attributes/model/attributes"
import Vitals from "../attributes/model/vitals"
import { Item } from "../item/model/item"
import { getTestMob } from "../test/mob"
import { Mob } from "./model/mob"
import { Race } from "./race/race"
import { Role } from "./role"

export function newMob(name: string, description: string, race: Race, vitals: Vitals,
                       attributes: Attributes, wanders: boolean = false, items: Item[] = []): Mob {

  const mob = new Mob()
  mob.name = name
  mob.description = description
  mob.race = race
  mob.vitals = vitals
  mob.attributes.push(attributes)
  mob.wanders = wanders
  items.forEach((item) => mob.inventory.addItem(item))

  return mob
}

export function newMobWithArgs(
  name: string,
  description: string,
  race: Race,
  hp: number,
  mana: number,
  mv: number,
  hit: number,
  dam: number,
  wanders: boolean) {
  return newMob(
    name,
    description,
    race,
    newVitals(hp, mana, mv),
    newAttributes(
      newVitals(hp, mana, mv),
      newStartingStats(),
      newHitroll(hit, dam)),
    wanders)
}

export function getMerchantMob(): Mob {
  const mob = getTestMob()
  mob.role = Role.Merchant

  return mob
}
