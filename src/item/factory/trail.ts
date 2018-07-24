import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import roll from "../../random/dice"
import { newFood } from "../factory"
import { Item } from "../model/item"
import { Quest } from "../../quest/quest"

export function newForestItem(): Item {
  switch (roll(1, 4)) {
    case 1:
      return newAcorn()
    case 2:
      return newMushroom()
    case 3:
      return newPoisonMushroom()
    default:
      return newBerries()
  }
}

function newAcorn(): Item {
  const food = newFood(
    "an acorn",
    "a small hard acorn sits unassumingly on the ground.",
    1)
  // food.quest = Quest.CollectForestMorsels

  return food
}

function newMushroom(): Item {
  const food = newFood(
    "an off white wild mushroom",
    "a delicious-looking blue mushroom is here.",
    1)
  // food.quest = Quest.CollectForestMorsels

  return food
}

function newPoisonMushroom(): Item {
  const mushroom = newFood(
    "a wild mushroom with green circles",
    "a delicious-looking green mushroom is here.",
    1)
  mushroom.affects.push(newAffect(AffectType.Poison, 2))

  return mushroom
}

function newBerries(): Item {
  const food = newFood(
    "wild berries",
    "small, round sweet forest berries are here.",
    1)
  // food.quest = Quest.CollectForestMorsels

  return food
}
