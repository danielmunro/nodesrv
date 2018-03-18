import Attributes from "../attributes/model/attributes"
import Vitals from "../attributes/model/vitals"
import { Item } from "../item/model/item"
import { Mob } from "./model/mob"
import { Race } from "./race/race"

export function newMob(
  name: string, description: string, race: Race, vitals: Vitals, attributes: Attributes, items: Item[] = []): Mob {
  const mob = new Mob()
  mob.name = name
  mob.description = description
  mob.race = race
  mob.vitals = vitals
  mob.attributes.push(attributes)
  items.map((item) => mob.inventory.addItem(item))

  return mob
}
