import { newFood, newTrash, poison } from "../../item/factory"
import { Item } from "../../item/model/item"
import { pickOne } from "../../random/helpers"
import { format } from "../../support/string"
import { Mob } from "../model/mob"
import { Race } from "./race"

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

function newDefinition(race: Race, parts: BodyPart[]) {
  return { race, bodyParts: parts }
}

const standardPackage = [BodyPart.Head, BodyPart.Brains, BodyPart.Ear, BodyPart.Guts, BodyPart.Feet,
  BodyPart.Arm, BodyPart.Leg, BodyPart.Heart, BodyPart.Hands, BodyPart.Fingers, BodyPart.Eye]
const quadruped = [BodyPart.Head, BodyPart.Brains, BodyPart.Ear, BodyPart.Guts,
  BodyPart.Leg, BodyPart.Heart, BodyPart.Eye, BodyPart.Fur]

export function getRandomBodyPartForRace(race: Race): BodyPart {
  return pickOne(bodyParts.find(p => p.race === race).bodyParts)
}

export function getBodyPartItem(mob: Mob, bodyPart: BodyPart): Item {
  switch (bodyPart) {
    case BodyPart.Guts:
      return poison(newFood(
        format("the guts of {0}", mob.name),
        format("the guts of {0} are here.", mob.name)))
    case BodyPart.Head:
      return newTrash(
        format("the head of {0}", mob.name),
        format("the head of {0} sits here, staring at you.", mob.name))
    case BodyPart.Heart:
      return newFood(
        format("the heart of {0}", mob.name),
        format("the heart of {0} is here.", mob.name))
    case BodyPart.Arm:
      return newTrash(
        format("an arm of {0}", mob.name),
        format("an arm of {0} is lying here.", mob.name))
    case BodyPart.Leg:
      return newTrash(
        format("a leg of {0}", mob.name),
        format("a leg of {0} lays here.", mob.name))
    case BodyPart.Brains:
      return newFood(
        format("the brain of {0}", mob.name),
        format("the brain of {0} sits here.", mob.name))
  }

  return newTrash(
    format("the {0} of {1}", bodyPart, mob.name),
    format("the {0} of {1} is here.", bodyPart, mob.name))
}

const bodyParts = [
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
    BodyPart.Leg, BodyPart.Claws, BodyPart.Fangs, BodyPart.LongTongue]),
  newDefinition(Race.Critter, [BodyPart.Guts, BodyPart.Brains, BodyPart.Head]),

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
