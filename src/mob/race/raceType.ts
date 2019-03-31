import {Size} from "./size"

export enum RaceType {
  Human = "human",
  Dwarf = "dwarf",
  Elf = "elf",
  Drow = "drow",
  Kender = "kender",
  Halfling = "halfling",
  Gnome = "gnome",
  Faerie = "faerie",
  HalfOrc = "half-orc",
  HalfElf = "half-elf",
  Giant = "giant",
  Goblin = "goblin",

  // Nonplayable
  Insect = "insect",
  Bat = "bat",
  Bird = "bird",
  Bear = "bear",
  Cat = "cat",
  Dog = "dog",
  Fox = "fox",
  Lizard = "lizard",
  Hobgoblin = "hobgoblin",
  Kobold = "kobold",
  Orc = "orc",
  Ogre = "ogre",
  Hog = "pig",
  Rabit = "rabit",
  Snake = "snake",
  Troll = "troll",
  WaterFoul = "water foul",
  Wolf = "wolf",
  Wvyern = "wvyern",
  Critter = "critter",
  Undead = "undead",
}

export function isWarrior(race: RaceType) {
  return race === RaceType.Dwarf || race === RaceType.Kender || race === RaceType.HalfOrc || race === RaceType.Giant
}

export function isCleric(race: RaceType) {
  return race === RaceType.Dwarf || race === RaceType.Faerie || race === RaceType.Gnome
}

export function isThief(race: RaceType) {
  return race === RaceType.Kender || race === RaceType.Halfling || race === RaceType.Gnome || race === RaceType.Elf
}

export function isWizard(race: RaceType) {
  return race === RaceType.Elf || race === RaceType.Drow || race === RaceType.Faerie
}

export function isLarge(race: RaceType) {
  return race === RaceType.HalfOrc || race === RaceType.Giant
}

export function isTiny(race: RaceType) {
  return race === RaceType.Faerie || race === RaceType.Gnome
}

export function getSizeFromRace(race: RaceType) {
  if (race === RaceType.Faerie) {
    return Size.XS
  }

  if (race === RaceType.Elf || race === RaceType.Dwarf || race === RaceType.Gnome) {
    return Size.S
  }

  if (race === RaceType.HalfOrc) {
    return Size.L
  }

  if (race === RaceType.Giant) {
    return Size.XL
  }

  return Size.M
}
