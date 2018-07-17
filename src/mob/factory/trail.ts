import roll from "../../random/dice"
import { newMobWithArgs } from "../factory"
import { Race } from "../race/race"

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

export function newSnail() {
  return newMobWithArgs("a snail", "a snail struggles to get out of your way",
    Race.Insect, 6, 0, 100, 1, 1, true)
}

export function newFox() {
  return newMobWithArgs("a fox", "a fox scurries through the underbrush",
    Race.Critter, 20, 0, 100, 2, 2, true)
}

export function newLizard() {
  return newMobWithArgs("a lizard", "a lizard stands in the shade under a large leaf",
    Race.Critter, 10, 0, 100, 2, 1, true)
}

export function newSparrow() {
  return newMobWithArgs(
    "a sparrow",
    "a sparrow stands on a low branch, chirping into the wind",
    Race.Critter,
    8,
    0,
    100,
    1,
    2,
    true)
}
