import {SpellEntity} from "./entity/spellEntity"
import {SpellType} from "./spellType"

export function newSpell(spellType: SpellType, level: number = 1, levelObtained: number = 1): SpellEntity {
  const spell = new SpellEntity()
  spell.spellType = spellType
  spell.level = level
  spell.levelObtained = levelObtained

  return spell
}
