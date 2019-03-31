import { newFood, newTrash, poison } from "../../item/factory"
import { Item } from "../../item/model/item"
import { pickOne } from "../../random/helpers"
import { Messages as ServerObserverMessages } from "../../server/observers/constants"
import { format } from "../../support/string"
import { Mob } from "../model/mob"
import { Messages } from "./constants"
import { RaceType } from "./raceType"

export enum BodyPart {
  Brains = "brains",
  Guts = "guts",
  Head = "head",
  Arm = "arms",
  Leg = "legs",
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

function newDefinition(race: RaceType, parts: BodyPart[]) {
  return { race, bodyParts: parts }
}

const standardPackage = [BodyPart.Head, BodyPart.Brains, BodyPart.Ear, BodyPart.Guts, BodyPart.Feet,
  BodyPart.Arm, BodyPart.Leg, BodyPart.Heart, BodyPart.Hands, BodyPart.Fingers, BodyPart.Eye]
const quadruped = [BodyPart.Head, BodyPart.Brains, BodyPart.Ear, BodyPart.Guts,
  BodyPart.Leg, BodyPart.Heart, BodyPart.Eye, BodyPart.Fur]

/* istanbul ignore next */
export function getRandomBodyPartForRace(race: RaceType): BodyPart {
  return pickOne(bodyParts.find(p => p.race === race).bodyParts)
}

/* istanbul ignore next */
export function getBodyPartItem(mob: Mob, bodyPart: BodyPart): Item {
  switch (bodyPart) {
    case BodyPart.Guts:
      return poison(newFood(
        format(Messages.Guts.Name, mob.name),
        format(Messages.Guts.Description, mob.name)))
    case BodyPart.Head:
      return newTrash(
        format(Messages.Head.Name, mob.name),
        format(Messages.Head.Description, mob.name))
    case BodyPart.Heart:
      return newFood(
        format(Messages.Heart.Name, mob.name),
        format(Messages.Heart.Description, mob.name))
    case BodyPart.Arm:
      return newTrash(
        format(Messages.Arm.Name, mob.name),
        format(Messages.Arm.Description, mob.name))
    case BodyPart.Leg:
      return newTrash(
        format(Messages.Leg.Name, mob.name),
        format(Messages.Leg.Description, mob.name))
    case BodyPart.Brains:
      return newFood(
        format(Messages.Brains.Name, mob.name),
        format(Messages.Brains.Description, mob.name))
    default:
      return newTrash(
        format(Messages.Trash.Name, bodyPart, mob.name),
        format(Messages.Trash.Description, bodyPart, mob.name))
  }
}

/* istanbul ignore next */
const bodyParts = [
  // non-playable
  newDefinition(RaceType.Lizard, [BodyPart.Head, BodyPart.Tail, BodyPart.Scales, BodyPart.Horns]),
  newDefinition(RaceType.Bird, [BodyPart.Wings, BodyPart.Claws]),
  newDefinition(RaceType.Insect, [BodyPart.Guts, BodyPart.Wings]),
  newDefinition(RaceType.Fox, [BodyPart.Brains, BodyPart.Tail, BodyPart.Ear, BodyPart.Guts, BodyPart.Heart]),
  newDefinition(RaceType.Bat, [BodyPart.Wings, BodyPart.Fangs]),
  newDefinition(RaceType.Bear, quadruped),
  newDefinition(RaceType.Cat, quadruped),
  newDefinition(RaceType.Dog, quadruped),
  newDefinition(RaceType.Hobgoblin, standardPackage),
  newDefinition(RaceType.Kobold, standardPackage),
  newDefinition(RaceType.Orc, [...standardPackage, BodyPart.LongTongue, BodyPart.Claws]),
  newDefinition(RaceType.Ogre, [...standardPackage, BodyPart.Fangs]),
  newDefinition(RaceType.Hog, [...quadruped, BodyPart.Tusks]),
  newDefinition(RaceType.Rabit, quadruped),
  newDefinition(RaceType.Snake, [BodyPart.Scales, BodyPart.Fangs]),
  newDefinition(RaceType.Troll, [...standardPackage, BodyPart.Fangs, BodyPart.Horns]),
  newDefinition(RaceType.WaterFoul, [BodyPart.Wings, BodyPart.Claws]),
  newDefinition(RaceType.Wolf, quadruped),
  newDefinition(RaceType.Wvyern, [BodyPart.Scales, BodyPart.Wings, BodyPart.Ear, BodyPart.Eye,
    BodyPart.Leg, BodyPart.Claws, BodyPart.Fangs, BodyPart.LongTongue]),
  newDefinition(RaceType.Critter, [BodyPart.Guts, BodyPart.Brains, BodyPart.Head]),

  // playable
  newDefinition(RaceType.Human, standardPackage),
  newDefinition(RaceType.Dwarf, standardPackage),
  newDefinition(RaceType.Elf, standardPackage),
  newDefinition(RaceType.Drow, standardPackage),
  newDefinition(RaceType.Kender, standardPackage),
  newDefinition(RaceType.Halfling, standardPackage),
  newDefinition(RaceType.Gnome, standardPackage),
  newDefinition(RaceType.Faerie, standardPackage),
  newDefinition(RaceType.HalfOrc, [...standardPackage, BodyPart.Fangs, BodyPart.Horns]),
  newDefinition(RaceType.HalfElf, standardPackage),
  newDefinition(RaceType.Giant, standardPackage),
  newDefinition(RaceType.Goblin, [...standardPackage, BodyPart.Fangs, BodyPart.LongTongue]),
]

/* istanbul ignore next */
export function getBodyPartMessage(mob: Mob, bodyPart: BodyPart): string {
  const m = ServerObserverMessages.Fight.BodyParts
  switch (bodyPart) {
    case BodyPart.Guts:
      return format(m.Guts, mob.name, mob.gender)
    case BodyPart.Head:
      return format(m.Head, mob.name, mob.gender)
    case BodyPart.Heart:
      return format(m.Heart, mob.name, mob.gender)
    case BodyPart.Brains:
      return format(m.Brains, mob.name, mob.gender)
    default:
      return format(m.Default, mob.name, bodyPart, mob.gender)
  }
}
