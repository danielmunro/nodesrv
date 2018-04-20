import { newAttributes, newHitroll, newStartingStats, newVitals } from "../../attributes/factory"
import { newMob } from "../factory"
import { Race } from "../race/race"

export function newTraveller(name: string, description: string) {
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
