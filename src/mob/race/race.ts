// import { Vitals } from "../../attributes/vitals"

// const startingVitals = new Vitals(20, 100, 100)
// const baseStat = 15

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

  // Nonplayable
  Insect,
  Critter,
}

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

export function isWarrior(race: Race) {
  return race === Race.Dwarf || race === Race.Kender || race === Race.HalfOrc || race === Race.Giant
}

export function isCleric(race: Race) {
  return race === Race.Dwarf || race === Race.Faerie || race === Race.Gnome
}

export function isThief(race: Race) {
  return race === Race.Kender || race === Race.Halfling || race === Race.Gnome || race === Race.Elf
}

export function isWizard(race: Race) {
  return race === Race.Elf || race === Race.Drow || race === Race.Faerie
}

export function isLarge(race: Race) {
  return race === Race.HalfOrc || race === Race.Giant
}

export function isTiny(race: Race) {
  return race === Race.Faerie || race === Race.Gnome
}

// export function isLongLiving(race: Race) {
//   return race === Race.Dwarf || race === Race.Elf || race === Race.Drow || race === Race.Faerie
// }

// export function isShortLiving(race: Race) {
//   return race === Race.Kender || race === Race.HalfOrc
// }

// export function isAdventurous(race: Race) {
//   return race === Race.Human || race === Race.Kender || race === Race.Drow || race === Race.Gnome
// }

// function getAttributesFromRace(race: Race): Attributes {
//   return modifiers.reduce(
//     (accumulator: Attributes, currentModifier: Modifier) => currentModifier(race, accumulator),
//     new Attributes(
//       new HitDam(hit, dam),
//       new Stats(str, int, wis, dex, con, sta),
//       startingVitals))
// }
