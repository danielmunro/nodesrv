import { Attributes } from "../../attributes/attributes"
import { HitDam } from "../../attributes/hitdam"
import { Stats } from "../../attributes/stats"
import { Vitals } from "../../attributes/vitals"
import { modifiers, Modifier } from "./modifier"

const startingVitals = new Vitals(20, 100, 100)
const baseStat = 15

export enum Race {
  Human,
  Dwarf,
  Elf,
  Drow,
  Kender,
  Halfling,
  Gnome,
  Faerie,
  HalfOrc,
  Giant,
}

export function isWarrior(race: Race) {
  return race == Race.Dwarf || race == Race.Kender || race == Race.HalfOrc || race == Race.Giant
}

export function isCleric(race: Race) {
  return race == Race.Dwarf || race == Race.Faerie || race == Race.Gnome
}

export function isThief(race: Race) {
  return race == Race.Kender || race == Race.Halfling || race == Race.Gnome || race == Race.Elf
}

export function isWizard(race: Race) {
  return race == Race.Elf || race == Race.Drow || race == Race.Faerie
}

export function isLarge(race: Race) {
  return race == Race.HalfOrc || race == Race.Giant
}

export function isTiny(race: Race) {
  return race == Race.Faerie || race == Race.Gnome
}

/**
export function isLongLiving(race: Race) {
  return race == Race.Dwarf || race == Race.Elf || race == Race.Drow || race == Race.Faerie
}

export function isShortLiving(race: Race) {
  return race == Race.Kender || race == Race.HalfOrc
}
*/

function getAttributesFromRace(race: Race): Attributes {
  let hit = 1
  let dam = 1

  let str = baseStat
  let int = baseStat
  let wis = baseStat
  let dex = baseStat
  let con = baseStat
  let sta = baseStat

  return modifiers.reduce(
    (accumulator: Attributes, currentModifier: Modifier) => currentModifier(race, accumulator),
    new Attributes(
      new HitDam(hit, dam),
      new Stats(str, int, wis, dex, con, sta),
      startingVitals))
}
