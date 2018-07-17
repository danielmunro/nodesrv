import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import roll from "../../dice/dice"
import { newFood } from "../factory"
import { Item } from "../model/item"

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

function newAcorn() {
  return newFood("an acorn", "a small hard acorn sits unassumingly on the ground.", 1)

}

function newMushroom() {
  return newFood("a wild mushroom", "a delicious-looking blue mushroom is here.", 1)
}

function newPoisonMushroom() {
  const mushroom = newFood("a wild mushroom", "a delicious-looking green mushroom is here.", 1)
  mushroom.affects.push(newAffect(AffectType.Poison, 2))

  return mushroom
}

function newBerries() {
  return newFood("wild berries", "small, round sweet forest berries are here.", 1)
}
