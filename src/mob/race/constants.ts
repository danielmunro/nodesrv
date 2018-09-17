import { clericModifier, largeModifier, thiefModifier, tinyModifier, warriorModifier, wizardModifier } from "./modifier"
import { Race } from "./race"

export const allRaces = [
  Race.Human,
  Race.Dwarf,
  Race.Elf,
  Race.Drow,
  Race.Kender,
  Race.Halfling,
  Race.Gnome,
  Race.Faerie,
  Race.HalfOrc,
  Race.Giant,
]
export const modifiers = [
  warriorModifier,
  thiefModifier,
  wizardModifier,
  clericModifier,
  tinyModifier,
  largeModifier,
]
