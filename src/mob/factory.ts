import { Item } from "../item/model/item"
import { Mob } from "./model/mob"
import { Race } from "./race/race"

export function newMob(name: string, description: string, race: Race, items: Item[] = []): Mob {
  const mob = new Mob()
  mob.name = name
  mob.description = description
  mob.race = race
  items.map((item) => mob.inventory.addItem(item))

  return mob
}
