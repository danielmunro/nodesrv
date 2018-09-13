import roll from "../../random/dice"
import { newCritterMob } from "../factory"

export function newCritter() {
  switch (roll(1, 4)) {
    case 1:
      return newSnail()
    case 2:
      return newFox()
    case 3:
      return newLizard()
    default:
      return newSparrow()
  }
}

export function newSnail(level: number = 1) {
  return newCritterMob(
    "a snail",
    "a snail struggles to get out of your way",
    level)
}

export function newFox(level: number = 3) {
  return newCritterMob(
    "a fox",
    "a fox scurries through the underbrush",
    level)
}

export function newLizard(level: number = 2) {
  return newCritterMob(
    "a lizard",
    "a lizard stands in the shade under a large leaf",
    level)
}

export function newSparrow(level: number = 2) {
  return newCritterMob(
    "a sparrow",
    "a sparrow stands on a low branch, chirping into the wind",
    level)
}
