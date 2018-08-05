import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import roll from "../../random/dice"
import { newFood } from "../factory"
import { Item } from "../model/item"

export function newForestItem(): Item {
  switch (roll(1, 4)) {
    case 1:
      return newFood(
        "an acorn",
        "a small hard acorn sits unassumingly on the ground.")
    case 2:
      return newFood(
        "an off white wild mushroom",
        "a delicious-looking blue mushroom is here.")
    case 3:
      return newPoisonMushroom()
    default:
      return newFood(
        "wild berries",
        "small, round sweet forest berries are here.")
  }
}

function newPoisonMushroom(): Item {
  const mushroom = newFood(
    "a wild mushroom with green circles",
    "a delicious-looking green mushroom is here.")
  mushroom.affects.push(newAffect(AffectType.Poison, 2))

  return mushroom
}
