import {
  newAttributes,
  newHitroll,
  newStartingAttributes,
  newStartingStats,
  newStartingVitals,
  newVitals,
} from "../attributes/factory"
import Attributes from "../attributes/model/attributes"
import Vitals from "../attributes/model/vitals"
import { Item } from "../item/model/item"
import { Mob } from "./model/mob"
import { Race } from "./race/race"

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
  mob.wanders = wanders
  items.forEach((item) => mob.inventory.addItem(item))

  return mob
}
