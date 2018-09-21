import { Race } from "./race"

export enum BodyPart {
  Brains = "brains",
  Guts = "guts",
  Head = "head",
  Arms = "arms",
  Legs = "legs",
  Heart = "heart",
  Hands = "hands",
  Feet = "feet",
  Fingers = "fingers",
  Ear = "ear",
  Eye = "eye",
  LongTongue = "long tongue",
  Wings = "wings",
  Tail = "tail",
  Claws = "claws",
  Fangs = "fangs",
  Horns = "horns",
  Scales = "scales",
  Tusks = "tusks",
  Fur = "fur",
}

function newDefinition(race: Race, bodyParts: BodyPart[]) {
  return { race, bodyParts }
}

const standardPackage = [BodyPart.Head, BodyPart.Brains, BodyPart.Ear, BodyPart.Guts, BodyPart.Feet,
  BodyPart.Arms, BodyPart.Legs, BodyPart.Heart, BodyPart.Hands, BodyPart.Fingers, BodyPart.Eye]
const quadruped = [BodyPart.Head, BodyPart.Brains, BodyPart.Ear, BodyPart.Guts,
  BodyPart.Legs, BodyPart.Heart, BodyPart.Eye, BodyPart.Fur]

export default [
  // non-playable
  newDefinition(Race.Lizard, [BodyPart.Head, BodyPart.Tail, BodyPart.Scales, BodyPart.Horns]),
  newDefinition(Race.Bird, [BodyPart.Wings, BodyPart.Claws]),
  newDefinition(Race.Insect, [BodyPart.Guts, BodyPart.Wings]),
  newDefinition(Race.Fox, [BodyPart.Brains, BodyPart.Tail, BodyPart.Ear, BodyPart.Guts, BodyPart.Heart]),
  newDefinition(Race.Bat, [BodyPart.Wings, BodyPart.Fangs]),
  newDefinition(Race.Bear, quadruped),
  newDefinition(Race.Cat, quadruped),
  newDefinition(Race.Dog, quadruped),
  newDefinition(Race.Hobgoblin, standardPackage),
  newDefinition(Race.Kobold, standardPackage),
  newDefinition(Race.Orc, [...standardPackage, BodyPart.LongTongue, BodyPart.Claws]),
  newDefinition(Race.Ogre, [...standardPackage, BodyPart.Fangs]),
  newDefinition(Race.Hog, [...quadruped, BodyPart.Tusks]),
  newDefinition(Race.Rabit, quadruped),
  newDefinition(Race.Snake, [BodyPart.Scales, BodyPart.Fangs]),
  newDefinition(Race.Troll, [...standardPackage, BodyPart.Fangs, BodyPart.Horns]),
  newDefinition(Race.WaterFoul, [BodyPart.Wings, BodyPart.Claws]),
  newDefinition(Race.Wolf, quadruped),
  newDefinition(Race.Wvyern, [BodyPart.Scales, BodyPart.Wings, BodyPart.Ear, BodyPart.Eye,
    BodyPart.Legs, BodyPart.Claws, BodyPart.Fangs, BodyPart.LongTongue]),
  newDefinition(Race.Critter, []),

  // playable
  newDefinition(Race.Human, standardPackage),
  newDefinition(Race.Dwarf, standardPackage),
  newDefinition(Race.Elf, standardPackage),
  newDefinition(Race.Drow, standardPackage),
  newDefinition(Race.Kender, standardPackage),
  newDefinition(Race.Halfling, standardPackage),
  newDefinition(Race.Gnome, standardPackage),
  newDefinition(Race.Faerie, standardPackage),
  newDefinition(Race.HalfOrc, [...standardPackage, BodyPart.Fangs, BodyPart.Horns]),
  newDefinition(Race.HalfElf, standardPackage),
  newDefinition(Race.Giant, standardPackage),
  newDefinition(Race.Goblin, [...standardPackage, BodyPart.Fangs, BodyPart.LongTongue]),
]
