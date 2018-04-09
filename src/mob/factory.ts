import Attributes from "../attributes/model/attributes"
import Vitals from "../attributes/model/vitals"
import { Item } from "../item/model/item"
import { Spell } from "../spell/model/spell"
import { SpellType } from "../spell/spellType"
import { Mob } from "./model/mob"
import { Race } from "./race/race"
import { addMob } from "./table"

export function newMob(
  name: string, description: string, race: Race, vitals: Vitals, attributes: Attributes, items: Item[] = []): Mob {
  const mob = new Mob()
  mob.name = name
  mob.description = description
  mob.race = race
  mob.vitals = vitals
  mob.attributes.push(attributes)
  items.map((item) => mob.inventory.addItem(item))
  addMob(mob)

  return mob
}

export function newSpell(spellType: SpellType, level: number) {
  const spell = new Spell()
  spell.spellType = spellType
  spell.level = level

  return spell
}
