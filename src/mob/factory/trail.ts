import { newAttributes, newHitroll, newStartingStats, newVitals } from "../../attributes/factory"
import roll from "../../dice/dice"
import { newMob } from "../factory"
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
  return newMob(
    "a snail",
    "a snail struggles to get out of your way",
    Race.Insect,
    newVitals(6, 0, 100),
    newAttributes(
      newVitals(6, 0, 100),
      newStartingStats(),
      newHitroll(1, 1)),
    true)
}

export function newFox() {
  return newMob(
    "a fox",
    "a fox scurries through the underbrush",
    Race.Critter,
    newVitals(20, 0, 100),
    newAttributes(
      newVitals(20, 0, 100),
      newStartingStats(),
      newHitroll(2, 2)),
    true)
}

export function newLizard() {
  return newMob(
    "a lizard",
    "a lizard stands in the shade under a large leaf",
    Race.Critter,
    newVitals(10, 0, 100),
    newAttributes(
      newVitals(10, 0, 100),
      newStartingStats(),
      newHitroll(2, 1)),
    true)
}

export function newSparrow() {
  return newMob(
    "a sparrow",
    "a sparrow stands on a low branch, chirping into the wind",
    Race.Critter,
    newVitals(8, 0, 100),
    newAttributes(
      newVitals(8, 0, 100),
      newStartingStats(),
      newHitroll(1, 2)),
    true)
}
