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
