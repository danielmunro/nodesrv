export enum Race {
  Human = "human",
  Dwarf = "dwarf",
  Elf = "elf",
  Drow = "drow",
  Kender = "kender",
  Halfling = "halfling",
  Gnome = "gnome",
  Faerie = "faerie",
  HalfOrc = "half-orc",
  Giant = "giant",

  // Nonplayable
  Insect = "insect",
  Critter = "critter",
}

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
