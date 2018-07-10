import { newAttributes, newHitroll, newStartingStats, newVitals } from "../../attributes/factory"
import { newMob } from "../factory"
import { Mob } from "../model/mob"
import { Race } from "../race/race"
import { Role } from "../role"

export function newTraveller(name: string, description: string): Mob {
  return newMob(
    name,
    description,
    Race.Human,
    newVitals(100, 100, 100),
    newAttributes(
      newVitals(100, 100, 100),
      newStartingStats(),
      newHitroll(2, 3)),
  )
}

export function newTrainer(): Mob {
  const mob = newMob(
    "A trainer sits at the bar",
    "Something about a trainer",
    Race.Human,
    newVitals(100, 100, 100),
    newAttributes(
      newVitals(100, 100, 100),
      newStartingStats(),
      newHitroll(2, 3)))
  mob.role = Role.Trainer

  return mob
}
