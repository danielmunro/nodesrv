import {Spell} from "./model/spell"
import {SpellType} from "./spellType"

export function newSpell(spellType: SpellType, level: number = 1) {
  const spell = new Spell()
  spell.spellType = spellType
  spell.level = level

  return spell
}
